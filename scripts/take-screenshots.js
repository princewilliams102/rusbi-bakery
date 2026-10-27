import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pagesDir = path.resolve(__dirname, '..', 'pages');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const routes = [
  { file: '02_dashboard_control_room.png', route: 'dashboard', name: 'Bakery Control Room Dashboard' },
  { file: '03_sales_pos.png', route: 'pos', name: 'Sales POS Live Tenders' },
  { file: '04_production_batches.png', route: 'batches', name: 'Production & Flour Batches' },
  { file: '05_crates_tracker.png', route: 'crates', name: 'Crates Tracker (Security Guard)' },
  { file: '06_credit_bashi.png', route: 'bashi', name: 'Credit Ledger (Who Owes Me Money)' },
  { file: '07_cashier_shifts.png', route: 'shifts', name: 'Cashier Active Shift & Vault' },
  { file: '08_energy_generator.png', route: 'energy', name: 'Power & Fuel (Merged Energy)' },
  { file: '09_inventory.png', route: 'inventory', name: 'Inventory & Items' },
  { file: '10_contracts_institutional.png', route: 'distributors', name: 'Distributors & Bulk Buyers' },
  { file: '11_staff_users.png', route: 'users', name: 'Staff Management' },
  { file: '12_devices_network.png', route: 'devices', name: 'Plant Devices & Offline PWA Network' },
  { file: '13_audit_nolies_sheet.png', route: 'nolies', name: 'Plant Audit No-Lies Sheet' },
  { file: '14_system_settings.png', route: 'admin', name: 'Settings' },
  { file: '15_invoices.png', route: 'invoices', name: 'Invoices & Sales (A/R)' },
  { file: '16_expenses.png', route: 'expenses', name: 'Expenses & Power Fuel' },
  { file: '17_suppliers.png', route: 'suppliers', name: 'Suppliers' },
  { file: '18_banking.png', route: 'banking', name: 'Banking' },
  { file: '19_chart_of_accounts.png', route: 'accounts', name: 'Accounts (COA)' },
  { file: '20_reports_pnl.png', route: 'reports', name: 'Reports' },
  { file: '21_period_close.png', route: 'close-books', name: 'Close Books' },
  { file: '22_staff_payroll.png', route: 'staff', name: 'Staff Payroll Ledger' }
];

async function captureAll() {
  console.log('Launching headless Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1440,960'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });

  console.log('1. Capturing Login Portal...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Dismiss splash screen if visible
  await page.evaluate(() => {
    const s = document.getElementById('app-splash-screen');
    if (s) s.remove();
  });

  const loginPath = path.join(pagesDir, '01_login_portal.png');
  await page.screenshot({ path: loginPath, fullPage: false });
  console.log('Saved:', loginPath);

  // Authenticate session
  console.log('Authenticating session into workspace...');
  await page.evaluate(() => {
    localStorage.setItem('rusbi_lang', 'en');
    if (typeof window.loginAsUser === 'function') {
      window.loginAsUser('usr-1');
    } else {
      const session = {
        id: 'usr-1',
        name: 'Alhaji Ibrahim Rusbi',
        email: 'admin@rusbigroup.com',
        role: 'master',
        time: Date.now()
      };
      sessionStorage.setItem('rusbi_active_auth_session', JSON.stringify(session));
      localStorage.setItem('rusbi_active_auth_session', JSON.stringify(session));
      const portal = document.getElementById('app-login-portal');
      const ws = document.getElementById('app-workspace');
      if (portal) portal.style.display = 'none';
      if (ws) ws.style.display = 'flex';
      if (typeof window.checkAuthSession === 'function') {
        window.checkAuthSession();
      }
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  // Capture all operational and accounting routes
  for (const item of routes) {
    console.log(`Capturing: ${item.name} (${item.route})...`);
    await page.evaluate((r) => {
      if (typeof window.navigateTo === 'function') {
        window.navigateTo(r);
      }
    }, item.route);

    await new Promise(r => setTimeout(r, 600));

    // Special interaction for POS
    if (item.route === 'pos') {
      await page.evaluate(() => {
        // Select 10 loaves of Jumbo Bread
        const firstQty = document.querySelector('.pos-bread-qty');
        if (firstQty) {
          firstQty.value = '10';
          window.calcPosTotal();
        }
      });
      await new Promise(r => setTimeout(r, 300));
    }

    const outPath = path.join(pagesDir, item.file);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved: ${outPath}`);

    // If POS, also capture live balanced state with Complete Sale active
    if (item.route === 'pos') {
      console.log('Capturing: Sales POS Balanced State...');
      await page.evaluate(() => {
        const cashInput = document.getElementById('tender-cash');
        const target = window.posCalculatedTotal || 8500;
        if (cashInput) {
          cashInput.value = target;
          window.calcLiveTenders();
        }
      });
      await new Promise(r => setTimeout(r, 400));
      const paidPath = path.join(pagesDir, '03b_sales_pos_split_revealed.png');
      await page.screenshot({ path: paidPath, fullPage: false });
      console.log(`Saved: ${paidPath}`);
    }

    // If batches, capture slide-out drawer
    if (item.route === 'batches') {
      console.log('Capturing: Production + Batch Slide Drawer...');
      await page.evaluate(() => {
        if (typeof window.openNewBatchDrawer === 'function') window.openNewBatchDrawer();
      });
      await new Promise(r => setTimeout(r, 500));
      const drawerPath = path.join(pagesDir, '04b_production_batch_drawer.png');
      await page.screenshot({ path: drawerPath, fullPage: false });
      console.log(`Saved: ${drawerPath}`);
      await page.evaluate(() => {
        if (typeof window.closeModal === 'function') window.closeModal('drawer-new-batch');
      });
    }

    // If crates, capture return modal
    if (item.route === 'crates') {
      console.log('Capturing: Crates Return Modal...');
      await page.evaluate(() => {
        if (typeof window.openCrateActionModal === 'function') {
          window.openCrateActionModal('return', 'Alhaji Garba Kano', 15);
        }
      });
      await new Promise(r => setTimeout(r, 500));
      const crateModalPath = path.join(pagesDir, '05b_crate_return_modal.png');
      await page.screenshot({ path: crateModalPath, fullPage: false });
      console.log(`Saved: ${crateModalPath}`);
      await page.evaluate(() => {
        if (typeof window.closeModal === 'function') window.closeModal('modal-crate-action');
      });
    }

    // If bashi, capture pay credit modal
    if (item.route === 'bashi') {
      console.log('Capturing: Pay Credit Modal...');
      await page.evaluate(() => {
        if (typeof window.openPayCreditModal === 'function') {
          window.openPayCreditModal('bashi-1');
        }
      });
      await new Promise(r => setTimeout(r, 500));
      const creditModalPath = path.join(pagesDir, '06b_credit_pay_modal.png');
      await page.screenshot({ path: creditModalPath, fullPage: false });
      console.log(`Saved: ${creditModalPath}`);
      await page.evaluate(() => {
        if (typeof window.closeModal === 'function') window.closeModal('modal-pay-credit');
      });
    }
  }

  // Capture Close Shift Modal
  console.log('Capturing Close Shift Modal...');
  await page.evaluate(() => {
    if (typeof window.navigateTo === 'function') window.navigateTo('dashboard');
    if (typeof window.openCloseShiftModal === 'function') window.openCloseShiftModal();
  });
  await new Promise(r => setTimeout(r, 600));
  const modalPath = path.join(pagesDir, '23_close_shift_modal.png');
  await page.screenshot({ path: modalPath, fullPage: false });
  console.log('Saved:', modalPath);

  // Close modal and switch to Hausa Mode
  console.log('Capturing Hausa Mode Dashboard...');
  await page.evaluate(() => {
    if (typeof window.closeModal === 'function') window.closeModal('modal-close-shift');
    if (typeof window.toggleLanguage === 'function') {
      if (localStorage.getItem('rusbi_lang') !== 'ha') {
        window.toggleLanguage();
      }
    }
    if (typeof window.navigateTo === 'function') window.navigateTo('dashboard');
  });
  await new Promise(r => setTimeout(r, 800));
  const hausaPath = path.join(pagesDir, '24_hausa_mode_dashboard.png');
  await page.screenshot({ path: hausaPath, fullPage: false });
  console.log('Saved:', hausaPath);

  // Switch back to English
  await page.evaluate(() => {
    if (typeof window.toggleLanguage === 'function') {
      if (localStorage.getItem('rusbi_lang') === 'ha') {
        window.toggleLanguage();
      }
    }
  });

  await browser.close();
  console.log('All screenshots captured successfully in:', pagesDir);
}

captureAll().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
