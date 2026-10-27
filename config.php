<?php
/**
 * Apex Books - cPanel Configuration
 * 
 * If you want to use MySQL on cPanel instead of SQLite:
 * 1. Create a database and user in cPanel MySQL Database Wizard.
 * 2. Set DB_DRIVER to 'mysql' and fill in your DB credentials below.
 */

define('DB_DRIVER', 'sqlite'); // 'sqlite' or 'mysql'

// SQLite Path (Auto-created in data directory with proper cPanel permissions)
define('SQLITE_FILE', __DIR__ . '/data/books.sqlite');

// MySQL Credentials (Optional - only if DB_DRIVER is 'mysql')
define('DB_HOST', 'localhost');
define('DB_NAME', 'cpaneluser_apexbooks');
define('DB_USER', 'cpaneluser_dbadmin');
define('DB_PASS', 'YourSecurePasswordHere');
define('DB_PORT', 3306);
