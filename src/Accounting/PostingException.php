<?php
declare(strict_types=1);

namespace Rusbi\Accounting;

use RuntimeException;

/**
 * Exception thrown when a General Ledger posting fails invariant validation.
 */
class PostingException extends RuntimeException
{
    public static function unbalanced(float $totalDebit, float $totalCredit): self
    {
        return new self(sprintf(
            'Unbalanced journal entry: Debits (%.2f) must equal Credits (%.2f). Discrepancy: %.2f',
            $totalDebit,
            $totalCredit,
            abs($totalDebit - $totalCredit)
        ));
    }

    public static function invalidLine(string $reason): self
    {
        return new self(sprintf('Invalid journal line: %s', $reason));
    }

    public static function parentAccount(string $accountCode): self
    {
        return new self(sprintf(
            'Cannot post to parent account code "%s". Only leaf accounts (is_leaf = 1) accept journal lines.',
            $accountCode
        ));
    }

    public static function accountNotFound(string $identifier): self
    {
        return new self(sprintf('Account not found or inactive: "%s"', $identifier));
    }

    public static function duplicateIdempotencyKey(string $key, int $existingJournalId): self
    {
        return new self(sprintf(
            'Duplicate posting detected with idempotency key "%s" (already posted to journal #%d).',
            $key,
            $existingJournalId
        ));
    }

    public static function cannotReverse(string $reason): self
    {
        return new self(sprintf('Cannot reverse journal: %s', $reason));
    }

    public static function missingLines(int $count): self
    {
        return new self(sprintf('A valid double-entry journal requires at least 2 lines; got %d.', $count));
    }
}
