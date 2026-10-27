<?php
declare(strict_types=1);

namespace Rusbi\Cron;

use PDO;
use Rusbi\Accounting\PostingService;

/**
 * Nightly General Ledger Integrity & Audit Verification
 * Runs via cPanel cron or CLI to detect discrepancies, verify trial balance, and refresh caches.
 */
class NightlyIntegrityCheck
{
    private PDO $pdo;
    private PostingService $postingService;

    public function __construct(PDO $pdo, ?PostingService $postingService = null)
    {
        $this->pdo = $pdo;
        $this->postingService = $postingService ?? new PostingService($pdo);
    }

    /**
     * Run all audit checks and return an integrity assessment report.
     */
    public function run(?string $targetPeriod = null): array
    {
        $report = [
            'status' => 'OK',
            'timestamp' => date('Y-m-d H:i:s'),
            'target_period' => $targetPeriod ?? date('Y-m'),
            'unbalanced_journals' => $this->checkJournalBalance(),
            'orphaned_lines' => $this->checkOrphanedLines(),
            'reversal_mismatches' => $this->checkReversals(),
            'trial_balance' => $this->checkTrialBalance(),
            'cache_refreshed_count' => 0,
            'errors' => []
        ];

        if (!empty($report['unbalanced_journals'])) {
            $report['status'] = 'ERROR';
            $report['errors'][] = count($report['unbalanced_journals']) . ' unbalanced journals detected.';
        }

        if (!empty($report['orphaned_lines'])) {
            $report['status'] = 'ERROR';
            $report['errors'][] = count($report['orphaned_lines']) . ' orphaned or non-leaf lines detected.';
        }

        if (!empty($report['reversal_mismatches'])) {
            $report['status'] = 'ERROR';
            $report['errors'][] = count($report['reversal_mismatches']) . ' reversal reference discrepancies detected.';
        }

        if (!$report['trial_balance']['in_balance']) {
            $report['status'] = 'ERROR';
            $report['errors'][] = 'General Ledger out of balance: ' . $report['trial_balance']['variance'];
        }

        // Refresh balance cache
        $report['cache_refreshed_count'] = $this->postingService->refreshBalanceCache($report['target_period']);

        return $report;
    }

    private function checkJournalBalance(): array
    {
        $sql = "
            SELECT 
                je.id,
                je.memo,
                je.date,
                ROUND(SUM(jl.debit), 2) AS sum_debit,
                ROUND(SUM(jl.credit), 2) AS sum_credit,
                ROUND(ABS(SUM(jl.debit) - SUM(jl.credit)), 2) AS diff
            FROM journal_entries je
            JOIN journal_lines jl ON je.id = jl.journal_id
            WHERE je.status IN ('posted', 'reversed')
            GROUP BY je.id, je.memo, je.date
            HAVING diff > 0.005
        ";
        $stmt = $this->pdo->query($sql);
        return $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
    }

    private function checkOrphanedLines(): array
    {
        $sql = "
            SELECT 
                jl.id AS line_id,
                jl.journal_id,
                jl.account_id,
                jl.account_code_snapshot,
                a.id AS found_account_id,
                a.is_leaf
            FROM journal_lines jl
            LEFT JOIN accounts a ON jl.account_id = a.id
            WHERE a.id IS NULL OR a.is_leaf = 0
        ";
        $stmt = $this->pdo->query($sql);
        return $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
    }

    private function checkReversals(): array
    {
        $sql = "
            SELECT 
                je.id AS reversal_id,
                je.reverses_journal_id,
                orig.id AS original_id,
                orig.status AS original_status
            FROM journal_entries je
            LEFT JOIN journal_entries orig ON je.reverses_journal_id = orig.id
            WHERE je.reverses_journal_id IS NOT NULL 
              AND (orig.id IS NULL OR orig.status != 'reversed')
        ";
        $stmt = $this->pdo->query($sql);
        return $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
    }

    private function checkTrialBalance(): array
    {
        $sql = "
            SELECT 
                ROUND(COALESCE(SUM(jl.debit), 0.0), 2) AS total_debit,
                ROUND(COALESCE(SUM(jl.credit), 0.0), 2) AS total_credit
            FROM journal_lines jl
            JOIN journal_entries je ON jl.journal_id = je.id
            WHERE je.status IN ('posted', 'reversed')
        ";
        $stmt = $this->pdo->query($sql);
        $row = $stmt ? $stmt->fetch(PDO::FETCH_ASSOC) : null;

        $totDebit = (float)($row['total_debit'] ?? 0.0);
        $totCredit = (float)($row['total_credit'] ?? 0.0);
        $variance = round(abs($totDebit - $totCredit), 2);

        return [
            'total_debits' => $totDebit,
            'total_credits' => $totCredit,
            'variance' => $variance,
            'in_balance' => ($variance < 0.005)
        ];
    }
}
