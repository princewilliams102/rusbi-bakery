# Apex Books — cPanel Deployment Guide

**Apex Books** is a double-entry accounting operating system combining:
1. **QuickBooks Workflows:** Accounts Receivable (Invoices & Customers), Accounts Payable (Bills & Vendors), Banking registers, and GAAP Chart of Accounts.
2. **Frappe Books Precision:** Minimalist line-item editors, double-entry validation, and clean invoice paper views.
3. **Apex OS Styling:** The executive sliding pill navigation, floating dock, and warm glassmorphic aesthetics from `http://localhost:5173/`.
4. **cPanel Native:** Pure PHP (7.4 to 8.3+) with automated SQLite zero-config storage or standard cPanel MySQL.

---

## 🚀 Quick cPanel Installation (Under 2 Minutes)

### Step 1: Upload to cPanel
1. Compress this folder (`apex-books/`) into a `.zip` archive.
2. Log into your **cPanel**.
3. Open **File Manager**.
4. Navigate to `public_html/` (or create a subdomain directory like `public_html/books`).
5. Upload the `.zip` file and click **Extract**.

### Step 2: Set Directory Permissions
Make sure the `data/` folder is writable by Apache:
* In cPanel File Manager, right-click the `data/` directory.
* Select **Change Permissions** and set it to `755` (or `775`).

### Step 3: Open in Browser
Visit your URL:
`https://yourdomain.com/books` (or `https://books.yourdomain.com`)

*That's it!* On first load, `api.php` will automatically create `data/books.sqlite`, initialize all double-entry tables, and seed the initial QuickBooks chart of accounts.

---

## 🗄️ Optional: Connecting to cPanel MySQL

If your firm prefers MySQL over SQLite:

1. In cPanel, open **MySQL Database Wizard**.
2. Create a database (e.g. `cpaneluser_apexbooks`) and a user with **ALL PRIVILEGES**.
3. In File Manager, edit `config.php`:
   ```php
   define('DB_DRIVER', 'mysql');
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'cpaneluser_apexbooks');
   define('DB_USER', 'cpaneluser_dbuser');
   define('DB_PASS', 'YourPasswordHere');
   ```
4. Save the file. Apex Books will automatically connect to MySQL and manage synchronization.

---

## 🔑 Core Features & Shortcuts

* **Dashboard (`1`):** Liquid cash balance, unpaid invoices (A/R), unpaid bills (A/P), net profit YTD, and monthly cash flow chart.
* **Invoices (`2`):** Create invoices, print Frappe-style minimal PDF previews, and receive payments into checking.
* **Bills (`3`):** Enter vendor bills, classify into expense categories, and settle payouts.
* **Banking (`4`):** Real-time checking & credit card registers with running balances and reconciliation markers.
* **Chart of Accounts (`5`):** Standard 5-tier accounting tree (Assets, Liabilities, Equity, Income, Expenses).
* **Journal Entries (`6`):** Manual double-entry with debit/credit balance enforcement.
* **Reports (`7`):** Real-time Profit & Loss and Balance Sheet.
