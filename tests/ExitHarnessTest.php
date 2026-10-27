<?php
declare(strict_types=1);

namespace Rusbi\Tests;

use PDO;
use Exception;
use Rusbi\Accounting\PostingService;
use Rusbi\Accounting\PostingException;
use Rusbi\Cron\NightlyIntegrityCheck;

require_once __DIR__ . '/../src/Accounting/PostingException.php';
require_once __DIR__ . '/../src/Accounting/PostingService.php';
require_once __DIR__ . '/../src/Cron/NightlyIntegrityCheck.php';

/**
 * Rusbi Bakery OS · Sprint 0 Exit Test Harness
 * 9 Mission-Critical GL and Sub-Ledger Verification Tests
 */
class ExitHarnessTest
{
    private PDO $pdo;
    private PostingService $posting;
    private NightlyIntegrityCheck $cron;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
        $this->posting = new PostingService($pdo);
        $this->cron = new NightlyIntegrityCheck($pdo, $this->posting);
    }

    public static function createTestDb(): PDO
    {
        $pdo = new PDO('sqlite::memory:', null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        $pdo->exec("PRAGMA foreign_keys = ON;");

        $schema = file_get_contents(__DIR__ . '/../database/schema_sqlite.sql');
        $pdo->exec($schema);

        $seeds = file_get_contents(__DIR__ . '/../database/seeds.sql');
        $pdo->exec($seeds);

        // Add sample parent account to test is_leaf invariant
        $pdo->exec("
            INSERT INTO accounts (code, name, type, normal_balance, is_leaf, is_active)
            VALUES ('1000', 'Current Assets Summary', 'asset', 'debit', 0, 1)
        ");

        return $pdo;
    }

    public function runAll(): array
    {
        $results = [];
        $tests = [
            'test1_PostCashSale' => 'Test 1: Post cash sale (D 1010 / C 4010) balanced with snapshot',
            'test2_PostBashiSale' => 'Test 2: Post Bashi credit sale (D 1200 / C 4010) linked to rb_bashi_ledger',
            'test3_IdempotencyReplay' => 'Test 3: Replay idempotency key returns duplicate status without creating journal',
            'test4_UnbalancedJournalRollback' => 'Test 4: Post unbalanced journal throws exception and rolls back',
            'test5_InvalidLineBothDebitCredit' => 'Test 5: Post invalid line with debit & credit > 0 throws exception',
            'test6_ParentAccountRejection' => 'Test 6: Post to parent account (is_leaf=0) throws exception',
            'test7_PostAndReverse' => 'Test 7: Post journal and reverse immutably with net zero balance',
            'test8_NightlyIntegrityCheck' => 'Test 8: Nightly integrity audit returns OK with balanced GL',
            'test9_FullDaySimulationTieOut' => 'Test 9: Full day multi-tender sales and safe drops tie out to trial balance'
        ];

        foreach ($tests as $method => $title) {
            try {
                $this->$method();
                $results[] = ['test' => $title, 'passed' => true, 'message' => 'Passed'];
            } catch (Exception $e) {
                $results[] = ['test' => $title, 'passed' => false, 'error' => $e->getMessage()];
            }
        }

        return $results;
    }

    public function test1_PostCashSale(): void
    {
        $res = $this->posting->post(
            ['date' => '2026-10-27', 'memo' => 'Cash sale 50 loaves', 'source_type' => 'sale', 'source_id' => 101],
            [
                ['account_code' => '1010', 'debit' => 50000.00, 'credit' => 0.0],
                ['account_code' => '4010', 'debit' => 0.0, 'credit' => 50000.00]
            ],
            'TEST-CASH-SALE-001'
        );

        if ($res['status'] !== 'posted') {
            throw new Exception("Expected status 'posted', got '{$res['status']}'");
        }

        $stmt = $this->pdo->prepare("SELECT * FROM journal_lines WHERE journal_id = :jid ORDER BY id ASC");
        $stmt->execute([':jid' => $res['journal_id']]);
        $lines = $stmt->fetchAll();

        if (count($lines) !== 2) {
            throw new Exception("Expected 2 lines, got " . count($lines));
        }
        if ($lines[0]['account_code_snapshot'] !== '1010' || (float)$lines[0]['debit'] !== 50000.0) {
            throw new Exception("Debit line snapshot or amount mismatch");
        }
        if ($lines[1]['account_code_snapshot'] !== '4010' || (float)$lines[1]['credit'] !== 50000.0) {
            throw new Exception("Credit line snapshot or amount mismatch");
        }
    }

    public function test2_PostBashiSale(): void
    {
        $res = $this->posting->post(
            ['date' => '2026-10-27', 'memo' => 'Bashi credit sale to Alhaji Ishaq', 'source_type' => 'bashi_sale', 'source_id' => 3],
            [
                ['account_code' => '1200', 'debit' => 120000.00, 'credit' => 0.0],
                ['account_code' => '4010', 'debit' => 0.0, 'credit' => 120000.00]
            ],
            'TEST-BASHI-SALE-002',
            ['event_type' => 'bashi_sale', 'entity_type' => 'party', 'entity_id' => 3, 'actor_user_id' => 8]
        );

        $journalId = $res['journal_id'];

        // Sub-ledger insertion
        $stmt = $this->pdo->prepare("
            INSERT INTO rb_bashi_ledger (
                party_id, entry_date, event_type, amount, direction, running_balance, ref, gl_journal_id, actor_user_id
            ) VALUES (
                3, '2026-10-27', 'sale', 120000.00, 'debit', 120000.00, 'INV-BASHI-002', :jid, 8
            )
        ");
        $stmt->execute([':jid' => $journalId]);

        // Verify linkage
        $checkStmt = $this->pdo->prepare("SELECT gl_journal_id FROM rb_bashi_ledger WHERE gl_journal_id = :jid");
        $checkStmt->execute([':jid' => $journalId]);
        if (!$checkStmt->fetchColumn()) {
            throw new Exception("Bashi sub-ledger not linked to GL journal ID");
        }
    }

    public function test3_IdempotencyReplay(): void
    {
        $res = $this->posting->post(
            ['date' => '2026-10-27', 'memo' => 'First attempt', 'source_type' => 'sale', 'source_id' => 102],
            [
                ['account_code' => '1010', 'debit' => 10000.00, 'credit' => 0.0],
                ['account_code' => '4010', 'debit' => 0.0, 'credit' => 10000.00]
            ],
            'IDEM-UNIQUE-KEY-001'
        );
        $firstId = $res['journal_id'];

        // Replay same key
        $replay = $this->posting->post(
            ['date' => '2026-10-27', 'memo' => 'Replay attempt', 'source_type' => 'sale', 'source_id' => 102],
            [
                ['account_code' => '1010', 'debit' => 10000.00, 'credit' => 0.0],
                ['account_code' => '4010', 'debit' => 0.0, 'credit' => 10000.00]
            ],
            'IDEM-UNIQUE-KEY-001'
        );

        if ($replay['status'] !== 'duplicate' || (int)$replay['journal_id'] !== $firstId) {
            throw new Exception("Idempotency replay failed to detect duplicate: " . json_encode($replay));
        }

        $cntStmt = $this->pdo->query("SELECT COUNT(*) FROM journal_idempotency WHERE idempotency_key = 'IDEM-UNIQUE-KEY-001'");
        if ((int)$cntStmt->fetchColumn() !== 1) {
            throw new Exception("Duplicate journal_idempotency row created");
        }
    }

    public function test4_UnbalancedJournalRollback(): void
    {
        $caught = false;
        $countBefore = (int)$this->pdo->query("SELECT COUNT(*) FROM journal_entries")->fetchColumn();

        try {
            $this->posting->post(
                ['memo' => 'Unbalanced test', 'source_type' => 'test', 'source_id' => 1],
                [
                    ['account_code' => '1010', 'debit' => 50000.00, 'credit' => 0.0],
                    ['account_code' => '4010', 'debit' => 0.0, 'credit' => 45000.00] // 5,000 difference
                ]
            );
        } catch (PostingException $e) {
            $caught = true;
        }

        if (!$caught) {
            throw new Exception("Failed to throw PostingException on unbalanced journal");
        }

        $countAfter = (int)$this->pdo->query("SELECT COUNT(*) FROM journal_entries")->fetchColumn();
        if ($countBefore !== $countAfter) {
            throw new Exception("Journal entry persisted despite unbalanced exception (rollback failed)");
        }
    }

    public function test5_InvalidLineBothDebitCredit(): void
    {
        $caught = false;
        try {
            $this->posting->post(
                ['memo' => 'Invalid line test', 'source_type' => 'test', 'source_id' => 2],
                [
                    ['account_code' => '1010', 'debit' => 1000.00, 'credit' => 500.00], // Invalid
                    ['account_code' => '4010', 'debit' => 0.0, 'credit' => 500.00]
                ]
            );
        } catch (PostingException $e) {
            $caught = true;
        }

        if (!$caught) {
            throw new Exception("Failed to throw PostingException for line with both debit and credit");
        }
    }

    public function test6_ParentAccountRejection(): void
    {
        $caught = false;
        try {
            $this->posting->post(
                ['memo' => 'Parent account test', 'source_type' => 'test', 'source_id' => 3],
                [
                    ['account_code' => '1000', 'debit' => 5000.00, 'credit' => 0.0], // is_leaf = 0
                    ['account_code' => '4010', 'debit' => 0.0, 'credit' => 5000.00]
                ]
            );
        } catch (PostingException $e) {
            $caught = true;
        }

        if (!$caught) {
            throw new Exception("Failed to throw PostingException when posting to parent account (1000)");
        }
    }

    public function test7_PostAndReverse(): void
    {
        $orig = $this->posting->post(
            ['date' => '2026-10-27', 'memo' => 'Mistaken entry to reverse', 'source_type' => 'sale', 'source_id' => 999],
            [
                ['account_code' => '1010', 'debit' => 75000.00, 'credit' => 0.0],
                ['account_code' => '4010', 'debit' => 0.0, 'credit' => 75000.00]
            ]
        );
        $origId = $orig['journal_id'];

        $rev = $this->posting->reverse($origId, 'Incorrect customer billed', 1);

        // Verify original status
        $origStmt = $this->pdo->prepare("SELECT status FROM journal_entries WHERE id = :id");
        $origStmt->execute([':id' => $origId]);
        if ($origStmt->fetchColumn() !== 'reversed') {
            throw new Exception("Original journal status was not updated to 'reversed'");
        }

        // Verify reversal entry
        $revStmt = $this->pdo->prepare("SELECT reverses_journal_id, status FROM journal_entries WHERE id = :id");
        $revStmt->execute([':id' => $rev['reversal_journal_id']]);
        $revRow = $revStmt->fetch();
        if ((int)$revRow['reverses_journal_id'] !== $origId || $revRow['status'] !== 'posted') {
            throw new Exception("Reversal pointer or status incorrect");
        }

        // Verify net balance on 1010 is zero from this transaction
        $balance = $this->posting->getAccountBalance('1010');
        // Balances from test 1 (50,000) + test 3 (10,000) = 60,000, 75000 reversed gives +0 net
        if ($balance !== 60000.00) {
            throw new Exception("Account 1010 balance expected 60000.00 after reversal, got {$balance}");
        }
    }

    public function test8_NightlyIntegrityCheck(): void
    {
        $report = $this->cron->run();
        if ($report['status'] !== 'OK') {
            throw new Exception("Integrity check failed: " . json_encode($report['errors']));
        }
        if (!$report['trial_balance']['in_balance']) {
            throw new Exception("Trial balance out of balance: " . $report['trial_balance']['variance']);
        }
    }

    public function test9_FullDaySimulationTieOut(): void
    {
        // Simulate:
        // 1. Moniepoint POS sale: D 1050 / C 4010 150,000
        $this->posting->post(
            ['memo' => 'Moniepoint POS batch sales', 'source_type' => 'sale', 'source_id' => 201],
            [['account_code' => '1050', 'debit' => 150000.0, 'credit' => 0.0], ['account_code' => '4010', 'debit' => 0.0, 'credit' => 150000.0]]
        );

        // 2. Intra-day Safe drop: D 1020 Cash in Safe / C 1010 Cash on Hand 40,000
        $this->posting->post(
            ['memo' => 'Vault Drop from Drawer Till #1', 'source_type' => 'cash_drop', 'source_id' => 1],
            [['account_code' => '1020', 'debit' => 40000.0, 'credit' => 0.0], ['account_code' => '1010', 'debit' => 0.0, 'credit' => 40000.0]]
        );

        // 3. Diesel generator fuel purchase: D 5200 Energy Diesel / C 1010 Cash on Hand 25,000
        $this->posting->post(
            ['memo' => 'Generator diesel top-up (20L)', 'source_type' => 'expense', 'source_id' => 1],
            [['account_code' => '5200', 'debit' => 25000.0, 'credit' => 0.0], ['account_code' => '1010', 'debit' => 0.0, 'credit' => 25000.0]]
        );

        // Run integrity report
        $report = $this->cron->run();
        if ($report['status'] !== 'OK') {
            throw new Exception("Simulation integrity check failed: " . json_encode($report['errors']));
        }

        // Verify trial balance exact zero discrepancy
        $tb = $report['trial_balance'];
        if ($tb['variance'] > 0.005) {
            throw new Exception("Simulation trial balance has variance: {$tb['variance']}");
        }
    }
}

// CLI runner if executed directly
if (php_sapi_name() === 'cli' && basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'] ?? '')) {
    $pdo = ExitHarnessTest::createTestDb();
    $harness = new ExitHarnessTest($pdo);
    $results = $harness->runAll();

    echo "RUSBI BAKERY OS - SPRINT 0 EXIT TEST HARNESS RESULTS\n";
    echo "====================================================\n";
    $allPassed = true;
    foreach ($results as $r) {
        if ($r['passed']) {
            echo " [PASS] " . $r['test'] . "\n";
        } else {
            echo " [FAIL] " . $r['test'] . " -> " . $r['error'] . "\n";
            $allPassed = false;
        }
    }
    echo "====================================================\n";
    exit($allPassed ? 0 : 1);
}
