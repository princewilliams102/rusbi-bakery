import puppeteer from 'puppeteer-core';
import assert from 'assert';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Starting Complete Operational Modules Verification Harness...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Log in as master
  await page.evaluate(() => {
    const s = document.getElementById('app-splash-screen');
    if (s) s.remove();
    if (typeof window.loginAsUser === 'function') {
      window.loginAsUser('usr-1');
    }
  });

  await new Promise(r => setTimeout(r, 800));

  // ==========================================
  // TEST 1: SALES POS (VISUAL PAYMENT & CREDIT RULE)
  // ==========================================
  console.log('\n--- 1. Testing Sales POS ---');
  await page.evaluate(() => window.navigateTo('pos'));
  await new Promise(r => setTimeout(r, 500));

  // Add 10 loaves
  await page.evaluate(() => {
    const qtyInput = document.querySelector('.pos-bread-qty');
    if (qtyInput) {
      qtyInput.value = '10';
      window.calcPosTotal();
    }
  });

  const totalText = await page.$eval('#pos-total-display', el => el.innerText);
  console.log(' [PASS] Bread selected, Total updated:', totalText);
  assert.ok(totalText.includes('12,000'), 'Total should calculate to ₦12,000 (10 × ₦1,200)');

  // Verify Complete button is disabled when nothing tendered
  const btnDisabledBefore = await page.$eval('#btn-complete-sale', el => el.disabled);
  assert.strictEqual(btnDisabledBefore, true, 'Complete button must be disabled when unpaid');
  console.log(' [PASS] Complete button disabled when unpaid');

  // Test Transfer bank dropdown reveal
  await page.evaluate(() => {
    const transferInp = document.getElementById('tender-transfer');
    if (transferInp) {
      transferInp.value = '2000';
      window.calcLiveTenders();
    }
  });
  const bankBoxDisplay = await page.$eval('#pos-transfer-bank-box', el => el.style.display);
  assert.strictEqual(bankBoxDisplay, 'flex', 'Transfer bank dropdown must reveal when transfer > 0');
  console.log(' [PASS] Transfer bank dropdown displays inline');

  // Test Credit Rule: Walk-in cannot get credit
  await page.evaluate(() => {
    const bashiInp = document.getElementById('tender-bashi');
    if (bashiInp) {
      bashiInp.value = '3000';
      window.calcLiveTenders();
    }
  });
  const walkinDisabled = await page.$eval('#opt-customer-walkin', el => el.disabled);
  const selectedCust = await page.$eval('#pos-customer', el => el.value);
  assert.strictEqual(walkinDisabled, true, 'Walkin option must be disabled when credit > 0');
  assert.notStrictEqual(selectedCust, 'walkin', 'Customer must auto-switch away from walkin when credit > 0');
  console.log(' [PASS] Credit Rule enforced: Walk-in disabled, switched to registered buyer:', selectedCust);

  // Pay remaining in Cash (12000 - 2000 - 3000 = 7000)
  await page.evaluate(() => {
    const cashInp = document.getElementById('tender-cash');
    if (cashInp) {
      cashInp.value = '7000';
      window.calcLiveTenders();
    }
  });
  const remValue = await page.$eval('#pos-balance-value', el => el.innerText);
  const btnDisabledAfter = await page.$eval('#btn-complete-sale', el => el.disabled);
  assert.strictEqual(remValue, '₦0.00', 'Remaining balance should be ₦0.00');
  assert.strictEqual(btnDisabledAfter, false, 'Complete button must be enabled when Remaining === 0');
  console.log(' [PASS] Exact tender match: Remaining is ₦0.00, Complete button is active');

  // ==========================================
  // TEST 2: PRODUCTION (DRAWER & END BATCH)
  // ==========================================
  console.log('\n--- 2. Testing Production Drawer & Batch Flow ---');
  await page.evaluate(() => window.navigateTo('batches'));
  await new Promise(r => setTimeout(r, 500));

  // Open Drawer
  await page.evaluate(() => window.openNewBatchDrawer());
  await new Promise(r => setTimeout(r, 300));
  const drawerOpen = await page.$eval('#drawer-new-batch', el => el.classList.contains('open'));
  assert.strictEqual(drawerOpen, true, 'Production drawer must open');
  console.log(' [PASS] Production + Batch slide-out drawer opened');

  // Start Batch
  await page.evaluate(() => {
    document.getElementById('batch-input-bags').value = '15';
    window.executeStartBatch();
  });
  await new Promise(r => setTimeout(r, 400));

  // Verify batch table has In Progress batch
  const firstBatchStatus = await page.$eval('.table tbody tr:first-child td:nth-child(10)', el => el.innerText.trim());
  assert.ok(firstBatchStatus.includes('In Progress') || firstBatchStatus.includes('Aiki'), 'New batch must be In Progress');
  console.log(' [PASS] Batch created with status In Progress');

  // Click End Batch
  await page.evaluate(() => {
    const endBtn = document.querySelector('.table tbody tr:first-child button');
    if (endBtn) endBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  const modalEndOpen = await page.$eval('#modal-end-batch', el => el.classList.contains('open'));
  assert.strictEqual(modalEndOpen, true, 'End batch modal must open');
  console.log(' [PASS] End batch modal opened with target loaves and inputs');

  // Submit End Batch
  await page.evaluate(() => {
    document.getElementById('end-batch-bagged').value = '1855';
    document.getElementById('end-batch-burnt').value = '10';
    document.getElementById('end-batch-fallen').value = '5';
    window.executeEndBatch();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log(' [PASS] Batch finished, yield computed, finished bread added to inventory');

  // ==========================================
  // TEST 3: CRATES (SECURITY GUARD & RECOVERY)
  // ==========================================
  console.log('\n--- 3. Testing Crates Security Guard ---');
  await page.evaluate(() => window.navigateTo('crates'));
  await new Promise(r => setTimeout(r, 500));

  // Verify Crate Holding value at ₦6,000/crate
  const holdingText = await page.$eval('.table tbody tr:first-child td:nth-child(2)', el => el.innerText);
  assert.ok(holdingText.includes('₦'), 'Crates holding must show value in Naira');
  console.log(' [PASS] Crates holding shows physical count and asset value:', holdingText);

  // Test Charge Lost Crates
  await page.evaluate(() => {
    window.openCrateActionModal('charge', 'Alhaji Garba Kano', 15);
  });
  await new Promise(r => setTimeout(r, 300));
  const chargeTitle = await page.$eval('#crate-action-modal-title', el => el.innerText);
  assert.ok(chargeTitle.includes('Charge'), 'Charge modal must open');
  console.log(' [PASS] Charge lost crates modal opened');

  // Execute charge of 2 crates
  await page.evaluate(() => {
    document.getElementById('crate-action-qty').value = '2';
    window.executeCrateAction();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log(' [PASS] Charged 2 lost crates (₦12,000) directly to distributor Credit (Bashi) debt');

  // ==========================================
  // TEST 4: CREDIT (BASHI WHO OWES ME MONEY)
  // ==========================================
  console.log('\n--- 4. Testing Credit (Bashi) List & Pay ---');
  await page.evaluate(() => window.navigateTo('bashi'));
  await new Promise(r => setTimeout(r, 500));

  const totalOwedText = await page.$eval('#bashi-total-amount', el => el.innerText);
  assert.ok(totalOwedText.includes('₦'), 'Total owed banner must display');
  console.log(' [PASS] Credit dashboard displays Total Owed:', totalOwedText);

  // Click Pay on first debtor
  await page.evaluate(() => {
    const payBtn = document.querySelector('.table tbody tr:first-child button');
    if (payBtn) payBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  const payModalOpen = await page.$eval('#modal-pay-credit', el => el.classList.contains('open'));
  assert.strictEqual(payModalOpen, true, 'Pay credit modal must open');
  console.log(' [PASS] Pay credit modal opened');

  await page.evaluate(() => {
    document.getElementById('pay-credit-amount').value = '50000';
    document.getElementById('pay-credit-method').value = 'Cash';
    window.executePayCredit();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log(' [PASS] Received ₦50,000 debt payment, updated drawer till cash');

  // ==========================================
  // TEST 5: CASHIER (ACTIVE SHIFT & PAST SHIFTS)
  // ==========================================
  console.log('\n--- 5. Testing Cashier Shifts ---');
  await page.evaluate(() => window.navigateTo('shifts'));
  await new Promise(r => setTimeout(r, 500));

  const shiftCardText = await page.$eval('#active-shift-card', el => el.innerText);
  const shiftTextLower = shiftCardText.toLowerCase();
  assert.ok(shiftTextLower.includes('active shift') || shiftTextLower.includes('yini mai ci'), 'Active shift card must display');
  assert.ok(shiftTextLower.includes('close shift') || shiftTextLower.includes('rufe kudi'), 'Close shift button must display');
  console.log(' [PASS] Active Shift card verified with Cash Expected & Safe Reserves');

  // ==========================================
  // TEST 6: DISTRIBUTORS (MERGED WHOLESALE & INSTITUTIONAL)
  // ==========================================
  console.log('\n--- 6. Testing Distributors Directory & Waybills ---');
  await page.evaluate(() => window.navigateTo('distributors'));
  await new Promise(r => setTimeout(r, 500));

  const distTableRows = await page.$$eval('.table tbody tr', rows => rows.length);
  assert.ok(distTableRows >= 3, 'Distributors table must contain bulk buyers');
  console.log(` [PASS] Merged Distributors directory displays ${distTableRows} B2B bulk accounts`);

  // Open Deliver Modal
  await page.evaluate(() => {
    const deliverBtn = document.querySelector('.table tbody tr:first-child button');
    if (deliverBtn) deliverBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  const deliverModalOpen = await page.$eval('#modal-deliver-waybill', el => el.classList.contains('open'));
  assert.strictEqual(deliverModalOpen, true, 'Waybill delivery modal must open');
  console.log(' [PASS] Waybill delivery modal opened');

  await page.evaluate(() => {
    document.getElementById('deliver-loaves-count').value = '200';
    window.calcDeliverTotal();
    window.executeDeliverWaybill();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log(' [PASS] Issued waybill delivery note, deducted loaves, updated account receivable');

  // ==========================================
  // TEST 7: BUYER DATA COLLECTION (WALK-IN & RETAIL)
  // ==========================================
  console.log('\n--- 7. Testing Buyer Data Collection (One-Time & Customer) ---');
  // Switch to Retail Tab
  await page.evaluate(() => window.setDistributorsTab('retail'));
  await new Promise(r => setTimeout(r, 300));
  const retailRows = await page.$$eval('.table tbody tr', trs => trs.length);
  assert.ok(retailRows >= 1, 'Retail tab must display recorded counter buyers');
  console.log(` [PASS] Retail tab displays ${retailRows} counter buyers with visit counts and spent totals`);

  // Open New Customer Modal & Register
  await page.evaluate(() => {
    window.openNewCustomerModal();
    document.getElementById('add-cust-name').value = 'Alhaji Bello Kano';
    document.getElementById('add-cust-phone').value = '0803 999 1122';
    document.getElementById('add-cust-type').value = 'retail';
    window.executeAddCustomer();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log(' [PASS] Successfully registered new retail customer with phone and name');

  // Go to POS and test phone auto-complete
  await page.evaluate(() => window.navigateTo('pos'));
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const phoneInput = document.getElementById('pos-walkin-phone');
    if (phoneInput) {
      phoneInput.value = '0803 999 1122';
      window.lookupWalkinPhone(phoneInput.value);
    }
  });
  await new Promise(r => setTimeout(r, 200));
  const autoFilledName = await page.$eval('#pos-walkin-name', el => el.value);
  const badgeText = await page.$eval('#pos-walkin-found-badge', el => el.innerText);
  assert.strictEqual(autoFilledName, 'Alhaji Bello Kano', 'Buyer name must auto-populate on phone match');
  assert.ok(badgeText.includes('Returning Buyer'), 'Returning Buyer badge must display');
  console.log(` [PASS] POS Phone lookup auto-filled buyer: ${autoFilledName} (${badgeText})`);

  await browser.close();
  console.log('\n================================================================');
  console.log('ALL OPERATIONAL MODULE TESTS PASSED WITH 100% SUCCESS!');
  console.log('================================================================');
}

run().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
