<?php
/**
 * Rusbi Books - cPanel Configuration & MySQL Database Settings
 */

define('DB_DRIVER', 'mysql'); // Activated cPanel MySQL

// SQLite Path (Fallback)
define('SQLITE_FILE', __DIR__ . '/data/books.sqlite');

// cPanel MySQL Credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'jausdsywh1_rusbi');
define('DB_USER', 'jausdsywh1_rusbi');
define('DB_PASS', 'Damian1937$$');
define('DB_PORT', 3306);

// ============================================================
// SMTP Outgoing Mailer Configuration (cPanel Webmail)
// ============================================================
define('SMTP_ENABLED', true);
define('SMTP_HOST', '127.0.0.1');                      // Direct cPanel Local Exim MTA Socket
define('SMTP_PORT', 25);                               // Port 25 for local direct delivery
define('SMTP_SECURE', 'none');                         // 'none' for local direct delivery
define('SMTP_USER', 'admin@rusbigroup.com');           // cPanel Webmail email
define('SMTP_PASS', '#RusbiGroup2026$$');              // Webmail password
define('SMTP_FROM_EMAIL', 'admin@rusbigroup.com');
define('SMTP_FROM_NAME', 'Rusbi Group of Companies Ltd');


