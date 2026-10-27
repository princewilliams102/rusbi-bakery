import puppeteer from 'puppeteer-core';
import assert from 'assert';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Testing POS Customer Data Capture (Walk-in vs Registered)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Log in
  await page.evaluate(() => {
    const s = document.getElementById('app-splash-screen');
    if (s) s.remove();
    if (typeof window.loginAsUser === 'function') {
      window.loginAsUser('usr-1');
    }
  });

  await new Promise(r => setTimeout(r, 800));

  // Navigate to POS
  await page.evaluate(() => {
    window.navigateTo('pos');
  });

  await new Promise(r => setTimeout(r, 600));

  // 1. Verify default walk-in state
  const defaultVal = await page.$eval('#pos-customer', el => el.value);
  assert.strictEqual(defaultVal, 'walkin', 'Default customer must be walkin');
  console.log(' [PASS] Default customer is walkin');

  const walkinVisible = await page.$eval('#pos-walkin-data', el => window.getComputedStyle(el).display);
  assert.strictEqual(walkinVisible, 'grid', 'Walkin inputs must be visible by default');
  console.log(' [PASS] Walkin inputs are visible by default');

  // 2. Select a registered distributor (e.g., bashi-1)
  await page.evaluate(() => {
    const sel = document.getElementById('pos-customer');
    if (sel.options.length > 1) {
      sel.selectedIndex = 1;
      window.handlePosCustomerChange();
    }
  });

  const walkinAfterSelect = await page.$eval('#pos-walkin-data', el => window.getComputedStyle(el).display);
  const regInfoAfterSelect = await page.$eval('#pos-registered-info', el => window.getComputedStyle(el).display);
  assert.strictEqual(walkinAfterSelect, 'none', 'Walkin box must be hidden when registered customer is picked');
  assert.strictEqual(regInfoAfterSelect, 'block', 'Registered badge must be shown when registered customer is picked');
  console.log(' [PASS] Registered customer details badge toggles cleanly');

  // 3. Test + New Customer inline form
  await page.evaluate(() => {
    window.togglePosNewCustomer();
  });
  const formVisible = await page.$eval('#pos-new-cust-form', el => window.getComputedStyle(el).display);
  assert.strictEqual(formVisible, 'flex', 'New customer form must display when + New is clicked');
  console.log(' [PASS] + New customer form expands');

  // 4. Fill in new customer and save
  await page.evaluate(() => {
    document.getElementById('pos-new-cust-name').value = 'Hajiya Fatima Gusau';
    document.getElementById('pos-new-cust-phone').value = '0803 123 4567';
    window.savePosNewCustomer();
  });

  const selectedName = await page.$eval('#pos-customer', el => el.options[el.selectedIndex].text);
  assert.ok(selectedName.includes('Hajiya Fatima Gusau'), 'Newly added customer must be auto-selected');
  console.log(' [PASS] Saved customer is auto-selected in dropdown: ' + selectedName);

  // Take screenshot of POS with registered customer
  await page.screenshot({ path: 'pages/03c_sales_pos_customer_captured.png' });
  console.log('Saved: pages/03c_sales_pos_customer_captured.png');

  await browser.close();
  console.log('ALL POS CUSTOMER CAPTURE TESTS PASSED!');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
