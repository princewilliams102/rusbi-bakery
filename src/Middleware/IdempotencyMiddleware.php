<?php
declare(strict_types=1);

namespace Rusbi\Middleware;

use PDO;

/**
 * Idempotency Middleware for Offline PWA Sync & API Mutations
 * Protects sub-ledgers and GL from duplicate POST submissions during network retries.
 */
class IdempotencyMiddleware
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Inspect incoming request for idempotency key.
     * Returns cached response array if duplicate, or null if request is fresh.
     */
    public function check(array $serverHeaders, ?string $rawBody = null): ?array
    {
        $key = $this->extractKey($serverHeaders, $rawBody);
        if ($key === null) {
            return null;
        }

        $bodyHash = hash('sha256', $rawBody ?? '');

        // 1. Check in rb_sync_ledger
        $stmt = $this->pdo->prepare("
            SELECT * FROM rb_sync_ledger WHERE idempotency_key = :k
        ");
        $stmt->execute([':k' => $key]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            if ($existing['payload_hash'] !== $bodyHash) {
                return [
                    'http_code' => 409,
                    'response' => [
                        'status' => 'conflict',
                        'error' => 'Idempotency conflict: key was previously used with a different request payload.',
                        'idempotency_key' => $key
                    ]
                ];
            }

            return [
                'http_code' => 200,
                'response' => [
                    'status' => 'duplicate',
                    'replayed' => true,
                    'sync_id' => (int)$existing['id'],
                    'entity_type' => $existing['entity_type'],
                    'entity_id' => $existing['entity_id'] ? (int)$existing['entity_id'] : null,
                    'idempotency_key' => $key,
                    'message' => 'Transaction was already processed successfully.'
                ]
            ];
        }

        // 2. Check in journal_idempotency
        $jStmt = $this->pdo->prepare("
            SELECT journal_id FROM journal_idempotency WHERE idempotency_key = :k
        ");
        $jStmt->execute([':k' => $key]);
        $jid = $jStmt->fetchColumn();

        if ($jid !== false) {
            return [
                'http_code' => 200,
                'response' => [
                    'status' => 'duplicate',
                    'replayed' => true,
                    'journal_id' => (int)$jid,
                    'idempotency_key' => $key,
                    'message' => 'General Ledger posting already completed.'
                ]
            ];
        }

        return null;
    }

    /**
     * Record a newly processed sync action into rb_sync_ledger.
     */
    public function record(
        string $key,
        int $deviceId,
        int $userId,
        string $entityType,
        ?int $entityId,
        string $rawBody,
        string $status = 'accepted',
        ?string $rejectionReason = null
    ): int {
        $bodyHash = hash('sha256', $rawBody);
        $clientTimestamp = date('Y-m-d H:i:s');

        $stmt = $this->pdo->prepare("
            INSERT INTO rb_sync_ledger (
                idempotency_key, device_id, user_id, entity_type, entity_id,
                payload_hash, client_timestamp, status, rejection_reason
            ) VALUES (
                :k, :device_id, :user_id, :entity_type, :entity_id,
                :hash, :client_ts, :status, :reason
            )
        ");
        $stmt->execute([
            ':k'           => $key,
            ':device_id'   => $deviceId,
            ':user_id'     => $userId,
            ':entity_type' => $entityType,
            ':entity_id'   => $entityId,
            ':hash'        => $bodyHash,
            ':client_ts'   => $clientTimestamp,
            ':status'      => $status,
            ':reason'      => $rejectionReason
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    /**
     * Extract idempotency key from HTTP headers or payload.
     */
    public function extractKey(array $serverHeaders, ?string $rawBody = null): ?string
    {
        if (!empty($serverHeaders['HTTP_IDEMPOTENCY_KEY'])) {
            return trim($serverHeaders['HTTP_IDEMPOTENCY_KEY']);
        }
        if (!empty($serverHeaders['HTTP_X_IDEMPOTENCY_KEY'])) {
            return trim($serverHeaders['HTTP_X_IDEMPOTENCY_KEY']);
        }
        if (!empty($serverHeaders['Idempotency-Key'])) {
            return trim($serverHeaders['Idempotency-Key']);
        }

        if ($rawBody !== null) {
            $data = json_decode($rawBody, true);
            if (is_array($data) && !empty($data['idempotency_key'])) {
                return trim((string)$data['idempotency_key']);
            }
        }

        return null;
    }
}
