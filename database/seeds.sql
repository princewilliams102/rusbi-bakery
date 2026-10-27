-- ==============================================================================
-- RUSBI BAKERY OPERATING SYSTEM · SPRINT 0 SEED DATA
-- Mandatory Leaf Chart of Accounts, Permission Matrix & Initial Parties Mapping
-- ==============================================================================

-- 1. Hardened Leaf Chart of Accounts (COA)
INSERT INTO accounts (code, name, type, normal_balance, is_leaf, is_active) VALUES
-- Assets (1xxx)
('1010', 'Cash on Hand (Drawer)', 'asset', 'debit', 1, 1),
('1020', 'Cash in Safe (Vault)', 'asset', 'debit', 1, 1),
('1030', 'Petty Cash Float', 'asset', 'debit', 1, 1),
('1040', 'Operating Checking (Zenith Bank)', 'asset', 'debit', 1, 1),
('1050', 'POS Clearing (Moniepoint/OPay)', 'asset', 'debit', 1, 1),
('1060', 'Wallet Clearing (OPay/PalmPay)', 'asset', 'debit', 1, 1),
('1090', 'POS/Transfer Suspense', 'asset', 'debit', 1, 1),
('1200', 'Accounts Receivable — Trade (Bashi)', 'asset', 'debit', 1, 1),
('1210', 'Accounts Receivable — Institutional', 'asset', 'debit', 1, 1),
('1220', 'Accounts Receivable — Staff IOUs', 'asset', 'debit', 1, 1),
('1300', 'Raw Materials Inventory', 'asset', 'debit', 1, 1),
('1310', 'Work-in-Progress Inventory', 'asset', 'debit', 1, 1),
('1320', 'Finished Goods Inventory', 'asset', 'debit', 1, 1),
('1330', 'Feed Inventory (Salvage Stale Bread)', 'asset', 'debit', 1, 1),
('1340', 'Fuel Inventory (Bulk Diesel/PMS)', 'asset', 'debit', 1, 1),
('1400', 'Crate Deposit Receivable', 'asset', 'debit', 1, 1),
('1500', 'Crates (Owned Physical Assets)', 'asset', 'debit', 1, 1),
('1510', 'Accum. Depreciation — Crates', 'asset', 'credit', 1, 1),
('1600', 'Vehicles & Delivery Vans', 'asset', 'debit', 1, 1),
('1610', 'Accum. Depreciation — Vehicles', 'asset', 'credit', 1, 1),
('1700', 'WHT Receivable (FIRS / State)', 'asset', 'debit', 1, 1),

-- Liabilities (2xxx)
('2010', 'Accounts Payable — Trade', 'liability', 'credit', 1, 1),
('2020', 'Accrued Wages & Payroll', 'liability', 'credit', 1, 1),
('2100', 'Refundable Crate Deposits', 'liability', 'credit', 1, 1),
('2110', 'Institutional & Customer Advances', 'liability', 'credit', 1, 1),
('2200', 'VAT Payable (FIRS 7.5%)', 'liability', 'credit', 1, 1),
('2210', 'WHT Payable', 'liability', 'credit', 1, 1),

-- Equity (3xxx)
('3010', 'Owner Capital Contribution', 'equity', 'credit', 1, 1),
('3020', 'Retained Earnings', 'equity', 'credit', 1, 1),
('3900', 'Opening Balance Equity', 'equity', 'credit', 1, 1),

-- Revenue / Income (4xxx)
('4010', 'Bread Sales', 'revenue', 'credit', 1, 1),
('4020', 'Animal Feed Salvage Sales', 'revenue', 'credit', 1, 1),
('4030', 'Crate Loss Recovery (Forfeitures)', 'revenue', 'credit', 1, 1),
('4090', 'Other Income', 'revenue', 'credit', 1, 1),

-- Expenses (5xxx)
('5010', 'COGS — Flour', 'expense', 'debit', 1, 1),
('5011', 'COGS — Sugar', 'expense', 'debit', 1, 1),
('5012', 'COGS — Margarine & Butter', 'expense', 'debit', 1, 1),
('5013', 'COGS — Yeast & Improvers', 'expense', 'debit', 1, 1),
('5014', 'COGS — Packaging & Nylons', 'expense', 'debit', 1, 1),
('5100', 'Wages — Production Staff', 'expense', 'debit', 1, 1),
('5101', 'Wages — Distribution & Drivers', 'expense', 'debit', 1, 1),
('5102', 'Wages — Admin & Management', 'expense', 'debit', 1, 1),
('5200', 'Energy — Generator Diesel', 'expense', 'debit', 1, 1),
('5201', 'Energy — Grid Electricity (NEPA/Disco)', 'expense', 'debit', 1, 1),
('5202', 'Energy — Gas / Firewood', 'expense', 'debit', 1, 1),
('5203', 'Generator Maintenance & Servicing', 'expense', 'debit', 1, 1),
('5300', 'Fuel — Delivery Vans', 'expense', 'debit', 1, 1),
('5301', 'Vehicle Maintenance & Repairs', 'expense', 'debit', 1, 1),
('5400', 'Yield Loss — Burnt', 'expense', 'debit', 1, 1),
('5401', 'Yield Loss — Fallen Dough', 'expense', 'debit', 1, 1),
('5402', 'Yield Loss — Theft / Unaccounted Shortfall', 'expense', 'debit', 1, 1),
('5410', 'Spoilage Loss (Unsalvaged Waste)', 'expense', 'debit', 1, 1),
('5500', 'Crate Loss Expense', 'expense', 'debit', 1, 1),
('5600', 'Route Loss / Driver Cash Shortage', 'expense', 'debit', 1, 1),
('5610', 'Cash Short / Over Variance', 'expense', 'debit', 1, 1),
('5700', 'Rent & Factory Lease', 'expense', 'debit', 1, 1),
('5710', 'Salaries — Administrative', 'expense', 'debit', 1, 1),
('5720', 'Office & Sundry Operations', 'expense', 'debit', 1, 1),
('5730', 'Professional & Legal Fees', 'expense', 'debit', 1, 1),
('5800', 'Bank Charges & Stamp Duty', 'expense', 'debit', 1, 1),
('5810', 'POS Terminal Merchant Fees', 'expense', 'debit', 1, 1),
('5900', 'Depreciation — Crates & Machinery', 'expense', 'debit', 1, 1);

-- 2. Permission Matrix Registry
INSERT INTO rb_permissions (code, name, category, description) VALUES
('create_sale', 'Create Sales Order', 'sales', 'Record new bread sales and issue delivery slips'),
('void_sale', 'Void / Cancel Sale', 'sales', 'Cancel a posted invoice (Manager only)'),
('verify_tender', 'Verify Bank Transfer / POS', 'cash', 'Confirm bank alert authenticity'),
('override_credit_limit', 'Override Bashi Credit Limit', 'credit', 'Authorize dispatch exceeding customer limit'),
('write_off_debt', 'Write Off Uncollectible Debt', 'credit', 'Write off bad debt to expense'),
('close_shift', 'Close Cash Shift', 'cash', 'Conduct blind physical count and close till'),
('approve_variance', 'Approve Cash / Stock Variance', 'audit', 'Sign off on shift cash discrepancy'),
('adjust_stock', 'Adjust Physical Inventory', 'inventory', 'Perform stock adjustment or write-off'),
('approve_petty_cash', 'Approve Petty Cash Voucher', 'expense', 'Authorize payment above threshold'),
('issue_crate', 'Issue Crates to Customer', 'crates', 'Record crates leaving factory dock'),
('return_crate', 'Record Crate Returns', 'crates', 'Credit returned crates in ledger'),
('view_reports', 'View Management Reports', 'reports', 'Access No-Lies sheet, P&L, and debt registers');

-- Role to Permission Mappings
-- Roles: owner, gm, chief_baker, storekeeper, dispatch, cashier, van_agent
INSERT INTO rb_role_permissions (role, permission_code) VALUES
-- Owner (Full Access)
('owner', 'create_sale'), ('owner', 'void_sale'), ('owner', 'verify_tender'), ('owner', 'override_credit_limit'),
('owner', 'write_off_debt'), ('owner', 'close_shift'), ('owner', 'approve_variance'), ('owner', 'adjust_stock'),
('owner', 'approve_petty_cash'), ('owner', 'issue_crate'), ('owner', 'return_crate'), ('owner', 'view_reports'),

-- General Manager
('gm', 'create_sale'), ('gm', 'void_sale'), ('gm', 'verify_tender'), ('gm', 'override_credit_limit'),
('gm', 'write_off_debt'), ('gm', 'close_shift'), ('gm', 'approve_variance'), ('gm', 'adjust_stock'),
('gm', 'approve_petty_cash'), ('gm', 'issue_crate'), ('gm', 'return_crate'), ('gm', 'view_reports'),

-- Chief Baker
('chief_baker', 'adjust_stock'), ('chief_baker', 'view_reports'),

-- Storekeeper
('storekeeper', 'adjust_stock'), ('storekeeper', 'issue_crate'), ('storekeeper', 'return_crate'),

-- Dispatch Clerk
('dispatch', 'create_sale'), ('dispatch', 'verify_tender'), ('dispatch', 'close_shift'),
('dispatch', 'issue_crate'), ('dispatch', 'return_crate'),

-- Cashier
('cashier', 'create_sale'), ('cashier', 'verify_tender'), ('cashier', 'close_shift'),
('cashier', 'issue_crate'), ('cashier', 'return_crate'),

-- Van Agent
('van_agent', 'create_sale'), ('van_agent', 'close_shift'), ('van_agent', 'issue_crate'), ('van_agent', 'return_crate');

-- 3. Initial Parties Mapping Seed (from baseline Rusbi profiles)
INSERT INTO rb_parties (kind, ref_table, ref_id, display_name, phone, is_active) VALUES
('customer', 'customers', 1, 'MegaMart Supermarkets Ltd (Central Abuja)', '+234 803 234 1100', 1),
('customer', 'customers', 2, 'Grand Royale Hotels & Suites (Maitama)', '+234 802 998 4433', 1),
('customer', 'customers', 3, 'Alhaji Mohammed Ishaq Wholesale (Wuse Market)', '+234 803 555 8899', 1),
('customer', 'customers', 4, 'Oasis Wholesale Depots (Kubwa)', '+234 814 555 7721', 1),
('vendor', 'vendors', 1, 'Flour Mills of Nigeria Plc (Golden Penny)', '+234 1 270 0400', 1),
('vendor', 'vendors', 2, 'Dangote Sugar Refinery Plc', '+234 1 448 0815', 1),
('vendor', 'vendors', 3, 'TotalEnergies Marketing Nigeria Plc (Diesel)', '+234 803 900 1200', 1),
('vendor', 'vendors', 4, 'Polyfilm Packaging Ltd (Loaf Wrappers)', '+234 802 331 9900', 1),
('staff', 'users', 1, 'Alhaji Ibrahim Rusbi (Chairman)', '+234 803 100 0001', 1),
('staff', 'users', 2, 'Tunde Bakare (Bakery GM)', '+234 802 334 5511', 1),
('staff', 'users', 3, 'Khadija Sani (Senior Accountant)', '+234 809 444 8812', 1),
('staff', 'users', 4, 'John Ameh (Head Master Baker)', '+234 814 222 3300', 1),
('staff', 'users', 7, 'Aliyu Danladi (Storekeeper & Warehouse)', '+234 805 119 2201', 1),
('staff', 'users', 8, 'Zainab Bello (Sales & Billing Officer)', '+234 816 777 4432', 1);

-- 4. Party Credit Profiles
INSERT INTO rb_parties_credit (party_id, credit_limit, current_balance, tier, default_due_days, hard_stop, notes) VALUES
(1, 5000000.00, 2150000.00, 'institutional', 30, 0, 'MegaMart Supermarkets contractual supply'),
(2, 3000000.00, 1700000.00, 'institutional', 14, 0, 'Grand Royale Hotels weekly invoice'),
(3, 2000000.00, 0.00, 'distributor', 7, 1, 'Alhaji Ishaq rolling Bashi - guaranteed by association'),
(4, 1500000.00, 1000000.00, 'distributor', 7, 1, 'Oasis Kubwa distribution outlet');

-- 5. Guarantor Link (Amana Model)
INSERT INTO rb_guarantors (party_id, guarantor_name, guarantor_phone, guarantor_address, community_role, id_card_ref) VALUES
(3, 'Alhaji Garba Dan-Kano', '+234 803 777 1122', 'Plot 44, Wholesale Line, Wuse Modern Market, Abuja', 'Chairman, Abuja Bakers & Distributors Association', 'NIN-89102938471');

-- 6. Initial Physical Crate Types
INSERT INTO rb_crates (code, name, capacity_loaves, deposit_fee, replacement_cost, is_active) VALUES
('CRATE-STD-10', 'Standard Plastic Loaf Crate (10 loaves)', 10, 3500.00, 4500.00, 1),
('CRATE-LRG-15', 'Large Heavy-Duty Crate (15 loaves)', 15, 5000.00, 6500.00, 1);

