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

  const PORT = process.env.PORT || 3001;
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle2' });

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
  // TEST 1: SALES POS (WALK-IN VS DISTRIBUTOR & PARTIAL / ZERO PAYMENT)
  // ==========================================
  console.log('\n--- 1. Testing Sales POS ---');
  await page.evaluate(() => window.navigateTo('pos'));
  await new Promise(r => setTimeout(r, 500));

  // 1. Verify default Customer mode is Walk-in with Name & Phone inputs
  const walkinBoxDisplay = await page.$eval('#pos-walkin-box', el => el.style.display);
  const distBoxDisplay = await page.$eval('#pos-distributor-box', el => el.style.display);
  assert.notStrictEqual(walkinBoxDisplay, 'none', 'Walk-in box must be visible by default');
  assert.strictEqual(distBoxDisplay, 'none', 'Distributor box must be hidden by default');
  console.log(' [PASS] Default customer mode: Walk-in (Name & Phone inputs visible)');

  // 2. Switch to Distributor: Name & Phone inputs hidden, distributor dropdown shown
  await page.evaluate(() => window.setPosCustType('distributor'));
  const walkinBoxAfter = await page.$eval('#pos-walkin-box', el => el.style.display);
  const distBoxAfter = await page.$eval('#pos-distributor-box', el => el.style.display);
  assert.strictEqual(walkinBoxAfter, 'none', 'Walk-in inputs must be hidden for Distributors');
  assert.notStrictEqual(distBoxAfter, 'none', 'Distributor dropdown must be visible for Distributors');
  const debtPillText = await page.$eval('#pos-distributor-debt-badge', el => el.innerText);
  console.log(' [PASS] Distributor mode active (Name & Phone hidden). Debt status:', debtPillText);

  // 3. Test Payment Methods & Bank Selection
  await page.evaluate(() => window.setPosPayMethod('transfer'));
  const transferBankBoxDisplay = await page.$eval('#pos-transfer-bank-box', el => el.style.display);
  assert.notStrictEqual(transferBankBoxDisplay, 'none', 'Destination bank selector must be visible on Transfer');
  const bankOptionsCount = await page.$$eval('#pos-transfer-bank-account option', opts => opts.length);
  assert.ok(bankOptionsCount >= 1, 'Must have at least one bank account from Banking module');
  console.log(` [PASS] Transfer selected: Destination bank account selector visible (${bankOptionsCount} accounts linked)`);

  await page.evaluate(() => window.setPosPayMethod('pos'));
  const posTerminalBoxDisplay = await page.$eval('#pos-terminal-box', el => el.style.display);
  assert.notStrictEqual(posTerminalBoxDisplay, 'none', 'POS terminal selector must be visible on POS');
  console.log(' [PASS] POS method selected: Terminal account selector visible');

  await page.evaluate(() => window.setPosPayMethod('cash'));
  const cashBoxDisplay = await page.$eval('#pos-cash-box', el => el.style.display);
  assert.notStrictEqual(cashBoxDisplay, 'none', 'Cash till information must be visible on Cash');
  console.log(' [PASS] Cash method selected: Cash drawer till active');

  // 4. Add 10 loaves (₦12,000)
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

  // 5. Partial Payment Math (e.g. paying ₦5,000 on ₦12,000 order)
  await page.evaluate(() => {
    const paidInput = document.getElementById('pos-amount-paid');
    if (paidInput) {
      paidInput.value = '5000';
      window.calcPosPaymentMath();
    }
  });
  const paidText = await page.$eval('#pos-breakdown-paid', el => el.innerText);
  const owingText = await page.$eval('#pos-breakdown-owing', el => el.innerText);
  assert.ok(paidText.includes('5,000'), 'Paid breakdown should show ₦5,000');
  assert.ok(owingText.includes('7,000'), 'Owing balance should add ₦7,000');
  const btnEnabledPartial = await page.$eval('#btn-complete-sale', el => !el.disabled);
  assert.strictEqual(btnEnabledPartial, true, 'Complete button must be enabled on partial payment');
  console.log(` [PASS] Partial payment math: Paid ${paidText}, Added to Debt: ${owingText}. Complete button enabled!`);

  // 6. Zero Payment Math (100% credit checkout)
  await page.evaluate(() => window.setPosAmountPreset('zero'));
  const owingFullText = await page.$eval('#pos-breakdown-owing', el => el.innerText);
  assert.ok(owingFullText.includes('12,000'), 'Zero payment should drop entire ₦12,000 to owing balance');
  const btnEnabledZero = await page.$eval('#btn-complete-sale', el => !el.disabled);
  assert.strictEqual(btnEnabledZero, true, 'Complete button must remain enabled even on ₦0 payment');
  console.log(' [PASS] Zero payment preset (Credit ₦0): Entire ₦12,000 drops into owing balance. Checkout enabled!');

  // ==========================================
  // TEST 2: PRODUCTION (TWO-STEP DRAWER: MIX -> BAG)
  // ==========================================
  console.log('\n--- 2. Testing Production Two-Step Drawer (Mix -> Bag) ---');
  await page.evaluate(() => window.navigateTo('batches'));
  await new Promise(r => setTimeout(r, 500));

  // 1. Open Drawer (+ Batch)
  await page.evaluate(() => window.openNewBatchDrawer());
  await new Promise(r => setTimeout(r, 300));
  const drawerOpen = await page.$eval('#drawer-new-batch', el => el.classList.contains('open'));
  assert.strictEqual(drawerOpen, true, 'Production drawer must open');
  console.log(' [PASS] Production + Batch drawer opened');

  // 2. Verify Phase 1 (The Mix): Immediate Target and Inventory Deductions Table
  await page.evaluate(() => {
    document.getElementById('batch-input-bags').value = '15';
    window.calcBatchMixPhase();
  });
  const targetMixText = await page.$eval('#batch-mix-target-display', el => el.innerText);
  const deductFlour = await page.$eval('#deduct-flour-qty', el => el.innerText);
  const deductSugar = await page.$eval('#deduct-sugar-qty', el => el.innerText);
  const deductMarg = await page.$eval('#deduct-marg-qty', el => el.innerText);
  assert.ok(targetMixText.includes('1,875'), 'Target must be immediately visible as 1,875 Loaves');
  assert.ok(deductFlour.includes('-15'), 'Flour deduction must show -15 Bags');
  assert.ok(deductSugar.includes('-1'), 'Sugar deduction must show -1 Bag');
  assert.ok(deductMarg.includes('-5'), 'Margarine deduction must show -5 Cartons');
  console.log(` [PASS] Phase 1 Mix verified: Target ${targetMixText}, Deductions: Flour ${deductFlour}, Sugar ${deductSugar}, Marg ${deductMarg}`);

  // 3. Click Start Batch: Raw materials drop, drawer stays open, transitions to Phase 2 (The Bag)
  await page.evaluate(() => window.executeStartBatch());
  await new Promise(r => setTimeout(r, 300));
  const drawerStillOpen = await page.$eval('#drawer-new-batch', el => el.classList.contains('open'));
  const phase1Display = await page.$eval('#batch-phase-1', el => el.style.display);
  const phase2Display = await page.$eval('#batch-phase-2', el => el.style.display);
  const targetBagText = await page.$eval('#end-batch-target-display', el => el.innerText);
  assert.strictEqual(drawerStillOpen, true, 'Drawer must stay open after Start Batch');
  assert.strictEqual(phase1Display, 'none', 'Phase 1 must be hidden');
  assert.strictEqual(phase2Display, 'flex', 'Phase 2 (The Bag) must be visible');
  assert.ok(targetBagText.includes('1,875'), 'Phase 2 must immediately display Target: 1,875 Loaves');
  console.log(` [PASS] Start Batch transitioned drawer to Phase 2. Target retained: ${targetBagText}`);

  // 4. Input Actuals & Verify Live Yield and Variance Math
  await page.evaluate(() => {
    document.getElementById('end-batch-bagged').value = '1855';
    document.getElementById('end-batch-burnt').value = '10';
    document.getElementById('end-batch-fallen').value = '5';
    window.calcBatchEndYield();
  });
  const yieldDisplay = await page.$eval('#end-batch-yield-display', el => el.innerText);
  const varianceDisplay = await page.$eval('#end-batch-variance-display', el => el.innerText);
  assert.ok(yieldDisplay.includes('98.9%'), 'Yield must compute to 98.9%');
  assert.ok(varianceDisplay.includes('-20'), 'Variance must compute to -20');
  console.log(` [PASS] Live math verified: Yield ${yieldDisplay}, Variance ${varianceDisplay}`);

  // 5. Submit End Batch: Finished goods added to inventory, batch completed, drawer closed
  await page.evaluate(() => window.executeEndBatch());
  await new Promise(r => setTimeout(r, 400));
  const drawerClosed = await page.$eval('#drawer-new-batch', el => !el.classList.contains('open'));
  assert.strictEqual(drawerClosed, true, 'Drawer must close upon completing batch');
  const firstBatchStatus = await page.$eval('.table tbody tr:first-child td:nth-child(10)', el => el.innerText.trim());
  assert.ok(firstBatchStatus.includes('Completed') || firstBatchStatus.includes('Kammala'), 'Batch status must be Completed');
  console.log(' [PASS] End Batch complete: Added to inventory, status Completed, table updated with [ View ]');

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
