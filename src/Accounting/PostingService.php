<?php
declare(strict_types=1);

namespace Rusbi\Accounting;

use PDO;
use Exception;

/**
 * General Ledger Posting Engine & Invariant Guard
 * Atomic bridge ensuring operational events write immutably to the GL.
 */
class PostingService
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Atomically post a balanced journal entry with lines and idempotency guarantee.
     *
     * @param array $header [date, memo, source_type, source_id, created_by, ?ref, ?period, ?status]
     * @param array $lines Array of [account_id|account_code, debit, credit, ?memo]
     * @param string|null $idempotencyKey Optional unique key to prevent duplicate posting
     * @param array|null $eventLog Optional operational event to record in rb_event_log
     * @return array Posting summary result
     */
    public function post(
        array $header,
        array $lines,
        ?string $idempotencyKey = null,
        ?array $eventLog = null
    ): array {
        if ($idempotencyKey !== null) {
            $existingId = $this->checkIdempotency($idempotencyKey);
            if ($existingId !== null) {
                return [
                    'status' => 'duplicate',
                    'journal_id' => $existingId,
                    'already_posted' => true,
                    'message' => "Posting skipped: idempotency key already processed in journal #{$existingId}"
                ];
            }
        }

        if (count($lines) < 2) {
            throw PostingException::missingLines(count($lines));
        }

        $normalizedLines = $this->validateAndNormalizeLines($lines);

        $date = $header['date'] ?? date('Y-m-d');
        $period = $header['period'] ?? substr($date, 0, 7);
        $memo = (string)($header['memo'] ?? 'Journal Entry');
        $ref = $header['ref'] ?? null;
        $sourceType = (string)($header['source_type'] ?? 'manual');
        $sourceId = (int)($header['source_id'] ?? 0);
        $status = $header['status'] ?? 'posted';
        $createdBy = (int)($header['created_by'] ?? 1);

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO journal_entries (
                    date, period, memo, ref, source_type, source_id, status, created_by
                ) VALUES (
                    :date, :period, :memo, :ref, :source_type, :source_id, :status, :created_by
                )
            ");
            $stmt->execute([
                ':date' => $date,
                ':period' => $period,
                ':memo' => $memo,
                ':ref' => $ref,
                ':source_type' => $sourceType,
                ':source_id' => $sourceId,
                ':status' => $status,
                ':created_by' => $createdBy,
            ]);
            $journalId = (int)$this->pdo->lastInsertId();

            $lineStmt = $this->pdo->prepare("
                INSERT INTO journal_lines (
                    journal_id, account_id, account_code_snapshot, debit, credit, memo
                ) VALUES (
                    :journal_id, :account_id, :code_snap, :debit, :credit, :memo
                )
            ");

            foreach ($normalizedLines as $line) {
                $lineStmt->execute([
                    ':journal_id' => $journalId,
                    ':account_id' => $line['account_id'],
                    ':code_snap'  => $line['account_code'],
                    ':debit'      => $line['debit'],
                    ':credit'     => $line['credit'],
                    ':memo'       => $line['memo'] ?? $memo,
                ]);
            }

            if ($idempotencyKey !== null) {
                $idemStmt = $this->pdo->prepare("
                    INSERT INTO journal_idempotency (idempotency_key, journal_id)
                    VALUES (:key, :jid)
                ");
                $idemStmt->execute([':key' => $idempotencyKey, ':jid' => $journalId]);
            }

            if ($eventLog !== null) {
                $evtStmt = $this->pdo->prepare("
                    INSERT INTO rb_event_log (
                        event_type, entity_type, entity_id, actor_user_id, device_id, payload_json, gl_journal_id
                    ) VALUES (
                        :event_type, :entity_type, :entity_id, :actor_user_id, :device_id, :payload_json, :jid
                    )
                ");
                $evtStmt->execute([
                    ':event_type'    => $eventLog['event_type'] ?? 'gl_posting',
                    ':entity_type'   => $eventLog['entity_type'] ?? $sourceType,
                    ':entity_id'     => $eventLog['entity_id'] ?? $sourceId,
                    ':actor_user_id' => $eventLog['actor_user_id'] ?? $createdBy,
                    ':device_id'     => $eventLog['device_id'] ?? null,
                    ':payload_json'  => json_encode($eventLog['payload'] ?? ['source' => $sourceType]),
                    ':jid'           => $journalId,
                ]);
            }

            $this->pdo->commit();

            return [
                'status' => 'posted',
                'journal_id' => $journalId,
                'period' => $period,
                'lines_count' => count($normalizedLines)
            ];
        } catch (Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $e;
        }
    }

    /**
     * Reverse a posted journal entry immutably.
     */
    public function reverse(int $journalId, string $reason, int $actorUserId = 1): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM journal_entries WHERE id = :id");
        $stmt->execute([':id' => $journalId]);
        $orig = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$orig) {
            throw PostingException::cannotReverse("Journal #{$journalId} not found.");
        }
        if ($orig['status'] !== 'posted') {
            throw PostingException::cannotReverse(
                "Only posted journals can be reversed. Journal #{$journalId} is '{$orig['status']}'."
            );
        }

        $lineStmt = $this->pdo->prepare("SELECT * FROM journal_lines WHERE journal_id = :jid");
        $lineStmt->execute([':jid' => $journalId]);
        $lines = $lineStmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($lines)) {
            throw PostingException::cannotReverse("Journal #{$journalId} has no lines to reverse.");
        }

        $this->pdo->beginTransaction();
        try {
            $revDate = date('Y-m-d');
            $revPeriod = substr($revDate, 0, 7);

            $insStmt = $this->pdo->prepare("
                INSERT INTO journal_entries (
                    date, period, memo, ref, source_type, source_id, status, reverses_journal_id, created_by
                ) VALUES (
                    :date, :period, :memo, :ref, 'reversal', :source_id, 'posted', :reverses_id, :created_by
                )
            ");
            $insStmt->execute([
                ':date'         => $revDate,
                ':period'       => $revPeriod,
                ':memo'         => "Correction Reversal of #{$journalId}: {$reason}",
                ':ref'          => "REV-{$journalId}",
                ':source_id'    => $journalId,
                ':reverses_id'  => $journalId,
                ':created_by'   => $actorUserId,
            ]);
            $reversalId = (int)$this->pdo->lastInsertId();

            $insLineStmt = $this->pdo->prepare("
                INSERT INTO journal_lines (
                    journal_id, account_id, account_code_snapshot, debit, credit, memo
                ) VALUES (
                    :journal_id, :account_id, :code_snap, :debit, :credit, :memo
                )
            ");

            foreach ($lines as $line) {
                $insLineStmt->execute([
                    ':journal_id' => $reversalId,
                    ':account_id' => $line['account_id'],
                    ':code_snap'  => $line['account_code_snapshot'],
                    ':debit'      => $line['credit'],
                    ':credit'     => $line['debit'],
                    ':memo'       => "Reversal of line #{$line['id']}",
                ]);
            }

            $updateOrigStmt = $this->pdo->prepare("
                UPDATE journal_entries SET status = 'reversed' WHERE id = :id
            ");
            $updateOrigStmt->execute([':id' => $journalId]);

            $this->pdo->commit();

            return [
                'status' => 'reversed',
                'original_journal_id' => $journalId,
                'reversal_journal_id' => $reversalId,
                'period' => $revPeriod
            ];
        } catch (Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $e;
        }
    }

    /**
     * Compute authoritative account balance directly from SUM(debit) - SUM(credit).
     */
    public function getAccountBalance($accountIdentifier, ?string $period = null): float
    {
        $acc = $this->resolveAccount($accountIdentifier);
        $accId = (int)$acc['id'];
        $normalBalance = $acc['normal_balance'];

        $sql = "
            SELECT 
                COALESCE(SUM(jl.debit), 0.0) AS total_debit,
                COALESCE(SUM(jl.credit), 0.0) AS total_credit
            FROM journal_lines jl
            JOIN journal_entries je ON jl.journal_id = je.id
            WHERE jl.account_id = :acc_id
              AND je.status IN ('posted', 'reversed')
        ";
        $params = [':acc_id' => $accId];

        if ($period !== null) {
            $sql .= " AND je.period <= :period";
            $params[':period'] = $period;
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $totDebit = (float)($row['total_debit'] ?? 0.0);
        $totCredit = (float)($row['total_credit'] ?? 0.0);

        if ($normalBalance === 'credit') {
            return round($totCredit - $totDebit, 2);
        }
        return round($totDebit - $totCredit, 2);
    }

    /**
     * Materialize balances into account_balances_cache.
     */
    public function refreshBalanceCache(?string $period = null): int
    {
        $currentPeriod = $period ?? date('Y-m');

        $sql = "
            SELECT 
                jl.account_id,
                a.normal_balance,
                COALESCE(SUM(jl.debit), 0.0) AS sum_debit,
                COALESCE(SUM(jl.credit), 0.0) AS sum_credit
            FROM journal_lines jl
            JOIN journal_entries je ON jl.journal_id = je.id
            JOIN accounts a ON jl.account_id = a.id
            WHERE je.period = :period AND je.status IN ('posted', 'reversed')
            GROUP BY jl.account_id, a.normal_balance
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':period' => $currentPeriod]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $upsertStmt = $this->pdo->prepare("
            INSERT INTO account_balances_cache (account_id, period, debit_total, credit_total, balance, refreshed_at)
            VALUES (:account_id, :period, :debit, :credit, :balance, CURRENT_TIMESTAMP)
            ON CONFLICT(account_id, period) DO UPDATE SET
                debit_total = :debit,
                credit_total = :credit,
                balance = :balance,
                refreshed_at = CURRENT_TIMESTAMP
        ");

        $count = 0;
        foreach ($rows as $r) {
            $deb = round((float)$r['sum_debit'], 2);
            $cred = round((float)$r['sum_credit'], 2);
            $bal = ($r['normal_balance'] === 'credit') ? round($cred - $deb, 2) : round($deb - $cred, 2);

            $upsertStmt->execute([
                ':account_id' => (int)$r['account_id'],
                ':period'     => $currentPeriod,
                ':debit'      => $deb,
                ':credit'     => $cred,
                ':balance'    => $bal
            ]);
            $count++;
        }

        return $count;
    }

    private function checkIdempotency(string $key): ?int
    {
        $stmt = $this->pdo->prepare("SELECT journal_id FROM journal_idempotency WHERE idempotency_key = :k");
        $stmt->execute([':k' => $key]);
        $val = $stmt->fetchColumn();
        return $val !== false ? (int)$val : null;
    }

    private function validateAndNormalizeLines(array $lines): array
    {
        $totalDebit = 0.0;
        $totalCredit = 0.0;
        $normalized = [];

        foreach ($lines as $idx => $line) {
            $debit = round((float)($line['debit'] ?? 0.0), 2);
            $credit = round((float)($line['credit'] ?? 0.0), 2);

            if ($debit < 0.0 || $credit < 0.0) {
                throw PostingException::invalidLine("Line #{$idx} cannot have negative amounts.");
            }
            if ($debit > 0.0 && $credit > 0.0) {
                throw PostingException::invalidLine("Line #{$idx} cannot have both debit and credit greater than zero.");
            }
            if ($debit == 0.0 && $credit == 0.0) {
                throw PostingException::invalidLine("Line #{$idx} must have either debit or credit greater than zero.");
            }

            $accIdent = $line['account_id'] ?? $line['account_code'] ?? null;
            if (!$accIdent) {
                throw PostingException::invalidLine("Line #{$idx} missing account_id or account_code.");
            }

            $acc = $this->resolveAccount($accIdent);
            if ((int)$acc['is_leaf'] !== 1) {
                throw PostingException::parentAccount($acc['code']);
            }

            $totalDebit += $debit;
            $totalCredit += $credit;

            $normalized[] = [
                'account_id'   => (int)$acc['id'],
                'account_code' => $acc['code'],
                'debit'        => $debit,
                'credit'       => $credit,
                'memo'         => $line['memo'] ?? null
            ];
        }

        if (abs($totalDebit - $totalCredit) > 0.005) {
            throw PostingException::unbalanced($totalDebit, $totalCredit);
        }

        return $normalized;
    }

    private function resolveAccount($identifier): array
    {
        if (is_numeric($identifier)) {
            $stmt = $this->pdo->prepare("SELECT * FROM accounts WHERE id = :id AND is_active = 1");
            $stmt->execute([':id' => (int)$identifier]);
        } else {
            $stmt = $this->pdo->prepare("SELECT * FROM accounts WHERE code = :code AND is_active = 1");
            $stmt->execute([':code' => (string)$identifier]);
        }
        $acc = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$acc) {
            throw PostingException::accountNotFound((string)$identifier);
        }
        return $acc;
    }
}
