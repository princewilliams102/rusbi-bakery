/**
 * Rusbi Bakery OS — Specialized Northern Nigerian Bakery Operations Module
 * Built strictly according to the Three UX Laws:
 *   Law 1: The 1–2 Word Rule (Sidebar)
 *   Law 2: Strict Language Isolation (100% English OR 100% Hausa, zero mixing)
 *   Law 3: Zero Over-explanation (No subtitles, no explanatory text, high-density Control Room UI)
 */

export let currentLang = (typeof localStorage !== 'undefined' ? localStorage.getItem('rusbi_lang') : null) || 'en';

export const TRANSLATIONS = {
  en: {
    // Sidebar (Law 1: 1-2 words only)
    "nav_dashboard": "Dashboard",
    "sec_operations": "Operations",
    "nav_pos": "Sales",
    "nav_batches": "Production",
    "nav_crates": "Crates",
    "nav_bashi": "Credit",
    "nav_shifts": "Cashier",
    "nav_energy": "Energy",
    "nav_inventory": "Inventory",
    "nav_institutional": "Contracts",
    "sec_system": "System",
    "nav_staff": "Staff",
    "nav_devices": "Devices",
    "nav_nolies": "Audit",
    "nav_settings": "Settings",
    "sec_accounting": "Accounting",
    "nav_invoices": "Invoices",
    "nav_expenses": "Expenses",
    "nav_suppliers": "Suppliers",
    "nav_banking": "Banking",
    "nav_accounts": "Accounts",
    "nav_reports": "Reports",
    "nav_close_books": "Close Books",
    "nav_install_app": "Install App",

    // Dashboard Header & Buttons
    "dash_title": "Rusbi Bakery",
    "btn_pos": "POS",
    "btn_batch": "Batch",
    "btn_crates": "Crates",
    "btn_credit": "Credit",
    "btn_close_shift": "Close Shift",
    "btn_audit": "Audit",
    "btn_back": "Back",
    "btn_details": "Details",
    "btn_log": "Log",
    "btn_print": "Print",
    "btn_pay": "Pay Credit",
    "btn_return": "Return Crates",
    "btn_checkout": "Complete Sale",
    "btn_new_delivery": "New Delivery",

    // Dashboard KPI Cards
    "kpi_production": "Production",
    "kpi_production_unit": "Loaves",
    "kpi_production_sub": "25 Bags | Deficit: 48",
    "kpi_till": "Till Cash",
    "kpi_till_sub": "Vault: ₦1.85M",
    "kpi_credit": "Distributor Credit",
    "kpi_credit_sub": "Overdue: ₦180,000",
    "kpi_crates": "Crates",
    "kpi_crates_sub": "Exposure: ₦2.52M",
    "kpi_energy": "Cost / Loaf",
    "kpi_energy_sub": "Grid: 2.5h | Gen: 6.5h",

    // Table Headers
    "tbl_production": "Production",
    "tbl_credit": "Credit",
    "tbl_crates": "Crates",
    "tbl_energy": "Energy",
    "col_batch": "Batch",
    "col_shift": "Shift",
    "col_recipe": "Recipe",
    "col_bags": "Bags",
    "col_target": "Target",
    "col_bagged": "Bagged",
    "col_loss": "Loss",
    "col_yield": "Yield",
    "col_baker": "Baker",
    "col_distributor": "Distributor",
    "col_allocation": "Allocation",
    "col_balance": "Balance",
    "col_guarantor": "Guarantor",
    "col_status": "Status",
    "col_taken": "Taken",
    "col_returned": "Returned",
    "col_deficit": "Deficit",
    "col_deposit": "Deposit",
    "status_current": "Current",
    "status_overdue": "Overdue",

    // Modal & Actions
    "close_shift_title": "Count Cash",
    "count_cash_label": "Count Cash (₦)",
    "safe_drop_title": "Safe Drop",
    "log_diesel_title": "Log Fuel",
    "btn_save": "Save",
    "btn_cancel": "Cancel",
    "balanced": "Balanced",
    "shortage": "Short",
    "overage": "Over"
  },
  ha: {
    // Sidebar (Law 1: 1-2 words only)
    "nav_dashboard": "Teburi",
    "sec_operations": "Ayyuka",
    "nav_pos": "Sayarwa",
    "nav_batches": "Yini",
    "nav_crates": "Kwano",
    "nav_bashi": "Bashi",
    "nav_shifts": "Kudi",
    "nav_energy": "Man Fetur",
    "nav_inventory": "Kayan Kaya",
    "nav_institutional": "Kwangila",
    "sec_system": "Tsari",
    "nav_staff": "Ma'aikata",
    "nav_devices": "Na'urori",
    "nav_nolies": "Bincike",
    "nav_settings": "Saiti",
    "sec_accounting": "Lissafi",
    "nav_invoices": "Rasitai",
    "nav_expenses": "Kudin Kashewa",
    "nav_suppliers": "Yan Sari",
    "nav_banking": "Banki",
    "nav_accounts": "Asusun Kudi",
    "nav_reports": "Rahotanni",
    "nav_close_books": "Rufe Littafi",
    "nav_install_app": "Sanya Ka'ida",

    // Dashboard Header & Buttons
    "dash_title": "Ayyukan Rusbi Bakery",
    "btn_pos": "Sayarwa",
    "btn_batch": "Yini",
    "btn_crates": "Kwano",
    "btn_credit": "Bashi",
    "btn_close_shift": "Rufe Kudi",
    "btn_audit": "Bincike",
    "btn_back": "Koma",
    "btn_details": "Bayanai",
    "btn_log": "Rikodi",
    "btn_print": "Buga",
    "btn_pay": "Biya Bashi",
    "btn_return": "Mayar da Kwano",
    "btn_checkout": "Tabbatar da Sayarwa",
    "btn_new_delivery": "Sabuwar Rasiti",

    // Dashboard KPI Cards
    "kpi_production": "Yini",
    "kpi_production_unit": "Gurasar",
    "kpi_production_sub": "Buhu 25 | Ragewa: 48",
    "kpi_till": "Kudi a Akwati",
    "kpi_till_sub": "Asusu: ₦1.85M",
    "kpi_credit": "Takardar Masu Bashi",
    "kpi_credit_sub": "Ragewa: ₦180,000",
    "kpi_crates": "Kayan Saka Burodi",
    "kpi_crates_sub": "Kudin Ajiya: ₦2.52M",
    "kpi_energy": "Kudin Gurasa",
    "kpi_energy_sub": "NEPA: 2.5h | Inji: 6.5h",

    // Table Headers
    "tbl_production": "Yini",
    "tbl_credit": "Bashi",
    "tbl_crates": "Kwano",
    "tbl_energy": "Man Fetur",
    "col_batch": "Lamba",
    "col_shift": "Lokaci",
    "col_recipe": "Hadi",
    "col_bags": "Buhu",
    "col_target": "Kiyasi",
    "col_bagged": "Gurasar",
    "col_loss": "Rasa",
    "col_yield": "Kashi",
    "col_baker": "Mai Toya",
    "col_distributor": "Mai Sari",
    "col_allocation": "Rabo",
    "col_balance": "Bashi",
    "col_guarantor": "Amana",
    "col_status": "Hali",
    "col_taken": "Dauka",
    "col_returned": "Mayarwa",
    "col_deficit": "Ragewa",
    "col_deposit": "Kudin Ajiya",
    "status_current": "Lafiya",
    "status_overdue": "Ragewa",

    // Modal & Actions
    "close_shift_title": "Kirga Kudi",
    "count_cash_label": "Kirga Kudi (₦)",
    "safe_drop_title": "Ajiye a Safe",
    "log_diesel_title": "Zuba Fetur",
    "btn_save": "Ajiye",
    "btn_cancel": "Soke",
    "balanced": "Daidai",
    "shortage": "Rasa",
    "overage": "Kari"
  }
};

export function t(key, fallback = '') {
  const langTable = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
  if (langTable && langTable[key]) return langTable[key];
  if (TRANSLATIONS['en'][key]) return TRANSLATIONS['en'][key];
  return fallback || key;
}

export function applyLanguage() {
  if (typeof document === 'undefined') return;
  const isHa = currentLang === 'ha';
  const flagEl = document.getElementById('lang-flag');
  const textEl = document.getElementById('lang-text');
  if (flagEl) flagEl.innerText = '🌐';
  if (textEl) textEl.innerText = isHa ? 'HA' : 'EN';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    const val = t(k);
    if (val) el.innerText = val;
  });
}

export function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ha' : 'en';
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('rusbi_lang', currentLang);
  }
  applyLanguage();
  if (typeof window !== 'undefined' && typeof window.renderCurrentView === 'function') {
    window.renderCurrentView();
  }
  if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
    window.showToast(currentLang === 'ha' ? 'Harshe: Hausa' : 'Language: English');
  }
}

if (typeof window !== 'undefined') {
  window.toggleLanguage = toggleLanguage;
  window.applyLanguage = applyLanguage;
}

// Helpers to sanitize persona & guarantor names based on active language
function formatRole(role, isHa) {
  if (!role) return '';
  if (isHa) {
    if (role.toLowerCase().includes('mai shayi') || role.toLowerCase().includes('tea')) return 'Mai Shayi';
    if (role.toLowerCase().includes('mai sari') || role.toLowerCase().includes('wholesale')) return 'Mai Sari';
    if (role.toLowerCase().includes('institutional')) return 'Kwangila';
    return role;
  }
  // English: strictly clean English
  if (role.toLowerCase().includes('tea')) return 'Tea Vendor';
  if (role.toLowerCase().includes('institutional') || role.toLowerCase().includes('mess')) return 'Institutional';
  return 'Wholesale Depot';
}

function formatGuarantor(name, isHa) {
  if (!name) return '';
  const clean = name.replace(/\s*\([^)]*\)/g, '').trim();
  return isHa ? `${clean} (Amana)` : clean;
}

function formatStatus(overdueDays, isHa) {
  if (overdueDays > 0) {
    return isHa ? `Ragewa (${overdueDays}d)` : `Overdue (${overdueDays}d)`;
  }
  return isHa ? 'Lafiya' : 'Current';
}

// ----------------------------------------------------
// 1. MASTER COMMERCIAL PLANT DASHBOARD (LAW 3: CONTROL ROOM)
// ----------------------------------------------------
export function renderBakeryMasterDashboard(container, state, engine) {
  const isHa = currentLang === 'ha';
  const entity = state.entities[0] || {};
  const batches = entity.flourBatches || [];
  const bashiList = entity.bashiDistributors || [];
  const crates = entity.cratesSummary || { totalOwned: 1200, inYard: 750, inTransit: 450, unreturnedDeficit: 42, refundableDepositsHeld: 168000, holders: [] };
  const energy = entity.energyStats || { generatorRunHours: 6.5, dieselLitresConsumed: 45, totalEnergyCostToday: 51480, energyCostPerLoaf: 16.76 };
  const shift = entity.cashShift || { expectedInDrawer: 420000, safeVaultReserves: 1850000 };

  const totalBashiDebt = bashiList.reduce((sum, b) => sum + (b.balanceOwing || 0), 0);
  const totalBagsMixedToday = batches.reduce((sum, b) => sum + (b.flourBags50kg || 0), 0) || 25;
  const totalLoavesBaggedToday = batches.reduce((sum, b) => sum + (b.actualLoaves || 0), 0) || 3072;
  const totalLoss = batches.reduce((sum, b) => sum + (b.burntLoaves || 0) + (b.fallenLoaves || 0), 0) || 48;

  container.innerHTML = `
    <!-- Top Header: Ruthlessly Minimized, ZERO Subtext -->
    <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 850; margin: 0; letter-spacing: -0.02em;">
          ${t('dash_title')}
        </h1>
      </div>

      <div style="display: flex; gap: 8px;">
        <button class="btn btn--ink" onclick="window.navigateTo('pos')" style="font-weight: 800; background: var(--rusbi-green); border-color: var(--rusbi-green);">
          + ${isHa ? 'Sayarwa' : 'New Sale'}
        </button>
      </div>
    </div>

    <!-- 5 Hero Operational KPI Cards (Zero Over-explanation) -->
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-bottom: 22px;">
      
      <!-- Card 1: Production -->
      <div class="card" style="border-left: 4px solid var(--rusbi-green);">
        <div class="card__head">
          <span class="card__title" style="font-size: 13px; font-weight: 800;">${t('kpi_production')}</span>
          <span class="badge badge--pine">98.3%</span>
        </div>
        <div class="stat__value" style="font-size: 24px; color: var(--text); font-weight: 900;">
          ${totalLoavesBaggedToday.toLocaleString()} <span style="font-size: 13px; font-weight: 600; color: var(--muted);">${t('kpi_production_unit')}</span>
        </div>
        <div class="card__sub" style="font-size: 12px; margin-top: 4px; font-weight: 700;">
          ${isHa ? `Buhu ${totalBagsMixedToday} | Ragewa: ${totalLoss}` : `${totalBagsMixedToday} Bags | Deficit: ${totalLoss}`}
        </div>
      </div>

      <!-- Card 2: Till Cash -->
      <div class="card" style="border-left: 4px solid #2563eb;">
        <div class="card__head">
          <span class="card__title" style="font-size: 13px; font-weight: 800;">${t('kpi_till')}</span>
          <span class="badge badge--pine">Active</span>
        </div>
        <div class="stat__value" style="font-size: 24px; color: #2563eb; font-weight: 900;">
          ₦${shift.expectedInDrawer.toLocaleString()}
        </div>
        <div class="card__sub" style="font-size: 12px; margin-top: 4px; font-weight: 700;">
          ${isHa ? `Asusu: ₦${(shift.safeVaultReserves / 1000000).toFixed(2)}M` : `Vault: ₦${(shift.safeVaultReserves / 1000000).toFixed(2)}M`}
        </div>
        <button type="button" class="btn btn--sm btn--ink" onclick="window.openCloseShiftModal()" style="margin-top: 8px; width: 100%; justify-content: center; background: #2563eb; border-color: #2563eb; font-weight: 700;">
          ${t('btn_close_shift')}
        </button>
      </div>

      <!-- Card 3: Credit / Distributor Credit -->
      <div class="card" style="border-left: 4px solid #d97706;">
        <div class="card__head">
          <span class="card__title" style="font-size: 13px; font-weight: 800;">${t('kpi_credit')}</span>
          <span class="badge badge--butter">${bashiList.length}</span>
        </div>
        <div class="stat__value" style="font-size: 24px; color: #d97706; font-weight: 900;">
          ₦${totalBashiDebt.toLocaleString()}
        </div>
        <div class="card__sub" style="font-size: 12px; margin-top: 4px; font-weight: 700;">
          ${t('kpi_credit_sub')}
        </div>
      </div>

      <!-- Card 4: Crates -->
      <div class="card" style="border-left: 4px solid #8b5cf6;">
        <div class="card__head">
          <span class="card__title" style="font-size: 13px; font-weight: 800;">${t('kpi_crates')}</span>
          <span class="badge badge--butter">${crates.inTransit} Field</span>
        </div>
        <div class="stat__value" style="font-size: 24px; color: #8b5cf6; font-weight: 900;">
          ${crates.unreturnedDeficit} ${t('col_deficit')}
        </div>
        <div class="card__sub" style="font-size: 12px; margin-top: 4px; font-weight: 700;">
          ${t('kpi_crates_sub')}
        </div>
      </div>

      <!-- Card 5: Cost / Loaf (Energy) -->
      <div class="card" style="border-left: 4px solid #ef4444;">
        <div class="card__head">
          <span class="card__title" style="font-size: 13px; font-weight: 800;">${t('kpi_energy')}</span>
          <span class="badge badge--pine">Lister 60kVA</span>
        </div>
        <div class="stat__value" style="font-size: 24px; color: var(--text); font-weight: 900;">
          ₦${energy.energyCostPerLoaf.toFixed(2)}
        </div>
        <div class="card__sub" style="font-size: 12px; margin-top: 4px; font-weight: 700;">
          ${t('kpi_energy_sub')}
        </div>
      </div>
    </div>

    <!-- Main Two-Column Layout (Zero Subtitles / Direct Data Grids) -->
    <div class="grid" style="grid-template-columns: 1.25fr 1fr; gap: 18px; margin-bottom: 20px;">
      
      <!-- Left: Production Batches -->
      <div class="card">
        <div class="card__head" style="margin-bottom: 12px;">
          <b style="font-size: 15px;">${t('tbl_production')}</b>
          <button class="btn btn--sm btn--ghost" onclick="window.navigateTo('batches')">${t('btn_details')}</button>
        </div>

        <div class="table-wrap">
          <table class="table" style="font-size: 12.5px;">
            <thead>
              <tr>
                <th>${t('col_batch')}</th>
                <th>${t('col_bags')}</th>
                <th>${t('col_target')}</th>
                <th>${t('col_bagged')}</th>
                <th>${t('col_loss')}</th>
                <th>${t('col_yield')}</th>
                <th>${t('col_baker')}</th>
              </tr>
            </thead>
            <tbody>
              ${batches.map(b => `
                <tr>
                  <td><b>${b.id.split('-').slice(-2).join('-')}</b></td>
                  <td><b>${b.flourBags50kg}</b></td>
                  <td class="num">${b.targetLoaves}</td>
                  <td class="num font-bold" style="color: var(--rusbi-green);">${b.actualLoaves}</td>
                  <td style="color: var(--bad); font-weight: 700;">-${b.burntLoaves + b.fallenLoaves}</td>
                  <td>
                    <span class="badge ${Math.abs(b.variancePct) <= 2 ? 'badge--pine' : 'badge--tomato'}">
                      ${(100 + b.variancePct).toFixed(1)}%
                    </span>
                  </td>
                  <td>${b.chiefBaker.split(' ')[0]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right: Distributor Credit Table -->
      <div class="card">
        <div class="card__head" style="margin-bottom: 12px;">
          <b style="font-size: 15px;">${t('tbl_credit')}</b>
          <button class="btn btn--sm btn--ghost" onclick="window.navigateTo('bashi')">${t('btn_details')}</button>
        </div>

        <div class="table-wrap">
          <table class="table" style="font-size: 12.5px;">
            <thead>
              <tr>
                <th>${t('col_distributor')}</th>
                <th>${t('col_allocation')}</th>
                <th class="r">${t('col_balance')}</th>
                <th>${t('col_guarantor')}</th>
                <th>${t('col_status')}</th>
              </tr>
            </thead>
            <tbody>
              ${bashiList.slice(0, 4).map(d => `
                <tr>
                  <td>
                    <b>${d.name}</b>
                    <div style="font-size: 11px; color: var(--muted);">${formatRole(d.role, isHa)}</div>
                  </td>
                  <td>${d.dailyAllocation}</td>
                  <td class="r num font-bold" style="color: #d97706;">₦${d.balanceOwing.toLocaleString()}</td>
                  <td style="font-size: 11px;">
                    <div>${formatGuarantor(d.guarantor, isHa)}</div>
                    <span style="color: var(--rusbi-green);">${d.guarantorPhone}</span>
                  </td>
                  <td>
                    <span class="badge ${d.overdueDays > 7 ? 'badge--tomato' : (d.overdueDays > 0 ? 'badge--butter' : 'badge--pine')}">
                      ${formatStatus(d.overdueDays, isHa)}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bottom Two-Column: Crates Movement & Energy Tracking -->
    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 18px;">
      
      <!-- Crates Tracking Card -->
      <div class="card">
        <div class="card__head" style="margin-bottom: 12px;">
          <b style="font-size: 15px;">${t('tbl_crates')}</b>
          <button class="btn btn--sm btn--ghost" onclick="window.navigateTo('crates')">${t('btn_details')}</button>
        </div>

        <div class="table-wrap">
          <table class="table" style="font-size: 12.5px;">
            <thead>
              <tr>
                <th>${t('col_distributor')}</th>
                <th>${t('col_taken')}</th>
                <th>${t('col_returned')}</th>
                <th class="r">${t('col_deficit')}</th>
                <th class="r">${t('col_deposit')}</th>
              </tr>
            </thead>
            <tbody>
              ${crates.holders.map(h => `
                <tr>
                  <td><b>${h.distributor.split('(')[0].trim()}</b></td>
                  <td>${h.cratesTaken}</td>
                  <td>${h.cratesReturned}</td>
                  <td class="r num font-bold" style="color: var(--bad);">${h.deficit}</td>
                  <td class="r num font-bold" style="color: var(--rusbi-green);">₦${h.depositHeld.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Energy Tracking Card -->
      <div class="card">
        <div class="card__head" style="margin-bottom: 12px;">
          <b style="font-size: 15px;">${t('tbl_energy')}</b>
          <button class="btn btn--sm btn--ghost" onclick="window.navigateTo('energy')">${t('btn_log')}</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
            <span>${isHa ? 'Inji:' : 'Generator:'}</span>
            <b>6.5h Run</b>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
            <span>${isHa ? 'Dizal:' : 'Diesel Fuel:'}</span>
            <b>45L (₦${energy.totalDieselCost.toLocaleString()})</b>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
            <span>${isHa ? 'NEPA:' : 'Grid Power:'}</span>
            <b>${energy.gridPowerHours}h (₦${energy.totalGridCost.toLocaleString()})</b>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px; background: rgba(0, 166, 81, 0.08); border: 1px solid rgba(0, 166, 81, 0.25); border-radius: 8px;">
            <b style="color: var(--rusbi-green);">${t('kpi_energy')}:</b>
            <b style="color: var(--rusbi-green); font-size: 16px;">₦${energy.energyCostPerLoaf.toFixed(2)}</b>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 2. BAKERY POS / SPLIT PAYMENT CHECKOUT VIEW
// ----------------------------------------------------
export function renderPosView(container, state, engine) {
  const isHa = currentLang === 'ha';
  const entity = state.entities[0] || {};
  const bashiList = entity.bashiDistributors || [];
  const registeredCusts = entity.customers || [];
  const products = (entity.inventory || []).filter(i => i.type === 'product');

  // Aggregate all registered customers & distributors without duplicates
  const seenIds = new Set();
  const allCustomers = [];
  [...bashiList, ...registeredCusts].forEach(c => {
    if (c && c.name && !seenIds.has(c.id || c.name)) {
      seenIds.add(c.id || c.name);
      allCustomers.push(c);
    }
  });

  container.innerHTML = `
    <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
      <h1 style="font-size: 22px; font-weight: 850; margin: 0;">${isHa ? 'Sayarwa' : 'Sales'}</h1>
      <button class="btn btn--ghost" onclick="window.navigateTo('dashboard')">← ${t('btn_back')}</button>
    </div>

    <div class="grid" style="grid-template-columns: 1.3fr 1fr; gap: 20px;">
      
      <!-- Left: Loaf Product Selection -->
      <div class="card">
        <div class="card__head">
          <b style="font-size: 15px;">${isHa ? 'Kayan Gurasa' : 'Products'}</b>
          <span class="badge badge--pine">${isHa ? 'Akwati' : 'Counter'}</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
          ${products.map(p => {
            const unitPrice = Number(p.salesPrice || p.sellingPrice || p.price || 850);
            return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--well);">
              <div>
                <b style="font-size: 14px;">${p.name}</b>
                <div style="font-size: 12px; color: var(--muted);">₦${unitPrice.toLocaleString()}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" id="pos-qty-${p.id}" class="input" min="0" value="0" style="width: 75px; text-align: center; font-weight: 800;" oninput="window.calcPosTotal()">
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Right: Customer Data Capture & Payment Settlement -->
      <div class="card" style="border: 2px solid var(--rusbi-green);">
        <div class="card__head">
          <b style="font-size: 15px;">${isHa ? 'Biya' : 'Payment'}</b>
          <span class="badge badge--pine" id="pos-badge-tender">${isHa ? 'Kudi' : 'Cash'}</span>
        </div>

        <!-- Customer Identification & Data Collection -->
        <div style="background: var(--well); border-radius: 10px; padding: 12px; margin-bottom: 12px; border: 1px solid var(--line);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--muted); letter-spacing: 0.03em;">
              ${isHa ? 'Mai Saye' : 'Customer'}
            </label>
            <button type="button" class="btn btn--sm btn--ghost" id="btn-toggle-new-cust" onclick="window.togglePosNewCustomer()" style="padding: 2px 8px; font-size: 11px; font-weight: 700; color: var(--rusbi-green);">
              + ${isHa ? 'Sabo' : 'New'}
            </button>
          </div>

          <!-- Main Customer Dropdown -->
          <select id="pos-customer" class="input" style="font-weight: 700; margin-bottom: 8px;" onchange="window.handlePosCustomerChange()">
            <option value="walkin" selected>${isHa ? 'Kudin Hannu (Walk-in)' : 'Walk-in'}</option>
            <optgroup label="${isHa ? 'Masu Sari & Kwangila' : 'Distributors & Regulars'}">
              ${allCustomers.map(c => `
                <option value="${c.id}" data-phone="${c.phone || ''}" data-role="${c.role || 'Wholesale'}" data-owing="${c.balanceOwing || c.balance || 0}" data-limit="${c.creditLimit || 0}">
                  ${c.name} (${c.phone ? c.phone.replace('+234', '0') : ''}) — ${isHa ? 'Bashi' : 'Owing'}: ₦${(c.balanceOwing || c.balance || 0).toLocaleString()}
                </option>
              `).join('')}
            </optgroup>
          </select>

          <!-- Walk-in Customer Data Capture (Visible by default for Walk-in) -->
          <div id="pos-walkin-data" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <input type="text" id="pos-walkin-name" class="input input--sm" placeholder="${isHa ? 'Suna (na zabi)' : 'Name (optional)'}" style="font-size: 12.5px; height: 36px;">
            </div>
            <div>
              <input type="tel" id="pos-walkin-phone" class="input input--sm" placeholder="${isHa ? 'Lambar Waya' : 'Phone'}" maxlength="15" style="font-size: 12.5px; height: 36px;">
            </div>
          </div>

          <!-- Registered Customer Details Badge (Visible when registered distributor/buyer is picked) -->
          <div id="pos-registered-info" style="display: none; padding: 8px 10px; background: rgba(0, 166, 81, 0.08); border-radius: 6px; font-size: 12px; border: 1px solid rgba(0, 166, 81, 0.2);">
            <div style="display: flex; justify-content: space-between; font-weight: 700;">
              <span id="pos-cust-role-badge">Wholesale</span>
              <span id="pos-cust-phone-disp" style="color: var(--muted); font-family: monospace;"></span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 3px;">
              <span style="color: var(--muted);">${isHa ? 'Bashi' : 'Owing'}:</span>
              <b id="pos-cust-balance-disp" style="color: #d97706; font-weight: 800;">₦0</b>
            </div>
          </div>

          <!-- Quick Add New Customer Form (Toggled by + New) -->
          <div id="pos-new-cust-form" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--line);">
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 6px;">
              <input type="text" id="pos-new-cust-name" class="input input--sm" placeholder="${isHa ? 'Cikakken Suna' : 'Full Name'}" style="font-size: 12px; height: 34px;">
              <input type="tel" id="pos-new-cust-phone" class="input input--sm" placeholder="${isHa ? 'Waya' : 'Phone'}" style="font-size: 12px; height: 34px;">
            </div>
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 6px;">
              <select id="pos-new-cust-type" class="input input--sm" style="font-size: 11.5px; font-weight: 700; height: 34px;">
                <option value="Wholesale Distributor (Mai Sari)">${isHa ? 'Mai Sari' : 'Wholesale'}</option>
                <option value="Tea Vendor (Mai Shayi)">${isHa ? 'Mai Shayi' : 'Tea Vendor'}</option>
                <option value="Retail Regular">${isHa ? 'Abokin Ciniki' : 'Retail Regular'}</option>
                <option value="Institutional Account">${isHa ? 'Kwangila' : 'Institutional'}</option>
              </select>
              <button type="button" class="btn btn--ink btn--sm" onclick="window.savePosNewCustomer()" style="background: var(--rusbi-green); border-color: var(--rusbi-green); font-weight: 700; justify-content: center; height: 34px;">
                ${isHa ? 'Ajiye' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        <div style="background: var(--well); border-radius: 10px; padding: 14px; text-align: center; margin-bottom: 12px;">
          <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; font-weight: 800;">${isHa ? 'Jimlar Kudi' : 'Total'}</div>
          <div id="pos-total-display" style="font-size: 32px; font-weight: 900; color: var(--rusbi-green);">₦0.00</div>
        </div>

        <!-- Default: Cash Tendered & Change -->
        <div id="pos-cash-container" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 3px;">${isHa ? 'Kudin da aka Bayar' : 'Cash Tendered'}</label>
            <input type="number" id="tender-cash" class="input" placeholder="0.00" style="font-size: 16px; font-weight: 800;" oninput="window.calcCashChange()">
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--well); border-radius: 8px;">
            <span style="font-size: 13px; font-weight: 700;">${isHa ? 'Canji' : 'Change'}</span>
            <b id="pos-change-display" style="font-size: 18px; color: var(--rusbi-green); font-weight: 900;">₦0.00</b>
          </div>
        </div>

        <!-- Split Tender Progressive Toggle -->
        <button type="button" class="btn btn--ghost btn--sm" id="btn-toggle-split" onclick="window.toggleSplitTender()" style="width: 100%; justify-content: center; font-weight: 700; margin-bottom: 12px;">
          ⇄ ${isHa ? 'Rarraba Kudi' : 'Split Tender'}
        </button>

        <!-- Hidden Split Container: Revealed only upon clicking Split Tender -->
        <div id="pos-split-container" style="display: none; flex-direction: column; gap: 10px; margin-bottom: 14px; padding-top: 10px; border-top: 1px dashed var(--line);">
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 11px; font-weight: 700; display: block; margin-bottom: 2px;">POS (₦)</label>
              <input type="number" id="tender-pos" class="input" placeholder="0.00" oninput="window.calcTenderSum()">
            </div>
            <div>
              <label style="font-size: 11px; font-weight: 700; display: block; margin-bottom: 2px;">RRN</label>
              <input type="text" id="pos-terminal-id" class="input" placeholder="RRN">
            </div>
          </div>

          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 11px; font-weight: 700; display: block; margin-bottom: 2px;">${isHa ? 'Tura Banki' : 'Transfer (₦)'}</label>
              <input type="number" id="tender-transfer" class="input" placeholder="0.00" oninput="window.calcTenderSum()">
            </div>
            <div>
              <label style="font-size: 11px; font-weight: 700; display: block; margin-bottom: 2px;">Session</label>
              <input type="text" id="transfer-session-id" class="input" placeholder="Ref">
            </div>
          </div>

          <div>
            <label style="font-size: 11px; font-weight: 700; display: block; margin-bottom: 2px; color: #d97706;">${isHa ? 'Bashi' : 'Credit (₦)'}</label>
            <input type="number" id="tender-bashi" class="input" placeholder="0.00" oninput="window.onBashiInputChanged(this.value)">
          </div>
        </div>

        <button type="button" class="btn btn--ink" onclick="window.submitPosCheckout()" style="width: 100%; height: 46px; font-size: 15px; font-weight: 800; justify-content: center; background: var(--rusbi-green); border-color: var(--rusbi-green);">
          ${t('btn_checkout')}
        </button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 3. FLOUR BATCHES VIEW
// ----------------------------------------------------
export function renderBatchesView(container, state) {
  const isHa = currentLang === 'ha';
  const entity = state.entities[0] || {};
  const batches = entity.flourBatches || [];

  container.innerHTML = `
    <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
      <h1 style="font-size: 22px; font-weight: 850; margin: 0;">${t('tbl_production')}</h1>
      <button class="btn btn--ink" onclick="window.openNewBatchModal()" style="background: var(--rusbi-green); border-color: var(--rusbi-green); font-weight: 700;">
        + ${isHa ? 'Yini' : 'Batch'}
      </button>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>${t('col_batch')}</th>
              <th>${t('col_shift')}</th>
              <th>${t('col_recipe')}</th>
              <th>${t('col_bags')}</th>
              <th>${t('col_target')}</th>
              <th>${t('col_bagged')}</th>
              <th>${isHa ? 'Kone' : 'Burnt'}</th>
              <th>${isHa ? 'Faduwa' : 'Fallen'}</th>
              <th>${t('col_yield')}</th>
              <th>${t('col_baker')}</th>
            </tr>
          </thead>
          <tbody>
            ${batches.map(b => `
              <tr>
                <td><b>${b.id}</b></td>
                <td>${b.shift.split('(')[0].trim()}</td>
                <td><b>${b.recipe.split('&')[0].trim()}</b></td>
                <td><b>${b.flourBags50kg}</b></td>
                <td class="num">${b.targetLoaves}</td>
                <td class="num font-bold" style="color: var(--rusbi-green);">${b.actualLoaves}</td>
                <td class="num" style="color: var(--bad);">${b.burntLoaves}</td>
                <td class="num" style="color: var(--bad);">${b.fallenLoaves}</td>
                <td>
                  <span class="badge ${Math.abs(b.variancePct) <= 2 ? 'badge--pine' : 'badge--tomato'}">
                    ${(100 + b.variancePct).toFixed(1)}%
                  </span>
                </td>
                <td><b>${b.chiefBaker.split(' ')[0]}</b></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 4. CRATE TRACKER VIEW
// ----------------------------------------------------
export function renderCratesView(container, state) {
  const isHa = currentLang === 'ha';
  const entity = state.entities[0] || {};
  const crates = entity.cratesSummary || { totalOwned: 1200, inYard: 750, inTransit: 450, unreturnedDeficit: 42, refundableDepositsHeld: 168000, holders: [] };

  container.innerHTML = `
    <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
      <h1 style="font-size: 22px; font-weight: 850; margin: 0;">${t('tbl_crates')}</h1>
      <button class="btn btn--ink" onclick="window.openCrateMovementModal()" style="background: #8b5cf6; border-color: #8b5cf6; font-weight: 700;">
        + ${isHa ? 'Fita' : 'Issue'}
      </button>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px;">
      <div class="card">
        <div class="card__head"><span class="card__title">${isHa ? 'Kayan Kamfani' : 'Total Owned'}</span></div>
        <div class="stat__value" style="font-size: 24px;">${crates.totalOwned}</div>
      </div>
      <div class="card">
        <div class="card__head"><span class="card__title">${isHa ? 'A Harabar Kamfani' : 'In Yard'}</span></div>
        <div class="stat__value" style="font-size: 24px; color: var(--rusbi-green);">${crates.inYard}</div>
      </div>
      <div class="card">
        <div class="card__head"><span class="card__title">${isHa ? 'A Waje' : 'Field'}</span></div>
        <div class="stat__value" style="font-size: 24px; color: #8b5cf6;">${crates.inTransit}</div>
      </div>
      <div class="card">
        <div class="card__head"><span class="card__title">${t('col_deficit')}</span></div>
        <div class="stat__value" style="font-size: 24px; color: var(--bad);">${crates.unreturnedDeficit}</div>
      </div>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>${t('col_distributor')}</th>
              <th>${t('col_taken')}</th>
              <th>${t('col_returned')}</th>
              <th class="r">${t('col_deficit')}</th>
              <th class="r">${t('col_deposit')}</th>
              <th>${isHa ? 'Aiki' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            ${crates.holders.map(h => `
              <tr>
                <td><b>${h.distributor.split('(')[0].trim()}</b></td>
                <td>${h.cratesTaken}</td>
                <td>${h.cratesReturned}</td>
                <td class="r" style="color: var(--bad); font-weight: 800;">${h.deficit}</td>
                <td class="r" style="color: var(--rusbi-green); font-weight: 800;">₦${h.depositHeld.toLocaleString()}</td>
                <td>
                  <button class="btn btn--sm btn--ghost" onclick="window.recordCrateReturn('${h.distributor}')">${t('btn_return')}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 5. CREDIT / BASHI VIEW
// ----------------------------------------------------
export function renderBashiView(container, state) {
  const isHa = currentLang === 'ha';
  const entity = state.entities[0] || {};
  const bashiList = entity.bashiDistributors || [];
  const totalBashi = bashiList.reduce((sum, b) => sum + (b.balanceOwing || 0), 0);

  container.innerHTML = `
    <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
      <h1 style="font-size: 22px; font-weight: 850; margin: 0;">${t('tbl_credit')}</h1>
      <button class="btn btn--ink" onclick="window.openNewBashiModal()" style="background: #d97706; border-color: #d97706; font-weight: 700;">
        + Bashi
      </button>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 20px;">
      <div class="card">
        <div class="card__head"><span class="card__title">${isHa ? 'Jimlar Bashi' : 'Total Outstanding'}</span></div>
        <div class="stat__value" style="font-size: 24px; color: #d97706; font-weight: 900;">₦${totalBashi.toLocaleString()}</div>
      </div>
      <div class="card">
        <div class="card__head"><span class="card__title">${isHa ? 'Bashi na Kasa (0-7d)' : 'Current (0-7d)'}</span></div>
        <div class="stat__value" style="font-size: 24px;">₦${(totalBashi - 180000).toLocaleString()}</div>
      </div>
      <div class="card">
        <div class="card__head"><span class="card__title">${isHa ? 'Bashi da ya Wuce (>7d)' : 'Overdue (>7d)'}</span></div>
        <div class="stat__value" style="font-size: 24px; color: var(--bad);">₦180,000</div>
      </div>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>${t('col_distributor')}</th>
              <th>${isHa ? 'Matsayi' : 'Role'}</th>
              <th>${isHa ? 'Lambar Waya' : 'Phone'}</th>
              <th>${t('col_allocation')}</th>
              <th class="r">${t('col_balance')}</th>
              <th>${t('col_guarantor')}</th>
              <th>${t('col_status')}</th>
              <th>${isHa ? 'Aiki' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            ${bashiList.map(b => `
              <tr>
                <td><b>${b.name}</b></td>
                <td><span class="spill spill--plain">${formatRole(b.role, isHa)}</span></td>
                <td><b>${b.phone}</b></td>
                <td>${b.dailyAllocation}</td>
                <td class="r num font-bold" style="color: #d97706;">₦${b.balanceOwing.toLocaleString()}</td>
                <td>
                  <div><b>${formatGuarantor(b.guarantor, isHa)}</b></div>
                  <span style="font-size: 11px; color: var(--rusbi-green);">${b.guarantorPhone}</span>
                </td>
                <td>
                  <span class="badge ${b.overdueDays > 7 ? 'badge--tomato' : (b.overdueDays > 0 ? 'badge--butter' : 'badge--pine')}">
                    ${formatStatus(b.overdueDays, isHa)}
                  </span>
                </td>
                <td>
                  <button class="btn btn--sm btn--ink" onclick="window.recordBashiSettlement('${b.id}')" style="padding: 3px 8px; font-size: 11.5px; background: var(--rusbi-green);">
                    ${t('btn_pay')}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 6. CASHIER / SHIFTS VIEW
// ----------------------------------------------------
export function renderShiftsView(container, state) {
  const isHa = currentLang === 'ha';
  const entity = state.entities[0] || {};
  const shift = entity.cashShift || { expectedInDrawer: 420000, safeVaultReserves: 1850000 };

  container.innerHTML = `
    <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: gap: 14px;">
      <h1 style="font-size: 22px; font-weight: 850; margin: 0;">${isHa ? 'Kudi (Cashier)' : 'Cashier'}</h1>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn--ghost" onclick="window.openSafeDropModal()">+ ${isHa ? 'Ajiye a Safe' : 'Safe Drop'}</button>
        <button class="btn btn--ink" onclick="window.openCloseShiftModal()" style="background: #2563eb; border-color: #2563eb;">
          ${t('btn_close_shift')}
        </button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 20px;">
      <div class="card">
        <div class="card__head"><b style="font-size: 15px;">${t('kpi_till')}</b></div>
        <div style="background: var(--well); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; font-weight: 800;">${isHa ? 'Kudi a Akwati' : 'Till Balance'}</div>
          <div style="font-size: 34px; font-weight: 900; color: #2563eb;">₦${shift.expectedInDrawer.toLocaleString()}</div>
        </div>
        <button type="button" class="btn btn--ink" onclick="window.openCloseShiftModal()" style="width: 100%; height: 44px; justify-content: center; background: #2563eb;">
          ${t('btn_close_shift')}
        </button>
      </div>

      <div class="card">
        <div class="card__head"><b style="font-size: 15px;">${isHa ? 'Babban Safe' : 'Safe Vault'}</b></div>
        <div style="background: var(--well); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; font-weight: 800;">${isHa ? 'Asusun Ajiya' : 'Vault Reserves'}</div>
          <div style="font-size: 34px; font-weight: 900; color: var(--rusbi-green);">₦${shift.safeVaultReserves.toLocaleString()}</div>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 7. ENERGY VIEW
// ----------------------------------------------------
export function renderEnergyView(container, state) {
  const isHa = currentLang === 'ha';
  const entity = state.entities[0] || {};
  const energy = entity.energyStats || { generatorRunHours: 6.5, dieselLitresConsumed: 45, totalEnergyCostToday: 51480, energyCostPerLoaf: 16.76 };

  container.innerHTML = `
    <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
      <h1 style="font-size: 22px; font-weight: 850; margin: 0;">${t('tbl_energy')}</h1>
      <button class="btn btn--ink" onclick="window.openLogDieselModal()" style="background: #ef4444; border-color: #ef4444; font-weight: 700;">
        + ${isHa ? 'Zuba Fetur' : 'Log Fuel'}
      </button>
    </div>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 20px;">
      <div class="card">
        <div class="card__head"><b style="font-size: 15px;">Lister 60kVA</b></div>
        <div style="display: flex; flex-direction: column; gap: 10px; padding: 8px 0;">
          <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
            <span>${isHa ? 'Awanni:' : 'Run Time:'}</span>
            <b>6.5 Hours</b>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
            <span>${isHa ? 'Dizal:' : 'Diesel Consumed:'}</span>
            <b>45 Litres (₦49,500)</b>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
            <span>${isHa ? 'Sabis na gaba:' : 'Next Service:'}</span>
            <b style="color: var(--rusbi-green);">78 Hours</b>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__head"><b style="font-size: 15px;">${t('kpi_energy')}</b></div>
        <div style="background: var(--well); border-radius: 12px; padding: 24px; text-align: center;">
          <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; font-weight: 800;">${isHa ? 'Kudin Gurasa' : 'Cost Allocation'}</div>
          <div style="font-size: 36px; font-weight: 900; color: var(--rusbi-green);">₦${energy.energyCostPerLoaf.toFixed(2)}</div>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 8. CONTRACTS / INSTITUTIONAL VIEW
// ----------------------------------------------------
export function renderInstitutionalView(container, state) {
  const isHa = currentLang === 'ha';
  container.innerHTML = `
    <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
      <h1 style="font-size: 22px; font-weight: 850; margin: 0;">${isHa ? 'Kwangila' : 'Contracts'}</h1>
      <button class="btn btn--ink" onclick="window.openNewDeliveryNoteModal()" style="background: var(--rusbi-green); font-weight: 700;">
        + ${isHa ? 'Sabuwar Rasiti' : 'New Delivery'}
      </button>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>${isHa ? 'Wurin Aiki' : 'Institution'}</th>
              <th>${isHa ? 'Sashe' : 'Sector'}</th>
              <th>${t('col_allocation')}</th>
              <th>${t('col_balance')}</th>
              <th>${isHa ? 'Ka\'ida' : 'Terms'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Command Secondary School Kaduna</b></td>
              <td>${isHa ? 'Makarantar Soji' : 'Military School'}</td>
              <td>650</td>
              <td style="color: #d97706; font-weight: 800;">₦3,450,000</td>
              <td><span class="badge badge--butter">Net 90d</span></td>
            </tr>
            <tr>
              <td><b>Federal Medical Centre Staff Mess</b></td>
              <td>${isHa ? 'Asibiti' : 'Hospital'}</td>
              <td>180</td>
              <td style="color: #d97706; font-weight: 800;">₦780,000</td>
              <td><span class="badge badge--butter">Net 30d</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 9. AUDIT / NO-LIES VIEW
// ----------------------------------------------------
export function renderNoLiesSheetView(container, state) {
  const isHa = currentLang === 'ha';
  container.innerHTML = `
    <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
      <h1 style="font-size: 22px; font-weight: 850; margin: 0; color: #b45309;">${t('btn_audit')}</h1>
      <button class="btn btn--ghost" onclick="window.print()">${t('btn_print')}</button>
    </div>

    <div class="card" style="border: 2px solid #b45309;">
      <div class="card__head">
        <b style="font-size: 16px;">${isHa ? 'Binciken Yini — 27 Oct 2026' : 'Plant Audit — 27 Oct 2026'}</b>
        <span class="badge badge--pine">${isHa ? 'Daidai' : 'Balanced'}</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px; padding: 8px 0;">
        <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
          <span>${isHa ? '1. Buhunan Fulawa:' : '1. Flour Bags Mixed:'}</span>
          <b>25 Bags (1,250 kg)</b>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
          <span>${isHa ? '2. Kiyasin Gurasa:' : '2. Target Loaves:'}</span>
          <b>3,125</b>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
          <span>${isHa ? '3. Gurasar da aka toya:' : '3. Actual Loaves Bagged:'}</span>
          <b>3,072 (98.3%)</b>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
          <span>${isHa ? '4. Asarar Toyi:' : '4. Deficit Losses:'}</span>
          <b style="color: var(--bad);">-48</b>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
          <span>${isHa ? '5. Sayarwa:' : '5. Sold & Dispatched:'}</span>
          <b>2,890</b>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
          <span>${isHa ? '6. Sadaqah / Dandana:' : '6. Samples & Sadaqah:'}</span>
          <b>40</b>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 12px; background: var(--well); border-radius: 8px;">
          <span>${isHa ? '7. Kayan Dabbobi (Stale):' : '7. Feed Returns:'}</span>
          <b>35</b>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 12px; background: rgba(0, 166, 81, 0.08); border: 1px solid rgba(0, 166, 81, 0.25); border-radius: 8px;">
          <b style="color: var(--rusbi-green);">${isHa ? '8. Bambanci (Theft/Shortage):' : '8. Unaccounted Variance:'}</b>
          <b style="color: var(--rusbi-green); font-size: 15px;">5 Loaves (0.16%)</b>
        </div>
      </div>
    </div>

    <!-- Audit Logs: Who Did What -->
    <div class="card" style="margin-top: 18px;">
      <div class="card__head">
        <b style="font-size: 16px;">${isHa ? 'Rikodin Ayyuka' : 'Audit Log'}</b>
        <span class="badge badge--pine">${isHa ? 'Ingantacce' : 'Immutable'}</span>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>${isHa ? 'Lokaci' : 'Time'}</th>
              <th>${isHa ? 'Ma\'aikaci' : 'Staff'}</th>
              <th>${isHa ? 'Na\'ura' : 'Terminal'}</th>
              <th>${isHa ? 'Aiki' : 'Action'}</th>
              <th>${isHa ? 'Bayanai' : 'Event Detail'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>14:32</td>
              <td><b>Usman Bello</b></td>
              <td>Tab A9+ #1 (Sales POS)</td>
              <td><span class="badge badge--pine">${isHa ? 'Rufe Kudi' : 'Shift Close'}</span></td>
              <td>${isHa ? 'An kirga ₦420,000 daidai ba tare da bambanci ba' : 'Blind drawer count ₦420,000 matched expected (0 variance)'}</td>
            </tr>
            <tr>
              <td>13:10</td>
              <td><b>John Ameh</b></td>
              <td>Plant PC #2 (Mixing Floor)</td>
              <td><span class="badge badge--pine">${isHa ? 'Toyi' : 'Batch Logged'}</span></td>
              <td>${isHa ? 'Buhuna 25 an toya burodi 3,072' : '25 bags mixed → 3,072 loaves bagged (48 deficit)'}</td>
            </tr>
            <tr>
              <td>11:45</td>
              <td><b>Auwal Sani</b></td>
              <td>Van PWA #1 (Field PWA)</td>
              <td><span class="badge badge--amber">${isHa ? 'Bashi' : 'Credit Issued'}</span></td>
              <td>${isHa ? 'Alhaji Danladi: Burodi 200 (₦240,000)' : 'Alhaji Danladi: 200 Family Loaves (₦240,000)'}</td>
            </tr>
            <tr>
              <td>09:15</td>
              <td><b>Mallam Garba</b></td>
              <td>Plant PC #1 (Loading Dock)</td>
              <td><span class="badge">${isHa ? 'Kwano' : 'Crates Issued'}</span></td>
              <td>${isHa ? 'Kayan saka 45 an fita da su motar Garki' : 'Garki Route van dispatched with 45 crates'}</td>
            </tr>
            <tr>
              <td>08:00</td>
              <td><b>Rusbi Master</b></td>
              <td>GM Office PC</td>
              <td><span class="badge badge--pine">${isHa ? 'Hadawa' : 'Network Sync'}</span></td>
              <td>${isHa ? 'Daidaita bayanan na\'urori 5 na ma\'aikata' : 'Offline SQLite mirror verified across 5 terminals'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 10. DEVICES & OFFLINE PWA TERMINALS VIEW
// ----------------------------------------------------
export function renderDevicesView(container, state) {
  const isHa = currentLang === 'ha';

  container.innerHTML = `
    <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
      <h1 style="font-size: 22px; font-weight: 850; margin: 0;">${isHa ? 'Na\'urori' : 'Devices'}</h1>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn--ghost" onclick="window.pingAllDevices()">
          🔄 ${isHa ? 'Duba Na\'urori' : 'Ping Network'}
        </button>
        <button class="btn btn--ink" onclick="window.pairNewTerminal()" style="background: var(--rusbi-green); border-color: var(--rusbi-green); font-weight: 700;">
          + ${isHa ? 'Hada Na\'ura' : 'Pair Terminal'}
        </button>
      </div>
    </div>

    <!-- System Network Health KPI Cards -->
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px;">
      <div class="card">
        <div class="card__head">
          <span class="card__title">${isHa ? 'Na\'urori Masu Aiki' : 'Active Terminals'}</span>
          <span class="badge badge--pine">4 Online</span>
        </div>
        <div class="stat__value" style="font-size: 24px; color: var(--text);">4 / 4</div>
        <div class="card__sub" style="font-size: 11.5px; margin-top: 4px; font-weight: 700; color: var(--rusbi-green);">
          ${isHa ? 'Dukkan na\'urori na aiki' : '100% Plant Mesh Active'}
        </div>
      </div>

      <div class="card">
        <div class="card__head">
          <span class="card__title">${isHa ? 'Injin Ajiya (Offline)' : 'Offline Engine'}</span>
          <span class="badge badge--pine">Ready</span>
        </div>
        <div class="stat__value" style="font-size: 24px; color: #2563eb;">PWA v6.0</div>
        <div class="card__sub" style="font-size: 11.5px; margin-top: 4px; font-weight: 700;">
          ${isHa ? 'Aiki ba tare da intanet ba' : 'Offline Cache Armored'}
        </div>
      </div>

      <div class="card">
        <div class="card__head">
          <span class="card__title">${isHa ? 'Tushen Bayanai' : 'Local SQLite'}</span>
          <span class="badge badge--pine">Synced</span>
        </div>
        <div class="stat__value" style="font-size: 24px; color: var(--text);">books.sqlite</div>
        <div class="card__sub" style="font-size: 11.5px; margin-top: 4px; font-weight: 700;">
          ${isHa ? 'Lafiyayyen bayani' : 'Integrity Verified'}
        </div>
      </div>

      <div class="card">
        <div class="card__head">
          <span class="card__title">${isHa ? 'Jiran Aikawa' : 'Sync Queue'}</span>
          <span class="badge badge--pine">0 Pending</span>
        </div>
        <div class="stat__value" style="font-size: 24px; color: var(--rusbi-green);">0</div>
        <div class="card__sub" style="font-size: 11.5px; margin-top: 4px; font-weight: 700;">
          ${isHa ? 'Babu tsaiko' : 'Real-time Equilibrium'}
        </div>
      </div>
    </div>

    <!-- Registered Terminals Register -->
    <div class="card" style="margin-bottom: 20px;">
      <div class="card__head" style="margin-bottom: 12px;">
        <b style="font-size: 15px;">${isHa ? 'Teburin Na\'urorin Masana\'anta' : 'Plant Network Terminals'}</b>
      </div>

      <div class="table-wrap">
        <table class="table" style="font-size: 12.5px;">
          <thead>
            <tr>
              <th>${isHa ? 'Na\'ura' : 'Terminal Name'}</th>
              <th>${isHa ? 'Wuri / Matsayi' : 'Station / Purpose'}</th>
              <th>${isHa ? 'Lambar IP / Model' : 'IP & Hardware'}</th>
              <th>${isHa ? 'Tsarukan Aiki' : 'Platform'}</th>
              <th>${isHa ? 'Hali' : 'Status'}</th>
              <th>${isHa ? 'Duba na Karshe' : 'Last Ping'}</th>
              <th>${isHa ? 'Aiki' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>POS Counter Tablet #1</b></td>
              <td>Front Sales Counter</td>
              <td><code>192.168.1.101</code> • Samsung Tab A9+</td>
              <td>Chrome / Android</td>
              <td><span class="badge badge--pine">Online (Live)</span></td>
              <td>Just now</td>
              <td><button class="btn btn--sm btn--ghost" onclick="window.pingDevice('POS-TAB-1')">Ping</button></td>
            </tr>
            <tr>
              <td><b>Van Sales Mobile #1</b></td>
              <td>Alhaji Garba Delivery Run</td>
              <td><code>192.168.1.144</code> • Infinix Hot 40</td>
              <td>PWA Standalone</td>
              <td><span class="badge badge--pine">Online (Live)</span></td>
              <td>2 mins ago</td>
              <td><button class="btn btn--sm btn--ghost" onclick="window.pingDevice('VAN-MOB-1')">Ping</button></td>
            </tr>
            <tr>
              <td><b>Dispatch Bay PC</b></td>
              <td>Loading Dock Crate Gate</td>
              <td><code>192.168.1.50</code> • Dell OptiPlex</td>
              <td>Windows 11 Chrome</td>
              <td><span class="badge badge--pine">Online (Live)</span></td>
              <td>Just now</td>
              <td><button class="btn btn--sm btn--ghost" onclick="window.pingDevice('DOCK-PC')">Ping</button></td>
            </tr>
            <tr>
              <td><b>GM Office Workstation</b></td>
              <td>Executive Control Station</td>
              <td><code>192.168.1.20</code> • HP ProDesk</td>
              <td>Windows 11 Edge</td>
              <td><span class="badge badge--pine">Online (Live)</span></td>
              <td>Just now</td>
              <td><button class="btn btn--sm btn--ghost" onclick="window.pingDevice('GM-PC')">Ping</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
