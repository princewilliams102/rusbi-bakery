/**
 * Rusbi Books - Production Clean Data (Zero Dummy Numbers)
 */

export const INITIAL_DATA = {
  "companyGroup": {
    "name": "Rusbi Group of Companies Ltd.",
    "shortName": "Rusbi Books",
    "hq": "Abuja / Lagos, Nigeria",
    "defaultCurrency": "NGN",
    "currencySymbol": "₦"
  },
  "rolePermissions": {
    "master": {
      "label": "Group Master Executive",
      "description": "Unrestricted access across all subsidiaries, consolidated P&L, system settings, and user access provisioning.",
      "allowedRoutes": [
        "dashboard",
        "inventory",
        "invoices",
        "bills",
        "suppliers",
        "production",
        "staff",
        "banking",
        "accounts",
        "reports",
        "users",
        "close-books",
        "admin"
      ],
      "canSeeSwitcher": true,
      "canViewFinances": true,
      "canViewPayroll": true,
      "canManageUsers": true,
      "canShareAccess": true,
      "isTypeP": false
    },
    "branch_admin": {
      "label": "Branch General Manager",
      "description": "Full management of single assigned branch operations, financials, staff, and user access.",
      "allowedRoutes": [
        "dashboard",
        "inventory",
        "invoices",
        "bills",
        "suppliers",
        "production",
        "staff",
        "banking",
        "accounts",
        "reports",
        "users",
        "close-books",
        "admin"
      ],
      "canSeeSwitcher": false,
      "canViewFinances": true,
      "canViewPayroll": true,
      "canManageUsers": true,
      "canShareAccess": true,
      "isTypeP": false
    },
    "accountant": {
      "label": "Branch Senior Accountant",
      "description": "Full financial authority: general ledger, banking, reconciliation, invoicing, bills, inventory valuation, and closing books. Can invite and share restricted access with production staff.",
      "allowedRoutes": [
        "dashboard",
        "inventory",
        "invoices",
        "bills",
        "suppliers",
        "production",
        "banking",
        "accounts",
        "reports",
        "users",
        "close-books"
      ],
      "canSeeSwitcher": false,
      "canViewFinances": true,
      "canViewPayroll": false,
      "canManageUsers": true,
      "canShareAccess": true,
      "isTypeP": false
    },
    "production_staff": {
      "label": "Type P — Production & Operations Clerk",
      "description": "Restricted entry exclusively for factory/farm logs, ingredient consumption, inventory counts, and batch outputs. Financial data, bank balances, and P&L are STRICTLY HIDDEN.",
      "allowedRoutes": [
        "production",
        "inventory"
      ],
      "canSeeSwitcher": false,
      "canViewFinances": false,
      "canViewPayroll": false,
      "canManageUsers": false,
      "canShareAccess": false,
      "isTypeP": true
    },
    "sales_rep": {
      "label": "Sales & Billing Officer",
      "description": "Can create customer sales invoices, check stock availability, and record payments. Banking, expenses, and General Ledger are HIDDEN.",
      "allowedRoutes": [
        "invoices",
        "inventory"
      ],
      "canSeeSwitcher": false,
      "canViewFinances": false,
      "canViewPayroll": false,
      "canManageUsers": false,
      "canShareAccess": false,
      "isTypeP": false
    },
    "storekeeper": {
      "label": "Storekeeper & Warehouse Clerk",
      "description": "Responsible for logging purchases, raw material intake (KG), stock receipts, and vendor bills. Financial ledgers and banking remain hidden.",
      "allowedRoutes": [
        "inventory",
        "bills",
        "suppliers"
      ],
      "canSeeSwitcher": false,
      "canViewFinances": false,
      "canViewPayroll": false,
      "canManageUsers": false,
      "canShareAccess": false,
      "isTypeP": false
    }
  },
  "users": [
    {
      "id": "usr-1",
      "name": "Rusbi Group (Super Admin)",
      "email": "admin@rusbigroup.com",
      "secondaryEmail": "admin@rusbibooks.systemslib.com",
      "password": "#RusbiGroup2026$$",
      "role": "master",
      "entityId": "all",
      "status": "Active",
      "avatar": "RG",
      "phone": "+234 803 100 0001",
      "lastLogin": "Just now",
      "accessGrantedBy": "System Root",
      "emailAccessSent": true
    },
    {
      "id": "usr-2",
      "name": "Ahmad Rufai",
      "email": "ahmadmaimakani@gmail.com",
      "secondaryEmail": "ahmedbichi@gmail.com",
      "password": "Bakery#Admin2026",
      "role": "branch_admin",
      "entityId": "bakery",
      "status": "Active",
      "avatar": "AR",
      "phone": "+234 802 334 5511",
      "lastLogin": "Just now",
      "accessGrantedBy": "Rusbi Group",
      "emailAccessSent": true
    },
    {
      "id": "usr-3",
      "name": "Muhammad Rufia Bichi",
      "email": "muhammadbichi@gmail.com",
      "secondaryEmail": "muhammad.bichi@gmail.com",
      "password": "Agric#Admin2026",
      "role": "branch_admin",
      "entityId": "agric",
      "status": "Active",
      "avatar": "MB",
      "phone": "+234 803 998 7766",
      "lastLogin": "Just now",
      "accessGrantedBy": "Rusbi Group",
      "emailAccessSent": true
    }
  ],
  "entities": [
    {
      "id": "bakery",
      "name": "Rusbi Bakery",
      "code": "RB",
      "tagline": "Commercial Bread, Pastries & Confectioneries",
      "category": "Food Processing & Bakery",
      "color": "#f58220",
      "icon": "🥐",
      "logoUrl": "./assets/rusbi-icon.png",
      "phone": "+234 802 334 5511",
      "email": "bakery.orders@rusbigroup.ng",
      "website": "https://rusbigroup.ng/bakery",
      "address": "Plot 12, Idu Industrial Area Phase 1, Abuja, FCT",
      "warehouseAddress": "Loading Bay 2, Rusbi Commercial Bakery Plant, Idu",
      "city": "Abuja, FCT",
      "tin": "TIN-24891023-0001",
      "rcNumber": "RC 1849204",
      "vatRate": 7.5,
      "bankWire": "Zenith Bank Plc | 1014523991 | Rusbi Bakery Ltd",
      "bankName": "Zenith Bank Plc",
      "bankAccountName": "Rusbi Bakery Ltd",
      "bankAccountNumber": "1014523991",
      "invoiceTerms": "Payment due within 14 days of invoice date. Please quote Invoice ID on bank transfer.",
      "manager": "Ahmad Rufai",
      "managerEmail": "ahmadmaimakani@gmail.com",
      "capital": 0,
      "closedBooks": {
        "isClosed": false,
        "closedDate": null,
        "password": ""
      },
      "accounts": [
        {
          "code": "1010",
          "name": "Operating Checking (Zenith Bank)",
          "type": "Asset",
          "subType": "Bank",
          "balance": 0
        },
        {
          "code": "1020",
          "name": "Bakery Reserve (Access Bank)",
          "type": "Asset",
          "subType": "Bank",
          "balance": 0
        },
        {
          "code": "1200",
          "name": "Accounts Receivable",
          "type": "Asset",
          "subType": "Accounts Receivable",
          "balance": 0
        },
        {
          "code": "1300",
          "name": "Inventory Asset (Raw Materials & Products)",
          "type": "Asset",
          "subType": "Inventory",
          "balance": 0
        },
        {
          "code": "1500",
          "name": "Industrial Ovens & Mixers",
          "type": "Asset",
          "subType": "Fixed Asset",
          "balance": 0
        },
        {
          "code": "2000",
          "name": "Accounts Payable",
          "type": "Liability",
          "subType": "Accounts Payable",
          "balance": 0
        },
        {
          "code": "2100",
          "name": "Customer Credit Liability (Prepayments)",
          "type": "Liability",
          "subType": "Current Liability",
          "balance": 0
        },
        {
          "code": "2200",
          "name": "Staff Payroll Accrual",
          "type": "Liability",
          "subType": "Current Liability",
          "balance": 0
        },
        {
          "code": "3010",
          "name": "Branch Allocated Capital",
          "type": "Equity",
          "subType": "Equity",
          "balance": 0
        },
        {
          "code": "3020",
          "name": "Retained Earnings",
          "type": "Equity",
          "subType": "Equity",
          "balance": 0
        },
        {
          "code": "4010",
          "name": "Wholesale Bread Distribution",
          "type": "Income",
          "subType": "Operating Revenue",
          "balance": 0
        },
        {
          "code": "4020",
          "name": "Retail Pastries & Cake Orders",
          "type": "Income",
          "subType": "Operating Revenue",
          "balance": 0
        },
        {
          "code": "4030",
          "name": "Shipping & Delivery Income",
          "type": "Income",
          "subType": "Operating Revenue",
          "balance": 0
        },
        {
          "code": "4090",
          "name": "Discounts Given (Contra-Revenue)",
          "type": "Income",
          "subType": "Operating Revenue",
          "balance": 0
        },
        {
          "code": "5010",
          "name": "Flour, Sugar & Raw Baking Ingredients",
          "type": "Expense",
          "subType": "Cost of Goods",
          "balance": 0
        },
        {
          "code": "5015",
          "name": "Inventory Loss & Spoilage Wastage",
          "type": "Expense",
          "subType": "Cost of Goods",
          "balance": 0
        },
        {
          "code": "5020",
          "name": "Bakery Staff Salaries & Allowances",
          "type": "Expense",
          "subType": "Operating Expense",
          "balance": 0
        },
        {
          "code": "5030",
          "name": "Generator Diesel & Power Utilities",
          "type": "Expense",
          "subType": "Operating Expense",
          "balance": 0
        },
        {
          "code": "5040",
          "name": "Delivery Vans Maintenance & Logistics",
          "type": "Expense",
          "subType": "Operating Expense",
          "balance": 0
        }
      ],
      "inventory": [
        {
          "id": "raw-flour",
          "name": "Flour (Golden Penny Special 50kg)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 500,
          "costPrice": 1000,
          "salesPrice": 0,
          "icon": "🌾",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-sugar",
          "name": "Sugar (Dangote Refined 50kg)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 200,
          "costPrice": 1200,
          "salesPrice": 0,
          "icon": "🍚",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-yeast",
          "name": "Yeast (Instant Active Dry)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 30,
          "costPrice": 3500,
          "salesPrice": 0,
          "icon": "🧪",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-salt",
          "name": "Salt (Industrial Fine Grade)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 50,
          "costPrice": 400,
          "salesPrice": 0,
          "icon": "🧂",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-improver",
          "name": "Dough Improver & Conditioner",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 15,
          "costPrice": 4500,
          "salesPrice": 0,
          "icon": "✨",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-softener",
          "name": "Bread Softener & Emulsifier",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 15,
          "costPrice": 4000,
          "salesPrice": 0,
          "icon": "🧈",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-milk",
          "name": "Milk Flavor & Powder Emulsion",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 10,
          "costPrice": 6000,
          "salesPrice": 0,
          "icon": "🥛",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-preservative",
          "name": "Calcium Propionate Preservatives",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 10,
          "costPrice": 5000,
          "salesPrice": 0,
          "icon": "🛡️",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-topper",
          "name": "Bun Topper (Sesame Seeds)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 20,
          "costPrice": 3200,
          "salesPrice": 0,
          "icon": "🌰",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-wrapper",
          "name": "Branded Bread Nylon Wrappers",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "pcs",
          "qtyOnHand": 0,
          "reorderPoint": 5000,
          "costPrice": 15,
          "salesPrice": 0,
          "icon": "📦",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "prod-jumbo",
          "name": "Rusbi Special Jumbo Bread",
          "type": "product",
          "category": "Bread",
          "unit": "loaves",
          "qtyOnHand": 0,
          "reorderPoint": 100,
          "costPrice": 750,
          "salesPrice": 1200,
          "icon": "🍞",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "prod-family",
          "name": "Rusbi Family Size Bread",
          "type": "product",
          "category": "Bread",
          "unit": "loaves",
          "qtyOnHand": 0,
          "reorderPoint": 80,
          "costPrice": 620,
          "salesPrice": 1000,
          "icon": "🍞",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "prod-medium",
          "name": "Rusbi Medium Loaf",
          "type": "product",
          "category": "Bread",
          "unit": "loaves",
          "qtyOnHand": 0,
          "reorderPoint": 60,
          "costPrice": 420,
          "salesPrice": 700,
          "icon": "🥖",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "prod-coconut-med",
          "name": "Rusbi Coconut Medium Bread",
          "type": "product",
          "category": "Bread",
          "unit": "loaves",
          "qtyOnHand": 0,
          "reorderPoint": 50,
          "costPrice": 520,
          "salesPrice": 850,
          "icon": "🥥",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "prod-coconut-jumbo",
          "name": "Rusbi Coconut Jumbo Bread",
          "type": "product",
          "category": "Bread",
          "unit": "loaves",
          "qtyOnHand": 0,
          "reorderPoint": 40,
          "costPrice": 900,
          "salesPrice": 1500,
          "icon": "🥥",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "prod-epic-med",
          "name": "Rusbi Epic Medium Bread",
          "type": "product",
          "category": "Bread",
          "unit": "loaves",
          "qtyOnHand": 0,
          "reorderPoint": 45,
          "costPrice": 440,
          "salesPrice": 750,
          "icon": "🥖",
          "asOfDate": "2026-10-01"
        }
      ],
      "recipes": {
        "prod-jumbo": {
          "name": "Jumbo Bread",
          "ingredients": [
            {
              "id": "raw-flour",
              "name": "Flour",
              "kgPerUnit": 0.5
            },
            {
              "id": "raw-sugar",
              "name": "Sugar",
              "kgPerUnit": 0.08
            },
            {
              "id": "raw-yeast",
              "name": "Yeast",
              "kgPerUnit": 0.012
            },
            {
              "id": "raw-salt",
              "name": "Salt",
              "kgPerUnit": 0.008
            },
            {
              "id": "raw-improver",
              "name": "Improver",
              "kgPerUnit": 0.004
            },
            {
              "id": "raw-softener",
              "name": "Softener",
              "kgPerUnit": 0.004
            },
            {
              "id": "raw-wrapper",
              "name": "Wrapper",
              "kgPerUnit": 1
            }
          ]
        },
        "prod-family": {
          "name": "Family Bread",
          "ingredients": [
            {
              "id": "raw-flour",
              "name": "Flour",
              "kgPerUnit": 0.4
            },
            {
              "id": "raw-sugar",
              "name": "Sugar",
              "kgPerUnit": 0.06
            },
            {
              "id": "raw-yeast",
              "name": "Yeast",
              "kgPerUnit": 0.01
            },
            {
              "id": "raw-salt",
              "name": "Salt",
              "kgPerUnit": 0.006
            },
            {
              "id": "raw-improver",
              "name": "Improver",
              "kgPerUnit": 0.003
            },
            {
              "id": "raw-wrapper",
              "name": "Wrapper",
              "kgPerUnit": 1
            }
          ]
        },
        "prod-medium": {
          "name": "Medium Bread",
          "ingredients": [
            {
              "id": "raw-flour",
              "name": "Flour",
              "kgPerUnit": 0.3
            },
            {
              "id": "raw-sugar",
              "name": "Sugar",
              "kgPerUnit": 0.045
            },
            {
              "id": "raw-yeast",
              "name": "Yeast",
              "kgPerUnit": 0.008
            },
            {
              "id": "raw-salt",
              "name": "Salt",
              "kgPerUnit": 0.005
            },
            {
              "id": "raw-wrapper",
              "name": "Wrapper",
              "kgPerUnit": 1
            }
          ]
        },
        "prod-coconut-med": {
          "name": "Coconut Medium Bread",
          "ingredients": [
            {
              "id": "raw-flour",
              "name": "Flour",
              "kgPerUnit": 0.35
            },
            {
              "id": "raw-sugar",
              "name": "Sugar",
              "kgPerUnit": 0.06
            },
            {
              "id": "raw-milk",
              "name": "Milk & Flavor",
              "kgPerUnit": 0.02
            },
            {
              "id": "raw-yeast",
              "name": "Yeast",
              "kgPerUnit": 0.009
            },
            {
              "id": "raw-wrapper",
              "name": "Wrapper",
              "kgPerUnit": 1
            }
          ]
        },
        "prod-epic-med": {
          "name": "Epic Medium Bread",
          "ingredients": [
            {
              "id": "raw-flour",
              "name": "Flour",
              "kgPerUnit": 0.36
            },
            {
              "id": "raw-sugar",
              "name": "Sugar",
              "kgPerUnit": 0.055
            },
            {
              "id": "raw-yeast",
              "name": "Yeast",
              "kgPerUnit": 0.008
            },
            {
              "id": "raw-salt",
              "name": "Salt",
              "kgPerUnit": 0.005
            },
            {
              "id": "raw-improver",
              "name": "Improver",
              "kgPerUnit": 0.004
            },
            {
              "id": "raw-wrapper",
              "name": "Wrapper",
              "kgPerUnit": 1
            }
          ]
        }
      },
      "customers": [
        {
          "id": "cust-b1",
          "name": "MegaMart Supermarkets Ltd",
          "displayName": "MegaMart Supermarket",
          "representative": "Abdullahi Umar",
          "email": "procurement@megamart.ng",
          "phone": "+234 803 234 1100",
          "billingAddress": "Plot 14 Commercial District, Abuja",
          "shippingAddress": "MegaMart Logistics Hub, Garki 2, Abuja",
          "balance": 0,
          "creditLiability": 0
        },
        {
          "id": "cust-b2",
          "name": "Grand Royale Hotels & Suites",
          "displayName": "Grand Royale Hotel",
          "representative": "Chef Emmanuel Okon",
          "email": "kitchen@grandroyale.com",
          "phone": "+234 802 998 4433",
          "billingAddress": "12 Constitution Ave, Central Area, Abuja",
          "shippingAddress": "Kitchen Receiving Bay, Grand Royale Hotel",
          "balance": 0,
          "creditLiability": 0
        },
        {
          "id": "cust-b3",
          "name": "Mohammed Ishaq",
          "displayName": "Mohammed Ishaq Wholesale",
          "representative": "Alhaji Mohammed Ishaq",
          "email": "m.ishaq@tradehub.ng",
          "phone": "+234 814 555 7721",
          "billingAddress": "Shop 45, Wuse Main Market, Abuja",
          "shippingAddress": "Warehouse 12, Idu Industrial Yard",
          "balance": 0,
          "creditLiability": 0
        }
      ],
      "vendors": [
        {
          "id": "vend-b1",
          "name": "Flour Mills of Nigeria Plc",
          "displayName": "Golden Penny Flour Mills",
          "category": "Raw Ingredients",
          "representative": "Engr. Babatunde Lawal",
          "email": "sales@fmnplc.com",
          "phone": "+234 802 334 5500",
          "address": "Wharf Road, Apapa Industrial Area, Lagos",
          "balance": 0,
          "creditAvailable": 0
        },
        {
          "id": "vend-b2",
          "name": "Dangote Sugar Refinery Plc",
          "displayName": "Dangote Sugar",
          "category": "Sugar & Sweeteners",
          "representative": "Hajia Fatima Dangote",
          "email": "orders@dangotesugar.com",
          "phone": "+234 803 445 6611",
          "address": "Shed 20, NPA Terminal, Apapa, Lagos",
          "balance": 0,
          "creditAvailable": 0
        },
        {
          "id": "vend-b3",
          "name": "TotalEnergies Marketing Nig Plc",
          "displayName": "TotalEnergies Diesel Depot",
          "category": "Power & Fuel",
          "representative": "Sunday Adeleke",
          "email": "energy@total.ng",
          "phone": "+234 805 778 9922",
          "address": "Central Fuel Depot, Idu Industrial Yard, Abuja",
          "balance": 0,
          "creditAvailable": 0
        },
        {
          "id": "vend-b4",
          "name": "Polyfilm Packaging Ltd",
          "displayName": "Polyfilm Bread Wrappers",
          "category": "Packaging Supplies",
          "representative": "Chinedu Eze",
          "email": "orders@polyfilm.ng",
          "phone": "+234 812 667 3344",
          "address": "Plot 8 Heavy Industrial Layout, Kano",
          "balance": 0,
          "creditAvailable": 0
        },
        {
          "id": "vend-b5",
          "name": "Fidson Technical Engineering",
          "displayName": "Fidson Technical Services",
          "category": "Repairs & Maintenance",
          "representative": "Ibrahim Yakubu",
          "email": "service@fidsontech.ng",
          "phone": "+234 807 889 0011",
          "address": "Plot 19 Commercial Area, Abuja",
          "balance": 0,
          "creditAvailable": 0
        },
        {
          "id": "vend-b6",
          "name": "Crown Flour Mills / Olam Agri",
          "displayName": "Mama Gold Flour Depot",
          "category": "Raw Ingredients",
          "representative": "Adeola Balogun",
          "email": "orders@crownflour.com",
          "phone": "+234 813 909 8811",
          "address": "Tin Can Island Port Complex, Lagos",
          "balance": 0,
          "creditAvailable": 0
        }
      ],
      "invoices": [],
      "estimates": [],
      "budgets": [
        {
          "code": "5010",
          "name": "Raw Materials Restock (Flour & Grains)",
          "monthlyBudget": 15000000
        },
        {
          "code": "5020",
          "name": "Staff Payroll & Labor",
          "monthlyBudget": 1800000
        },
        {
          "code": "5030",
          "name": "Diesel Fuel & Generator Power",
          "monthlyBudget": 3500000
        },
        {
          "code": "5040",
          "name": "Packaging Supplies & Wrappers",
          "monthlyBudget": 1000000
        },
        {
          "code": "5050",
          "name": "Oven & Equipment Maintenance",
          "monthlyBudget": 600000
        },
        {
          "code": "5060",
          "name": "Logistics & Delivery Vans",
          "monthlyBudget": 800000
        }
      ],
      "bankRules": [
        {
          "id": "rule-b1",
          "name": "Flour Restock Match",
          "keyword": "Flour",
          "category": "Raw Materials Restock",
          "supplierName": "Flour Mills of Nigeria Plc",
          "accountCode": "5010"
        },
        {
          "id": "rule-b2",
          "name": "Diesel Power Match",
          "keyword": "Diesel",
          "category": "Utilities & Fuel",
          "supplierName": "TotalEnergies Marketing Nig Plc",
          "accountCode": "5030"
        },
        {
          "id": "rule-b3",
          "name": "Sugar Restock Match",
          "keyword": "Sugar",
          "category": "Raw Materials Restock",
          "supplierName": "Dangote Sugar Refinery Plc",
          "accountCode": "5010"
        },
        {
          "id": "rule-b4",
          "name": "MegaMart Settlement",
          "keyword": "MegaMart",
          "category": "Sales Receipt",
          "customerName": "MegaMart Supermarkets Ltd",
          "accountCode": "4010"
        }
      ],
      "expenses": [],
      "bills": [],
      "purchaseOrders": [],
      "supplierCredits": [],
      "inventoryAdjustments": [],
      "staff": [],
      "payrollRuns": [],
      "productionLogs": [],
      "bankTransactions": [],
      "journalEntries": [],
      "closedPeriodsLog": []
    },
    {
      "id": "agric",
      "name": "Rusbi Agric",
      "code": "RA",
      "tagline": "Commercial Feeds, Grains & Fertilizer Blending",
      "category": "Agribusiness & Fertilizer Blending",
      "color": "#00a651",
      "icon": "🌾",
      "logoUrl": "./assets/rusbi-leaves.png",
      "phone": "+234 803 998 7766",
      "email": "agric.orders@rusbigroup.ng",
      "website": "https://rusbigroup.ng/agric",
      "address": "Km 24 Keffi-Abuja Expressway, Mararaba Farm Estate, Nasarawa",
      "warehouseAddress": "Silo Complex 4 & Feedmill Dispatch Yard",
      "city": "Mararaba / Abuja Area",
      "tin": "TIN-28491741-0002",
      "rcNumber": "RC 1928401",
      "vatRate": 7.5,
      "bankWire": "First Bank of Nigeria | 3112233445 | Rusbi Agric Ltd",
      "bankName": "First Bank of Nigeria",
      "bankAccountName": "Rusbi Agric Ltd",
      "bankAccountNumber": "3112233445",
      "invoiceTerms": "All grain, feed & fertilizer orders subject to gate inspection. Bank transfer verification required before truck dispatch.",
      "manager": "Muhammad Rufia Bichi",
      "managerEmail": "muhammadbichi@gmail.com",
      "capital": 0,
      "closedBooks": {
        "isClosed": false,
        "closedDate": null,
        "password": ""
      },
      "accounts": [
        {
          "code": "1010",
          "name": "Agric Operations (First Bank)",
          "type": "Asset",
          "subType": "Bank",
          "balance": 0
        },
        {
          "code": "1020",
          "name": "Grain Storage Reserve (UBA)",
          "type": "Asset",
          "subType": "Bank",
          "balance": 0
        },
        {
          "code": "1200",
          "name": "Accounts Receivable",
          "type": "Asset",
          "subType": "Accounts Receivable",
          "balance": 0
        },
        {
          "code": "1300",
          "name": "Inventory Asset (Fertilizer Raw Materials & Feeds)",
          "type": "Asset",
          "subType": "Inventory",
          "balance": 0
        },
        {
          "code": "1500",
          "name": "Grain Storage Silos & Fertilizer Blending Plant",
          "type": "Asset",
          "subType": "Fixed Asset",
          "balance": 0
        },
        {
          "code": "2000",
          "name": "Accounts Payable",
          "type": "Liability",
          "subType": "Accounts Payable",
          "balance": 0
        },
        {
          "code": "2100",
          "name": "Customer Credit Liability (Prepayments)",
          "type": "Liability",
          "subType": "Current Liability",
          "balance": 0
        },
        {
          "code": "2200",
          "name": "Staff Payroll Accrual",
          "type": "Liability",
          "subType": "Current Liability",
          "balance": 0
        },
        {
          "code": "3010",
          "name": "Branch Allocated Capital",
          "type": "Equity",
          "subType": "Equity",
          "balance": 0
        },
        {
          "code": "3020",
          "name": "Retained Earnings",
          "type": "Equity",
          "subType": "Equity",
          "balance": 0
        },
        {
          "code": "4010",
          "name": "NPK Fertilizer & Blended Goods Sales",
          "type": "Income",
          "subType": "Operating Revenue",
          "balance": 0
        },
        {
          "code": "4020",
          "name": "Grains & Commercial Feed Sales",
          "type": "Income",
          "subType": "Operating Revenue",
          "balance": 0
        },
        {
          "code": "4030",
          "name": "Shipping & Delivery Income",
          "type": "Income",
          "subType": "Operating Revenue",
          "balance": 0
        },
        {
          "code": "4090",
          "name": "Discounts Given (Contra-Revenue)",
          "type": "Income",
          "subType": "Operating Revenue",
          "balance": 0
        },
        {
          "code": "5010",
          "name": "Maize, Soya, Urea & Fertilizer Chemicals",
          "type": "Expense",
          "subType": "Cost of Goods",
          "balance": 0
        },
        {
          "code": "5015",
          "name": "Inventory Loss & Spoilage Wastage",
          "type": "Expense",
          "subType": "Cost of Goods",
          "balance": 0
        },
        {
          "code": "5020",
          "name": "Farm Labor & Field Workers",
          "type": "Expense",
          "subType": "Operating Expense",
          "balance": 0
        },
        {
          "code": "5030",
          "name": "Veterinary Drugs & Vaccinations",
          "type": "Expense",
          "subType": "Operating Expense",
          "balance": 0
        },
        {
          "code": "5040",
          "name": "Irrigation & Solar Borehole Pumping",
          "type": "Expense",
          "subType": "Operating Expense",
          "balance": 0
        }
      ],
      "inventory": [
        {
          "id": "raw-urea",
          "name": "Urea (46% Nitrogen Fertilizer Grade)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 2500,
          "costPrice": 1000,
          "salesPrice": 0,
          "icon": "🧪",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-dap",
          "name": "DAP (Di-Ammonium Phosphate 50kg bags)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 2000,
          "costPrice": 1400,
          "salesPrice": 0,
          "icon": "💎",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-mop",
          "name": "MOP (Muriate of Potash)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 1500,
          "costPrice": 1200,
          "salesPrice": 0,
          "icon": "🧱",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-limestone",
          "name": "Limestone Filler (Calcium Granules)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 3000,
          "costPrice": 400,
          "salesPrice": 0,
          "icon": "⛰️",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-maize",
          "name": "Yellow Maize (Clean Feed Grade)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 3000,
          "costPrice": 650,
          "salesPrice": 0,
          "icon": "🌽",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "raw-soya",
          "name": "Soya Bean Meal (High Protein)",
          "type": "raw_material",
          "category": "Raw Materials",
          "unit": "kg",
          "qtyOnHand": 0,
          "reorderPoint": 2000,
          "costPrice": 950,
          "salesPrice": 0,
          "icon": "🌱",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "prod-npk15",
          "name": "NPK 15-15-15 Granular Blend",
          "type": "product",
          "category": "Fertilizer",
          "unit": "bags (50kg)",
          "qtyOnHand": 0,
          "reorderPoint": 100,
          "costPrice": 28000,
          "salesPrice": 38000,
          "icon": "🌾",
          "asOfDate": "2026-10-01"
        },
        {
          "id": "prod-npk20",
          "name": "NPK 20-10-10 High Yield Blend",
          "type": "product",
          "category": "Fertilizer",
          "unit": "bags (50kg)",
          "qtyOnHand": 0,
          "reorderPoint": 80,
          "costPrice": 31000,
          "salesPrice": 42000,
          "icon": "🌾",
          "asOfDate": "2026-10-01"
        }
      ],
      "recipes": {
        "prod-npk15": {
          "name": "NPK 15-15-15 Blend",
          "ingredients": [
            {
              "id": "raw-urea",
              "name": "Urea",
              "kgPerUnit": 16.5
            },
            {
              "id": "raw-dap",
              "name": "DAP",
              "kgPerUnit": 16
            },
            {
              "id": "raw-mop",
              "name": "MOP Potash",
              "kgPerUnit": 12.5
            },
            {
              "id": "raw-limestone",
              "name": "Limestone",
              "kgPerUnit": 5
            }
          ]
        },
        "prod-npk20": {
          "name": "NPK 20-10-10 Blend",
          "ingredients": [
            {
              "id": "raw-urea",
              "name": "Urea",
              "kgPerUnit": 22
            },
            {
              "id": "raw-dap",
              "name": "DAP",
              "kgPerUnit": 11
            },
            {
              "id": "raw-mop",
              "name": "MOP Potash",
              "kgPerUnit": 8.5
            },
            {
              "id": "raw-limestone",
              "name": "Limestone",
              "kgPerUnit": 8.5
            }
          ]
        }
      },
      "customers": [
        {
          "id": "cust-a1",
          "name": "Golden Feast Caterers Ltd",
          "email": "orders@goldenfeast.ng",
          "phone": "+234 809 111 8822",
          "balance": 0,
          "creditLiability": 0
        },
        {
          "id": "cust-a2",
          "name": "Prime Livestock Feeds Retailers",
          "email": "procure@primefeeds.com",
          "phone": "+234 813 444 9900",
          "balance": 0,
          "creditLiability": 0
        }
      ],
      "vendors": [
        {
          "id": "vend-a1",
          "name": "Premier Seeds & Grain Depot",
          "displayName": "Premier Seeds Ltd",
          "category": "Feed Raw Materials",
          "representative": "Dr. Aliyu Garba",
          "email": "orders@premierseeds.ng",
          "phone": "+234 803 119 2244",
          "address": "Km 14 Zaria Expressway, Kaduna",
          "balance": 0,
          "creditAvailable": 0
        },
        {
          "id": "vend-a2",
          "name": "Animal Care Vet Services Ltd",
          "displayName": "Animal Care Hospital",
          "category": "Medication & Vaccines",
          "representative": "Dr. Ngozi Nwosu",
          "email": "support@animalcare.com",
          "phone": "+234 802 884 7711",
          "address": "Iju Road, Agege / Idu Hub Abuja",
          "balance": 0,
          "creditAvailable": 0
        },
        {
          "id": "vend-a3",
          "name": "Indorama Eleme Petrochemicals Ltd",
          "displayName": "Indorama Urea Depot",
          "category": "Raw Ingredients",
          "representative": "Tarun Sharma",
          "email": "procure@indorama.com",
          "phone": "+234 806 333 4455",
          "address": "Eleme Petrochemical Complex, Port Harcourt",
          "balance": 0,
          "creditAvailable": 0
        },
        {
          "id": "vend-a4",
          "name": "TotalEnergies Diesel Supply",
          "displayName": "Total Commercial Agro Depot",
          "category": "Power & Fuel",
          "representative": "Sunday Adeleke",
          "email": "energy@total.ng",
          "phone": "+234 805 778 9922",
          "address": "Central Fuel Depot, Idu Industrial Yard, Abuja",
          "balance": 0,
          "creditAvailable": 0
        }
      ],
      "invoices": [],
      "estimates": [],
      "budgets": [
        {
          "code": "5010",
          "name": "Raw Materials Restock (Flour & Grains)",
          "monthlyBudget": 15000000
        },
        {
          "code": "5020",
          "name": "Staff Payroll & Labor",
          "monthlyBudget": 1800000
        },
        {
          "code": "5030",
          "name": "Diesel Fuel & Generator Power",
          "monthlyBudget": 3500000
        },
        {
          "code": "5040",
          "name": "Packaging Supplies & Wrappers",
          "monthlyBudget": 1000000
        },
        {
          "code": "5050",
          "name": "Oven & Equipment Maintenance",
          "monthlyBudget": 600000
        },
        {
          "code": "5060",
          "name": "Logistics & Delivery Vans",
          "monthlyBudget": 800000
        }
      ],
      "bankRules": [
        {
          "id": "rule-b1",
          "name": "Flour Restock Match",
          "keyword": "Flour",
          "category": "Raw Materials Restock",
          "supplierName": "Flour Mills of Nigeria Plc",
          "accountCode": "5010"
        },
        {
          "id": "rule-b2",
          "name": "Diesel Power Match",
          "keyword": "Diesel",
          "category": "Utilities & Fuel",
          "supplierName": "TotalEnergies Marketing Nig Plc",
          "accountCode": "5030"
        },
        {
          "id": "rule-b3",
          "name": "Sugar Restock Match",
          "keyword": "Sugar",
          "category": "Raw Materials Restock",
          "supplierName": "Dangote Sugar Refinery Plc",
          "accountCode": "5010"
        },
        {
          "id": "rule-b4",
          "name": "MegaMart Settlement",
          "keyword": "MegaMart",
          "category": "Sales Receipt",
          "customerName": "MegaMart Supermarkets Ltd",
          "accountCode": "4010"
        }
      ],
      "expenses": [],
      "bills": [],
      "purchaseOrders": [],
      "supplierCredits": [],
      "inventoryAdjustments": [],
      "staff": [],
      "payrollRuns": [],
      "productionLogs": [],
      "bankTransactions": [],
      "journalEntries": [],
      "closedPeriodsLog": []
    }
  ]
};
