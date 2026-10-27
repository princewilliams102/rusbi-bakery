<?php
declare(strict_types=1);

namespace Rusbi\Commands;

use PDO;
use Exception;
use Rusbi\Accounting\PostingService;

/**
 * Opening Balance Migration CLI & Service
 * Imports opening debtor balances, inventory, and asset floats against 3900 Opening Balance Equity.
 */
class ImportOpeningBalances
{
    private PDO $pdo;
    private PostingService $postingService;

    public function __construct(PDO $pdo, ?PostingService $postingService = null)
    {
        $this->pdo = $pdo;
        $this->postingService = $postingService ?? new PostingService($pdo);
    }

    /**
     * Import debtor balances array.
     * Each entry: [
     *   'party_name' => 'Alhaji Ishaq',
     *   'party_phone' => '+234 803 555 8899',
     *   'kind' => 'customer',
     *   'tier' => 'distributor',
     *   'credit_limit' => 2000000.00,
     *   'opening_balance' => 450000.00,
     *   'account_code' => '1200'
     * ]
     */
    public function importDebtors(array $debtors, int $actorUserId = 1): array
    {
        $results = [
            'success_count' => 0,
            'skipped_count' => 0,
            'total_amount'  => 0.0,
            'journals'      => [],
            'errors'        => []
        ];

        foreach ($debtors as $idx => $d) {
            $name = trim($d['party_name'] ?? '');
            $balance = round((float)($d['opening_balance'] ?? 0.0), 2);
            $accountCode = $d['account_code'] ?? '1200';

            if ($balance <= 0.0) {
                $results['skipped_count']++;
                continue;
            }

            try {
                // Find or insert party in rb_parties
                $partyId = $this->resolveParty($name, $d['party_phone'] ?? null, $d['kind'] ?? 'customer');

                // Update rb_parties_credit
                $limit = round((float)($d['credit_limit'] ?? 0.0), 2);
                $tier = $d['tier'] ?? 'distributor';
                $this->upsertCreditProfile($partyId, $limit, $balance, $tier);

                // Post atomic GL Journal: Debit AR (1200/1210) / Credit Opening Balance Equity (3900)
                $idemKey = "OPENING-BAL-DEBTOR-{$partyId}";
                $lines = [
                    ['account_code' => $accountCode, 'debit' => $balance, 'credit' => 0.0, 'memo' => "Opening AR: {$name}"],
                    ['account_code' => '3900',        'debit' => 0.0, 'credit' => $balance, 'memo' => "Opening Equity: {$name}"]
                ];

                $header = [
                    'date'        => date('Y-m-d'),
                    'memo'        => "Opening Balance Migration: {$name}",
                    'ref'         => "OPENING-{$partyId}",
                    'source_type' => 'opening_balance',
                    'source_id'   => $partyId,
                    'created_by'  => $actorUserId,
                    'status'      => 'posted'
                ];

                $eventLog = [
                    'event_type'    => 'opening_balance',
                    'entity_type'   => 'party',
                    'entity_id'     => $partyId,
                    'actor_user_id' => $actorUserId,
                    'payload'       => ['amount' => $balance, 'account' => $accountCode, 'tier' => $tier]
                ];

                $postResult = $this->postingService->post($header, $lines, $idemKey, $eventLog);

                if ($postResult['status'] === 'duplicate') {
                    $results['skipped_count']++;
                    continue;
                }

                $journalId = $postResult['journal_id'];

                // Insert into rb_bashi_ledger
                $bashiStmt = $this->pdo->prepare("
                    INSERT INTO rb_bashi_ledger (
                        party_id, entry_date, event_type, amount, direction,
                        running_balance, ref, gl_journal_id, actor_user_id, notes
                    ) VALUES (
                        :party_id, :entry_date, 'opening_balance', :amount, 'debit',
                        :balance, :ref, :jid, :actor, :notes
                    )
                ");
                $bashiStmt->execute([
                    ':party_id'    => $partyId,
                    ':entry_date'  => date('Y-m-d'),
                    ':amount'      => $balance,
                    ':balance'     => $balance,
                    ':ref'         => "OPENING-{$partyId}",
                    ':jid'         => $journalId,
                    ':actor'       => $actorUserId,
                    ':notes'       => "Opening balance imported from legacy records"
                ]);

                $results['success_count']++;
                $results['total_amount'] += $balance;
                $results['journals'][] = [
                    'party_id' => $partyId,
                    'party_name' => $name,
                    'journal_id' => $journalId,
                    'amount' => $balance
                ];
            } catch (Exception $e) {
                $results['errors'][] = "Error on debtor #{$idx} ({$name}): " . $e->getMessage();
            }
        }

        return $results;
    }

    private function resolveParty(string $name, ?string $phone, string $kind): int
    {
        $stmt = $this->pdo->prepare("SELECT id FROM rb_parties WHERE display_name = :name AND kind = :kind");
        $stmt->execute([':name' => $name, ':kind' => $kind]);
        $id = $stmt->fetchColumn();

        if ($id !== false) {
            return (int)$id;
        }

        $ins = $this->pdo->prepare("
            INSERT INTO rb_parties (kind, ref_table, ref_id, display_name, phone, is_active)
            VALUES (:kind, 'custom', 0, :name, :phone, 1)
        ");
        $ins->execute([
            ':kind' => $kind,
            ':name' => $name,
            ':phone' => $phone
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    private function upsertCreditProfile(int $partyId, float $limit, float $balance, string $tier): void
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO rb_parties_credit (party_id, credit_limit, current_balance, tier, default_due_days, hard_stop)
            VALUES (:pid, :lim, :bal, :tier, 7, 1)
            ON CONFLICT(party_id) DO UPDATE SET
                credit_limit = :lim,
                current_balance = :bal,
                tier = :tier
        ");
        $stmt->execute([
            ':pid'  => $partyId,
            ':lim'  => $limit,
            ':bal'  => $balance,
            ':tier' => $tier
        ]);
    }
}
