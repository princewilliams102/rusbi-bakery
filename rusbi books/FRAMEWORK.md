# Enterprise SaaS & Accounting OS Development Framework
**Blueprint for Zero-Dependency, Multi-Tenant, cPanel-Native Enterprise Applications**

---

## 1. Executive Summary & Core Philosophy

This framework defines the architectural, security, communications, and deployment standards used to build **Rusbi Books (Apex Books OS)**. It is designed for rapidly building resilient, high-fidelity business applications that run natively on standard shared hosts, cPanel servers, or VPS instances with **zero external dependencies, zero build-step lock-in, and 100% offline-ready reliability**.

### Core Tenets
1. **Zero-Dependency Runtime:** Pure vanilla ES6+ modules on the frontend and standard PHP (7.4–8.3+) on the backend. No Webpack/Vite build lock-in on production, no Composer vendor directories, no Node.js daemon requirement for baseline execution.
2. **Dual-Tier Storage Architecture:** Automated SQLite storage (`data/books.sqlite`) for zero-configuration instant boots, seamlessly swappable to cPanel MySQL/MariaDB via standard PDO with schema auto-initialization.
3. **KV State Store + Relational Safety Vaults:** The global business state is managed via an atomic Key-Value document (`kv_store`), while critical security-sensitive identities, passwords, and password resets are mirrored into independent relational tables (`user_credentials`, `password_resets`) that survive operational reboots.
4. **Air-Gapped Multi-Tier SMTP Engine:** Outbound emails run through pure PHP socket clients connecting directly to local MTA daemons (`127.0.0.1:25`), completely eliminating DNS resolution timeouts, SSL negotiation mismatches, and external API rate limits.
5. **Strict Role-Based Segregation (The "Type P" Standard):** Mathematical air-gaps between operational staff (bakers, warehouse clerks, field workers) and financial data (bank balances, profit figures, invoice rates).

---

## 2. System Architecture & Directory Hierarchy

```text
product-root/
│
├── api.php                     # Centralized Single-File REST API (Pure PHP PDO)
├── config.php                  # Environment, Database, & SMTP Credentials
├── index.html                  # Single-Page Application (SPA) Shell & Modals
├── manifest.json               # Progressive Web App (PWA) Manifest
├── sw.js                       # Versioned Service Worker (PWA Shell Caching)
├── .htaccess                   # Apache security rules, compression, and MIME types
│
├── assets/                     # High-resolution vector & raster brand assets
│   ├── icon-192.png            # Mobile Home Screen Icon
│   ├── icon-512.png            # High-Res Android/Desktop Icon
│   ├── icon-maskable.png       # Android Adaptive Maskable Icon
│   ├── apple-touch-icon.png    # iOS Safari Touch Icon
│   └── brand-logo.png          # High-density SVG / PNG brand artwork
│
├── data/                       # Writable directory for local persistence (chmod 755)
│   └── books.sqlite            # SQLite Database (Fallback & Zero-Config runtime)
│
├── styles/
│   └── main.css                # Apple HIG Design Tokens, Themes, & Grid Layouts
│
└── scripts/
    ├── app.js                  # Master Application Controller, Routing, UI Events
    ├── accounting.js           # Double-Entry Ledger, Financial Math, & Audit Engine
    └── data.js                 # Initial State Hydration Seed, Entities, & Chart of Accounts
```

---

## 3. Data Architecture: Dual-Storage Engine

### 3.1 Persistence Layer Strategy
The application dynamically selects between SQLite and MySQL based on `config.php`:

```php
// config.php
define('DB_DRIVER', 'mysql'); // 'mysql' for cPanel production, 'sqlite' for zero-config
define('SQLITE_FILE', __DIR__ . '/data/books.sqlite');
define('DB_HOST', 'localhost');
define('DB_NAME', 'prod_dbname');
define('DB_USER', 'prod_dbuser');
define('DB_PASS', 'DB_SecretPassword!');
define('DB_PORT', 3306);
```

### 3.2 Automated Schema & Unicode Normalization
When `api.php` receives its first request, it automatically creates required tables and normalizes tables to `utf8mb4` to support international characters and emoji icons:

```sql
-- 1. Atomic State Store
CREATE TABLE IF NOT EXISTS kv_store (
    `key` VARCHAR(64) PRIMARY KEY,
    `value` LONGTEXT NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Single-Use Cryptographic Password Resets
CREATE TABLE IF NOT EXISTS password_resets (
    `email` VARCHAR(128) PRIMARY KEY,
    `otp_hash` VARCHAR(128) NOT NULL,
    `expires_at` INT NOT NULL,
    `attempts` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Isolated Credential Vault (Survives Ledger Reboots)
CREATE TABLE IF NOT EXISTS user_credentials (
    `user_id` VARCHAR(64) PRIMARY KEY,
    `email` VARCHAR(128) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. Multi-Tenant Role Hierarchy & The "Type P" Protocol

### 4.1 Permission Matrix

| Role Key | Role Label | Scope | Access Capabilities | Restrictions |
| :--- | :--- | :--- | :--- | :--- |
| `master` | Super Admin | Consolidated | Unrestricted access across all subsidiaries, ledger wipes, SMTP settings, user creation. | None. Root authority. |
| `branch_admin` | Branch General Manager | Single Branch | Full local operations, invoicing, bills, inventory counts, production approvals, local staff creation. | Strict Chinese Wall: Cannot view or switch to other subsidiaries or Consolidated Group. |
| `accountant` | Senior Accountant | Single Branch | Full A/R, A/P, bank registers, journal adjustments, reconciliations, invoice dispatch. | Cannot wipe branch ledger or alter legal profile. Can provision Type P clerks. |
| `sales_staff` | Sales & Billing Officer | Single Branch | Create invoices, record customer payments, register customer accounts. | Banking registers, expenses, vendor bills, and audit logs are hidden. |
| `production_staff` | **Type P (Floor Operations)** | Single Branch | Physical production batches, raw material requisition, yield entries, waste/damage logging. | **STRICT AIR-GAP:** All bank balances, profits, revenue rates, pricing columns, and expenses are **100% redacted**. |

### 4.2 Implementing the "Type P" Financial Air-Gap
Floor workers must log operational yields without ever seeing executive financial margins:

```javascript
// Enforcement in UI Rendering Engine (app.js)
function isFinancialViewPermitted(userRole) {
  return !['production_staff', 'logistics_clerk'].includes(userRole);
}

function renderStatCards(metrics, userRole) {
  if (!isFinancialViewPermitted(userRole)) {
    // Redact bank balances and revenue
    return `
      <div class="stat-card">
        <label>Active Batches Completed</label>
        <div class="stat-value">${metrics.batchCount}</div>
      </div>
      <div class="stat-card">
        <label>Damaged / Spoilage Units</label>
        <div class="stat-value">${metrics.damagedUnits}</div>
      </div>
    `;
  }

  // Full Executive Financial View
  return `
    <div class="stat-card">
      <label>Liquid Cash Position</label>
      <div class="stat-value">${formatCurrency(metrics.cash)}</div>
    </div>
    <div class="stat-card">
      <label>Net Profit YTD</label>
      <div class="stat-value">${formatCurrency(metrics.netProfit)}</div>
    </div>
  `;
}
```

---

## 5. Communications Engine: Pure Socket Multi-Tier SMTP

### 5.1 The Shared-Hosting SMTP Problem
1. **PHP `mail()` is disabled:** Modern cPanel and LiteSpeed environments routinely place `mail` in `disable_functions` in `php.ini`. Calling `mail()` throws fatal uncaught exceptions in PHP 8.
2. **Subdomain DNS Failures:** Configurations defaulting to `mail.subdomain.domain.com` frequently fail because cPanel wildcard DNS does not resolve the mail subdomain, causing 12–30 second TCP connection timeouts.
3. **External Port Blocks:** Ports `465` and `587` outbound are frequently blocked or firewalled between hosting providers.

### 5.2 The 3-Tier Multi-Host Socket Engine
The outbound mail engine bypasses external network stacks by connecting directly to the local cPanel Exim mailer on `127.0.0.1:25`:

```php
function sendSmtpEmail($to, $subject, $htmlContent, $customConfig = [], $cc = '') {
    $defaultHost = defined('SMTP_HOST') ? SMTP_HOST : '127.0.0.1';
    $defaultPort = defined('SMTP_PORT') ? SMTP_PORT : 25;
    $defaultUser = defined('SMTP_USER') ? SMTP_USER : 'admin@domain.com';
    $defaultPass = defined('SMTP_PASS') ? SMTP_PASS : 'SecretPass!';
    $defaultSecure = defined('SMTP_SECURE') ? SMTP_SECURE : 'none';
    $defaultFrom = defined('SMTP_FROM_EMAIL') ? SMTP_FROM_EMAIL : 'admin@domain.com';
    $defaultName = defined('SMTP_FROM_NAME') ? SMTP_FROM_NAME : 'Corporate Entity Ltd';

    // Discard invalid subdomains and sanitize to local loopback
    $host = $customConfig['host'] ?? $defaultHost;
    if (strpos($host, 'mail.') !== false && !filter_var(gethostbyname($host), FILTER_VALIDATE_IP)) {
        $host = '127.0.0.1';
    }

    $execSocket = function($tHost, $tPort, $tSecure, $tUser, $tPass) use ($to, $subject, $htmlContent, $defaultFrom, $defaultName, $cc) {
        $prefix = ($tSecure === 'ssl') ? 'ssl://' : '';
        $timeout = 8;
        $context = stream_context_create([
            'ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true]
        ]);

        $socket = @stream_socket_client($prefix . $tHost . ':' . $tPort, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
        if (!$socket) return null;

        stream_set_timeout($socket, 8);
        $read = function() use ($socket) {
            $data = "";
            while ($str = fgets($socket, 515)) {
                $data .= $str;
                if (substr($str, 3, 1) === " ") break;
            }
            return $data;
        };
        $send = function($cmd) use ($socket) { fputs($socket, $cmd . "\r\n"); };

        $read(); // 220 banner
        $send("EHLO " . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
        $ehlo = $read();

        // Negotiate STARTTLS if requested
        if ($tSecure === 'tls' && strpos($ehlo, 'STARTTLS') !== false) {
            $send("STARTTLS"); $read();
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            $send("EHLO localhost"); $read();
        }

        // Authenticate if credentials provided
        if (!empty($tPass) && !empty($tUser)) {
            $send("AUTH LOGIN");
            $prompt = $read();
            if (substr($prompt, 0, 3) === "334") {
                $send(base64_encode($tUser)); $read();
                $send(base64_encode($tPass)); $auth = $read();
                if (substr($auth, 0, 3) !== "235" && $tHost !== '127.0.0.1') {
                    fclose($socket); return null;
                }
            }
        }

        $send("MAIL FROM:<{$defaultFrom}>"); $read();
        $send("RCPT TO:<{$to}>"); $read();
        if (!empty($cc)) { $send("RCPT TO:<{$cc}>"); $read(); }
        $send("DATA"); $read();

        $headers = [
            "MIME-Version: 1.0",
            "Content-Type: text/html; charset=UTF-8",
            "From: =?UTF-8?B?" . base64_encode($defaultName) . "?= <{$defaultFrom}>",
            "Reply-To: {$defaultFrom}",
            "Date: " . date('r'),
            "X-Mailer: OS-Direct-Socket/1.0"
        ];
        $payload = implode("\r\n", $headers) . "\r\nTo: <{$to}>\r\nSubject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n\r\n" . $htmlContent . "\r\n.";
        $send($payload);
        $res = $read();
        $send("QUIT");
        fclose($socket);

        return (substr($res, 0, 3) === "250") ? true : null;
    };

    // Tier 1: Configured host
    if ($execSocket($host, $customConfig['port'] ?? $defaultPort, $customConfig['secure'] ?? $defaultSecure, $customConfig['user'] ?? $defaultUser, $customConfig['pass'] ?? $defaultPass)) {
        return ['success' => true, 'method' => 'SMTP Direct Socket'];
    }

    // Tier 2: Localhost Loopback (127.0.0.1:25)
    if ($host !== '127.0.0.1') {
        if ($execSocket('127.0.0.1', 25, 'none', '', '')) {
            return ['success' => true, 'method' => 'cPanel Local Exim Loopback'];
        }
    }

    // Tier 3: PHP Native mail() Guarded
    if (function_exists('mail')) {
        $sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $htmlContent, "Content-Type: text/html; charset=UTF-8\r\nFrom: {$defaultFrom}");
        if ($sent) return ['success' => true, 'method' => 'PHP mail() Gateway'];
    }

    return ['success' => false, 'error' => 'All SMTP delivery tiers exhausted.'];
}
```

---

## 6. Authentication & Secure Password Recovery

### 6.1 Cryptographic OTP Flow
1. **Request Stage:** User submits registered corporate email or Gmail.
2. **Ledger Verification:** Server verifies existence in `state.users` or emergency fallback lists.
3. **Generation:** Generates a 6-digit cryptographic integer: `random_int(100000, 999999)`.
4. **Hashing & Expiration:** Stores SHA-256 hash (`hash('sha256', $otp . $salt)`) in `password_resets` with a strict **15-minute expiration** window.
5. **Rate-Limiting:** Max 5 incorrect attempts before code is permanently locked and wiped.
6. **Confirmation Dispatch:** When changed, a security alert is dispatched immediately to the user's inbox confirming the action.

---

## 7. UI/UX Design System & Mobile PWA Standards

### 7.1 Design Tokens (CSS Variables)
Use clean semantic color tokens supporting Apple HIG styling:

```css
:root {
  --brand: #00a651;             /* Primary Corporate Green */
  --brand-hover: #008f45;
  --ink: #0f172a;               /* Primary Text */
  --muted: #64748b;             /* Secondary Text */
  --line: #e2e8f0;              /* Card & Table Borders */
  --well: #f8fafc;              /* Table Header & Input Background */
  --surface: #ffffff;           /* Card & Modal Background */
  --bad: #dc2626;               /* Errors & Overdue Alerts */
  --good: #16a34a;              /* Success & Paid Status */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}
```

### 7.2 Service Worker Cache Busting Protocol
To prevent stale asset lock-in across user phones and desktops:
1. Version every asset query parameter: `scripts/app.js?v=X.X` and `styles/main.css?v=X.X`.
2. Update the cache name inside `sw.js`: `const CACHE_NAME = 'product-vX.X'`.
3. In `sw.js` activate event, immediately purge outdated caches:

```javascript
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});
```

---

## 8. Safe Subsidiary Reboot & Data Isolation Protocol

When an administrator resets a subsidiary or branch, operational data (invoices, expenses, stock levels) must be cleared **without locking out executives**:

```javascript
function executeBranchReboot(entityId) {
  // 1. Wipe Branch Transaction Ledgers
  entity.invoices = [];
  entity.bills = [];
  entity.expenses = [];
  entity.assemblyBatches = [];
  entity.wasteLogs = [];
  
  // 2. Reset Inventory Quantities to Zero (Preserve SKU Catalog)
  entity.inventory.forEach(item => item.quantity = 0);

  // 3. Purge Temporary Branch Staff
  state.users = state.users.filter(u => {
    if (u.entityId === entityId && u.role !== 'branch_admin') return false;
    return true;
  });

  // 4. CRITICAL INVARIANT: Re-hydrate & Protect Core Admin Logins
  ensureAdminsPreserved(state);

  // 5. Commit to Storage
  persistState(state);
}
```

---

## 9. Deployment Protocol (Strict No-ZIP Hot-Patching)

To deploy patches to a live system without disrupting runtime databases:

1. **Never upload bulk ZIP archives** over existing installations: Extracting ZIP archives risks overwriting `.htaccess`, active `data/books.sqlite` files, or local configuration keys.
2. **Deploy strictly modified files:** Map repository paths to server paths:
   * `root/api.php` $\to$ `public_html/subdomain/api.php`
   * `root/config.php` $\to$ `public_html/subdomain/config.php`
   * `root/scripts/app.js` $\to$ `public_html/subdomain/scripts/app.js`
   * `root/index.html` $\to$ `public_html/subdomain/index.html`
   * `root/sw.js` $\to$ `public_html/subdomain/sw.js`
3. **Verify File Permissions:**
   * Script files: `0644`
   * Directories & `data/` folder: `0755` (writable by web server process)
4. **Post-Deployment Smoke Test Checklist:**
   * [ ] Load homepage over HTTPS: check console for zero 404s.
   * [ ] Perform login test using both master credentials and branch admin credentials.
   * [ ] Trigger a test SMTP dispatch: ensure response returns within $\le 2$ seconds.
   * [ ] Verify mobile install banner / PWA manifest status in DevTools Application tab.

---

## 10. Replication Blueprint for New Products

When applying this framework to build a new product:

1. **Step 1 — Setup Domain & DNS:** Configure domain (`app.domain.com`) with valid `A` records pointing to the server IP.
2. **Step 2 — Scaffold Directory:** Copy `api.php`, `config.php`, `index.html`, `sw.js`, and `manifest.json`.
3. **Step 3 — Configure `config.php`:** Set database mode (SQLite or MySQL) and SMTP credentials (`127.0.0.1:25`).
4. **Step 4 — Define Entities & Roles in `data.js`:** Configure the business divisions, default super admin, branch managers, and chart of accounts.
5. **Step 5 — Enforce Role Restrictions in `app.js`:** Identify which staff roles require the "Type P" financial air-gap.
6. **Step 6 — Brand Customization:** Replace `assets/` with crisp SVG/PNG icons and set CSS theme tokens in `styles/main.css`.
7. **Step 7 — Upload & Test:** Transfer files to `public_html/` via FTP or cPanel File Manager and verify instant operation.
