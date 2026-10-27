<?php
/**
 * Rusbi Bakery OS - Self-Hosted Double-Entry Accounting API for cPanel
 * Pure PHP (7.4 - 8.3+) with SQLite & MySQL Support
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Idempotency-Key, X-Idempotency-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/src/Accounting/PostingException.php';
require_once __DIR__ . '/src/Accounting/PostingService.php';
require_once __DIR__ . '/src/Middleware/IdempotencyMiddleware.php';
require_once __DIR__ . '/src/Cron/NightlyIntegrityCheck.php';
require_once __DIR__ . '/src/Commands/ImportOpeningBalances.php';

use Rusbi\Accounting\PostingService;
use Rusbi\Accounting\PostingException;
use Rusbi\Middleware\IdempotencyMiddleware;
use Rusbi\Cron\NightlyIntegrityCheck;
use Rusbi\Commands\ImportOpeningBalances;

// Safe Database Connection
function getDb(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    try {
        if (DB_DRIVER === 'mysql') {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } else {
            $dir = dirname(SQLITE_FILE);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            $dsn = "sqlite:" . SQLITE_FILE;
            $pdo = new PDO($dsn, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            $pdo->exec("PRAGMA foreign_keys = ON;");
        }
        initDatabase($pdo);
        return $pdo;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
}

// Initialize tables if first run
function initDatabase(PDO $pdo): void {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS kv_store (
            `key` VARCHAR(64) PRIMARY KEY,
            `value` LONGTEXT NOT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Check if accounts master is initialized
    try {
        $check = $pdo->query("SELECT COUNT(*) FROM accounts");
        if ($check === false || (int)$check->fetchColumn() === 0) {
            $schemaFile = DB_DRIVER === 'mysql' ? __DIR__ . '/database/schema.sql' : __DIR__ . '/database/schema_sqlite.sql';
            if (file_exists($schemaFile)) {
                $pdo->exec(file_get_contents($schemaFile));
            }
            $seedsFile = __DIR__ . '/database/seeds.sql';
            if (file_exists($seedsFile)) {
                $pdo->exec(file_get_contents($seedsFile));
            }
        }
    } catch (Exception $e) {
        // Run schema if tables don't exist yet
        $schemaFile = DB_DRIVER === 'mysql' ? __DIR__ . '/database/schema.sql' : __DIR__ . '/database/schema_sqlite.sql';
        if (file_exists($schemaFile)) {
            $pdo->exec(file_get_contents($schemaFile));
        }
        $seedsFile = __DIR__ . '/database/seeds.sql';
        if (file_exists($seedsFile)) {
            $pdo->exec(file_get_contents($seedsFile));
        }
    }

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS password_resets (
            `email` VARCHAR(128) PRIMARY KEY,
            `otp_hash` VARCHAR(128) NOT NULL,
            `expires_at` INT NOT NULL,
            `attempts` INT DEFAULT 0,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_credentials (
            `user_id` VARCHAR(64) PRIMARY KEY,
            `email` VARCHAR(128) NOT NULL,
            `password` VARCHAR(255) NOT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ");
}

$action = $_GET['action'] ?? 'get_state';
$pdo = getDb();
$posting = new PostingService($pdo);
$middleware = new IdempotencyMiddleware($pdo);
$integrity = new NightlyIntegrityCheck($pdo, $posting);

try {
    // 1. Apex Books KV State Compatibility
    if ($action === 'get_state') {
        $stmt = $pdo->prepare("SELECT `value` FROM kv_store WHERE `key` = 'app_state'");
        $stmt->execute();
        $row = $stmt->fetch();

        if ($row && !empty($row['value'])) {
            echo $row['value'];
        } else {
            echo json_encode(['empty' => true]);
        }
        exit;
    }

    if ($action === 'get_user_credentials') {
        try {
            $credStmt = $pdo->query("SELECT `user_id`, `email`, `password` FROM user_credentials");
            $creds = $credStmt ? $credStmt->fetchAll() : [];
            echo json_encode(['success' => true, 'credentials' => $creds]);
        } catch (Exception $e) {
            echo json_encode(['success' => true, 'credentials' => []]);
        }
        exit;
    }

    if ($action === 'update_user_credentials' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true) ?: [];
        $userId = trim($payload['userId'] ?? '');
        $newPass = trim($payload['password'] ?? '');
        $newEmail = strtolower(trim($payload['email'] ?? ''));

        if (!empty($userId) && !empty($newPass)) {
            try {
                $credSql = (DB_DRIVER === 'mysql')
                    ? "INSERT INTO user_credentials (`user_id`, `email`, `password`, `updated_at`) VALUES (:uid, :email, :pwd, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE `password` = :pwd, `email` = :email, `updated_at` = CURRENT_TIMESTAMP"
                    : "INSERT INTO user_credentials (`user_id`, `email`, `password`, `updated_at`) VALUES (:uid, :email, :pwd, CURRENT_TIMESTAMP) ON CONFLICT(`user_id`) DO UPDATE SET `password` = :pwd, `email` = :email, `updated_at` = CURRENT_TIMESTAMP";
                $credStmt = $pdo->prepare($credSql);
                $credStmt->execute([':uid' => $userId, ':email' => $newEmail, ':pwd' => $newPass]);
            } catch (Exception $e) {}
        }
        echo json_encode(['success' => true, 'updated_user' => $userId]);
        exit;
    }

    if ($action === 'save_state' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON input']);
            exit;
        }

        if (DB_DRIVER === 'mysql') {
            $stmt = $pdo->prepare("
                INSERT INTO kv_store (`key`, `value`) 
                VALUES ('app_state', :val)
                ON DUPLICATE KEY UPDATE `value` = :val
            ");
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO kv_store (`key`, `value`, `updated_at`) 
                VALUES ('app_state', :val, CURRENT_TIMESTAMP)
                ON CONFLICT(`key`) DO UPDATE SET `value` = :val, `updated_at` = CURRENT_TIMESTAMP
            ");
        }

        $stmt->execute([':val' => $raw]);
        echo json_encode(['success' => true, 'saved_at' => date('Y-m-d H:i:s')]);
        exit;
    }

    if ($action === 'reset_demo' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $pdo->exec("DELETE FROM kv_store WHERE `key` = 'app_state'");
        echo json_encode(['success' => true, 'message' => 'State reset to initial defaults']);
        exit;
    }

    // 2. Health & Diagnostic Check
    if ($action === 'status') {
        $accCount = (int)$pdo->query("SELECT COUNT(*) FROM accounts WHERE is_active = 1")->fetchColumn();
        $jeCount = (int)$pdo->query("SELECT COUNT(*) FROM journal_entries")->fetchColumn();
        echo json_encode([
            'status' => 'online',
            'product' => 'Rusbi Bakery OS',
            'driver' => DB_DRIVER,
            'php_version' => PHP_VERSION,
            'active_gl_accounts' => $accCount,
            'journal_entries_count' => $jeCount,
            'server_time' => date('Y-m-d H:i:s')
        ]);
        exit;
    }

    // 3. Post General Ledger Journal Entry
    if ($action === 'post_journal' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents('php://input');
        $idemCheck = $middleware->check($_SERVER, $raw);
        if ($idemCheck !== null) {
            http_response_code($idemCheck['http_code']);
            echo json_encode($idemCheck['response']);
            exit;
        }

        $payload = json_decode($raw, true);
        if (!$payload || empty($payload['lines'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing header or lines in posting payload']);
            exit;
        }

        $idemKey = $middleware->extractKey($_SERVER, $raw);
        $result = $posting->post(
            $payload['header'] ?? [],
            $payload['lines'],
            $idemKey,
            $payload['event_log'] ?? null
        );

        echo json_encode($result);
        exit;
    }

    // 4. Reverse Journal Entry
    if ($action === 'reverse_journal' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $payload = json_decode(file_get_contents('php://input'), true);
        $jid = (int)($payload['journal_id'] ?? 0);
        $reason = (string)($payload['reason'] ?? 'User requested reversal');
        $actor = (int)($payload['actor_user_id'] ?? 1);

        if ($jid <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid journal_id required']);
            exit;
        }

        $res = $posting->reverse($jid, $reason, $actor);
        echo json_encode($res);
        exit;
    }

    // 5. Query Account Balances & Trial Balance
    if ($action === 'get_balances') {
        $period = $_GET['period'] ?? null;
        $stmt = $pdo->query("SELECT id, code, name, type, normal_balance FROM accounts WHERE is_leaf = 1 AND is_active = 1 ORDER BY code ASC");
        $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $results = [];
        $totalDebits = 0.0;
        $totalCredits = 0.0;

        foreach ($accounts as $acc) {
            $bal = $posting->getAccountBalance($acc['id'], $period);
            $results[] = [
                'id' => (int)$acc['id'],
                'code' => $acc['code'],
                'name' => $acc['name'],
                'type' => $acc['type'],
                'normal_balance' => $acc['normal_balance'],
                'balance' => $bal
            ];
            if ($acc['normal_balance'] === 'debit') {
                $totalDebits += max(0, $bal);
            } else {
                $totalCredits += max(0, $bal);
            }
        }

        echo json_encode([
            'period' => $period ?? 'all_time',
            'accounts' => $results,
            'summary' => [
                'total_debits' => round($totalDebits, 2),
                'total_credits' => round($totalCredits, 2),
                'in_balance' => abs(round($totalDebits - $totalCredits, 2)) < 0.005
            ]
        ]);
        exit;
    }

    // 6. Nightly Integrity Audit Cron
    if ($action === 'cron_integrity') {
        $period = $_GET['period'] ?? null;
        $report = $integrity->run($period);
        echo json_encode($report);
        exit;
    }

    // 7. Import Opening Balances
    if ($action === 'import_opening_balances' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $payload = json_decode(file_get_contents('php://input'), true);
        if (!is_array($payload) || empty($payload['debtors'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Expected JSON payload with debtors array']);
            exit;
        }

        $importer = new ImportOpeningBalances($pdo, $posting);
        $res = $importer->importDebtors($payload['debtors'], (int)($payload['actor_user_id'] ?? 1));
        echo json_encode($res);
        exit;
    }

    // 8. Atomic Sales Recording with Split Tenders & Bashi Sub-ledger
    if ($action === 'record_sale' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents('php://input');
        $idemCheck = $middleware->check($_SERVER, $raw);
        if ($idemCheck !== null) {
            http_response_code($idemCheck['http_code']);
            echo json_encode($idemCheck['response']);
            exit;
        }

        $data = json_decode($raw, true);
        $tenders = $data['tenders'] ?? []; // array of {method: 'cash'|'pos'|'transfer'|'bashi', amount: 5000}
        $totalAmount = round((float)($data['total_amount'] ?? 0.0), 2);
        $customerPartyId = (int)($data['party_id'] ?? 0);
        $ref = $data['invoice_ref'] ?? ('INV-' . time());
        $actorId = (int)($data['actor_user_id'] ?? 1);
        $saleId = (int)($data['sale_id'] ?? time());

        // Validate tender total matches totalAmount
        $tenderSum = 0.0;
        foreach ($tenders as $t) {
            $tenderSum += round((float)$t['amount'], 2);
        }
        if (abs($tenderSum - $totalAmount) > 0.005) {
            http_response_code(400);
            echo json_encode(['error' => "Tenders total ({$tenderSum}) does not match sale amount ({$totalAmount})"]);
            exit;
        }

        // Build GL lines
        $glLines = [];
        $hasBashi = false;
        $bashiAmount = 0.0;

        foreach ($tenders as $t) {
            $amt = round((float)$t['amount'], 2);
            $method = strtolower($t['method']);

            switch ($method) {
                case 'cash':
                    $glLines[] = ['account_code' => '1010', 'debit' => $amt, 'credit' => 0.0, 'memo' => "Cash: {$ref}"];
                    break;
                case 'pos':
                    $glLines[] = ['account_code' => '1050', 'debit' => $amt, 'credit' => 0.0, 'memo' => "POS Tender: {$ref}"];
                    break;
                case 'transfer':
                    $isVerified = !empty($t['is_verified']);
                    $accCode = $isVerified ? '1060' : '1090'; // Suspense if unverified
                    $glLines[] = ['account_code' => $accCode, 'debit' => $amt, 'credit' => 0.0, 'memo' => "Transfer Tender: {$ref}"];
                    break;
                case 'bashi':
                    $hasBashi = true;
                    $bashiAmount += $amt;
                    $glLines[] = ['account_code' => '1200', 'debit' => $amt, 'credit' => 0.0, 'memo' => "Bashi Credit: {$ref}"];
                    break;
                default:
                    $glLines[] = ['account_code' => '1010', 'debit' => $amt, 'credit' => 0.0, 'memo' => "Tender: {$ref}"];
                    break;
            }
        }

        // Credit 4010 Bread Sales
        $glLines[] = ['account_code' => '4010', 'debit' => 0.0, 'credit' => $totalAmount, 'memo' => "Bread Sale: {$ref}"];

        $header = [
            'date' => $data['date'] ?? date('Y-m-d'),
            'memo' => "Sale {$ref} (" . count($tenders) . " tenders)",
            'ref' => $ref,
            'source_type' => 'sale',
            'source_id' => $saleId,
            'created_by' => $actorId,
            'status' => 'posted'
        ];

        $idemKey = $middleware->extractKey($_SERVER, $raw);
        $postRes = $posting->post($header, $glLines, $idemKey);
        $journalId = $postRes['journal_id'];

        // Write to subledgers
        foreach ($tenders as $t) {
            $amt = round((float)$t['amount'], 2);
            $sStmt = $pdo->prepare("
                INSERT INTO rb_split_tenders (sale_id, method, amount, pos_terminal_id, bank_ref, is_verified, gl_journal_id)
                VALUES (:sid, :meth, :amt, :pos, :bref, :ver, :jid)
            ");
            $sStmt->execute([
                ':sid'  => $saleId,
                ':meth' => $t['method'],
                ':amt'  => $amt,
                ':pos'  => $t['pos_terminal_id'] ?? null,
                ':bref' => $t['bank_ref'] ?? null,
                ':ver'  => !empty($t['is_verified']) ? 1 : 0,
                ':jid'  => $journalId
            ]);
        }

        if ($hasBashi && $customerPartyId > 0) {
            $bStmt = $pdo->prepare("
                INSERT INTO rb_bashi_ledger (
                    party_id, entry_date, event_type, amount, direction, running_balance, ref, gl_journal_id, actor_user_id
                ) VALUES (
                    :pid, :edate, 'sale', :amt, 'debit', :bal, :ref, :jid, :actor
                )
            ");
            $bStmt->execute([
                ':pid'   => $customerPartyId,
                ':edate' => $data['date'] ?? date('Y-m-d'),
                ':amt'   => $bashiAmount,
                ':bal'   => $bashiAmount,
                ':ref'   => $ref,
                ':jid'   => $journalId,
                ':actor' => $actorId
            ]);
        }

        echo json_encode([
            'status' => 'success',
            'sale_id' => $saleId,
            'invoice_ref' => $ref,
            'journal_id' => $journalId,
            'tenders_count' => count($tenders),
            'total_amount' => $totalAmount
        ]);
        exit;
    }

    // 9. Run Test Harness Endpoint
    if ($action === 'run_tests') {
        require_once __DIR__ . '/tests/ExitHarnessTest.php';
        $testPdo = \Rusbi\Tests\ExitHarnessTest::createTestDb();
        $harness = new \Rusbi\Tests\ExitHarnessTest($testPdo);
        $results = $harness->runAll();

        $passedAll = true;
        foreach ($results as $r) {
            if (!$r['passed']) $passedAll = false;
        }

        echo json_encode([
            'all_passed' => $passedAll,
            'results' => $results,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Unknown action: ' . $action]);

} catch (PostingException $pe) {
    http_response_code(422);
    echo json_encode(['error' => 'General Ledger Invariant Failure: ' . $pe->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
