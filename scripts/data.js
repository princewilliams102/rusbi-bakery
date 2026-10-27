/**
 * Rusbi Bakery OS - Dedicated Single-Tenant Bakery Management & Accounting System
 * Designed for Rusbi Bakery Ltd. (Abuja, Nigeria)
 */

export const INITIAL_DATA = {
  "companyGroup": {
    "name": "Rusbi Bakery Ltd.",
    "shortName": "Rusbi Bakery OS",
    "hq": "Plot 12, Idu Industrial Area Phase 1, Abuja, FCT, Nigeria",
    "defaultCurrency": "NGN",
    "currencySymbol": "₦"
  },
    "rolePermissions": {
    "master": {
      "label": "Bakery Chairman / Executive",
      "description": "Full uninhibited operational and financial oversight of Rusbi Bakery, general ledger, recipes, and settings.",
      "allowedRoutes": [
        "dashboard",
        "pos",
        "batches",
        "crates",
        "bashi",
        "shifts",
        "energy",
        "institutional",
        "nolies",
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
        "devices",
        "admin"
      ],
      "canSeeSwitcher": false,
      "canViewFinances": true,
      "canViewPayroll": true,
      "canManageUsers": true,
      "canShareAccess": true,
      "isTypeP": false
    },
    "branch_admin": {
      "label": "Bakery General Manager",
      "description": "Full day-to-day management of bakery operations, production floor, billing, and staff oversight.",
      "allowedRoutes": [
        "dashboard",
        "pos",
        "batches",
        "crates",
        "bashi",
        "shifts",
        "energy",
        "institutional",
        "nolies",
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
        "devices",
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
      "label": "Senior Accountant",
      "description": "Full financial authority: double-entry GL, banking reconciliation, supplier bills, customer aging registers, and period close.",
      "allowedRoutes": [
        "dashboard",
        "pos",
        "batches",
        "crates",
        "bashi",
        "shifts",
        "energy",
        "institutional",
        "nolies",
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
      "label": "Type P — Master Baker & Floor Clerk",
      "description": "Restricted entry exclusively for flour mixing batches, dough scaling, oven logs, and yield loss tracking. Financial data and bank balances are strictly hidden.",
      "allowedRoutes": [
        "dashboard",
        "batches",
        "crates",
        "energy",
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
      "label": "Sales & Dispatch Officer",
      "description": "Can create bread sales delivery slips, record split tenders, manage customer Bashi credit limits, and issue crates.",
      "allowedRoutes": [
        "dashboard",
        "pos",
        "crates",
        "bashi",
        "shifts",
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
      "description": "Responsible for logging flour intake (50kg bags), sugar, yeast, and packaging supplies. Financial ledgers remain hidden.",
      "allowedRoutes": [
        "dashboard",
        "batches",
        "crates",
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
      "name": "Alhaji Ibrahim Rusbi",
      "email": "admin@rusbigroup.com",
      "secondaryEmail": "admin@rusbibooks.systemslib.com",
      "password": "Damian1937$$",
      "role": "master",
      "entityId": "bakery",
      "status": "Active",
      "avatar": "IR",
      "phone": "+234 803 100 0001",
      "lastLogin": "Just now",
      "accessGrantedBy": "System Root",
      "emailAccessSent": true
    },
    {
      "id": "usr-2",
      "name": "Ahmad Rufai (Tunde Bakare)",
      "email": "ahmadmaimakani@gmail.com",
      "secondaryEmail": "tunde.bakare@rusbigroup.ng",
      "password": "Bakery#Admin2026",
      "role": "branch_admin",
      "entityId": "bakery",
      "status": "Active",
      "avatar": "TB",
      "phone": "+234 802 334 5511",
      "lastLogin": "Just now",
      "accessGrantedBy": "Rusbi Bakery Chairman",
      "emailAccessSent": true
    },
    {
      "id": "usr-3",
      "name": "Khadija Sani",
      "email": "khadija.accountant@rusbigroup.ng",
      "secondaryEmail": "finance@rusbigroup.ng",
      "password": "Rusbi#Master2026!",
      "role": "accountant",
      "entityId": "bakery",
      "status": "Active",
      "avatar": "KS",
      "phone": "+234 809 444 8812",
      "lastLogin": "Just now",
      "accessGrantedBy": "Rusbi Bakery Chairman",
      "emailAccessSent": true
    },
    {
      "id": "usr-4",
      "name": "John Ameh",
      "email": "john.production@rusbigroup.ng",
      "secondaryEmail": "john.ameh@gmail.com",
      "password": "Rusbi#Master2026!",
      "role": "production_staff",
      "entityId": "bakery",
      "status": "Active",
      "avatar": "JA",
      "phone": "+234 814 222 3300",
      "lastLogin": "Just now",
      "accessGrantedBy": "Rusbi Bakery GM",
      "emailAccessSent": true
    },
    {
      "id": "usr-5",
      "name": "Aliyu Danladi",
      "email": "aliyu.store@rusbigroup.ng",
      "secondaryEmail": "aliyu.danladi@gmail.com",
      "password": "Rusbi#Master2026!",
      "role": "storekeeper",
      "entityId": "bakery",
      "status": "Active",
      "avatar": "AD",
      "phone": "+234 805 119 2201",
      "lastLogin": "Just now",
      "accessGrantedBy": "Rusbi Bakery GM",
      "emailAccessSent": true
    },
    {
      "id": "usr-6",
      "name": "Zainab Bello",
      "email": "zainab.sales@rusbigroup.ng",
      "secondaryEmail": "zainab.bello@gmail.com",
      "password": "Rusbi#Master2026!",
      "role": "sales_rep",
      "entityId": "bakery",
      "status": "Active",
      "avatar": "ZB",
      "phone": "+234 816 777 4432",
      "lastLogin": "Just now",
      "accessGrantedBy": "Rusbi Bakery GM",
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
      "closedPeriodsLog": [],
      "bashiDistributors": [
        {
          "id": "bashi-1",
          "name": "Alhaji Garba Kano",
          "role": "Wholesale Distributor (Mai Sari)",
          "phone": "+234 803 445 9901",
          "dailyAllocation": 300,
          "creditLimit": 500000,
          "balanceOwing": 120000,
          "overdueDays": 2,
          "status": "active",
          "guarantor": "Malam Aminu Bichi (Kano Bakers Association Elder)",
          "guarantorPhone": "+234 803 111 2233",
          "lastPayment": "₦240,000 on 26 Oct (Cash & Moniepoint POS)"
        },
        {
          "id": "bashi-2",
          "name": "Danlami Sani",
          "role": "Tea & Bread Vendor (Mai Shayi)",
          "phone": "+234 802 556 1234",
          "dailyAllocation": 35,
          "creditLimit": 50000,
          "balanceOwing": 15000,
          "overdueDays": 1,
          "status": "active",
          "guarantor": "Sarkin Kasuwa Wuse",
          "guarantorPhone": "+234 802 888 4400",
          "lastPayment": "₦20,000 on 25 Oct (Cash)"
        },
        {
          "id": "bashi-3",
          "name": "Command Secondary School Kaduna",
          "role": "Institutional Account (Mess Supply)",
          "phone": "+234 803 999 0012",
          "dailyAllocation": 650,
          "creditLimit": 8000000,
          "balanceOwing": 3450000,
          "overdueDays": 42,
          "status": "contract_active",
          "guarantor": "Federal Ministry of Defence (Treasury Subvention)",
          "guarantorPhone": "+234 9 290 1200",
          "lastPayment": "₦4,500,000 on 15 Sept (Treasury Transfer)"
        },
        {
          "id": "bashi-4",
          "name": "Federal Medical Centre Staff Mess",
          "role": "Institutional Account (Hospital)",
          "phone": "+234 803 777 6655",
          "dailyAllocation": 180,
          "creditLimit": 2000000,
          "balanceOwing": 780000,
          "overdueDays": 18,
          "status": "contract_active",
          "guarantor": "FMC Welfare Board",
          "guarantorPhone": "+234 803 222 9988",
          "lastPayment": "₦950,000 on 10 Oct (FirstBank Transfer)"
        },
        {
          "id": "bashi-5",
          "name": "Mohammed Ishaq",
          "role": "Wholesale Distributor (Mai Sari)",
          "phone": "+234 806 333 4411",
          "dailyAllocation": 150,
          "creditLimit": 250000,
          "balanceOwing": 48000,
          "overdueDays": 0,
          "status": "active",
          "guarantor": "Alh. Usman Zaria",
          "guarantorPhone": "+234 803 555 1199",
          "lastPayment": "₦102,000 on 27 Oct (OPay Transfer)"
        }
      ],
      "flourBatches": [
        {
          "id": "BAT-2026-1027-01",
          "shift": "Morning Shift (5:00 AM - 1:00 PM)",
          "recipe": "Rusbi Special Jumbo & Family Loaves",
          "flourBags50kg": 15,
          "flourBrand": "Golden Penny Special Flour (50kg)",
          "sugarBags": 1.5,
          "yeastSachets": 15,
          "margarineCartons": 3,
          "calciumPropionateGrams": 450,
          "targetLoaves": 1875,
          "actualLoaves": 1842,
          "burntLoaves": 18,
          "fallenLoaves": 10,
          "unaccountedTheft": 5,
          "varianceLoaves": -33,
          "variancePct": -1.76,
          "status": "Completed & Dispatched",
          "chiefBaker": "Aliyu Danladi (Head Baker)",
          "costPerLoaf": 485.20,
          "sellingPrice": 850.00
        },
        {
          "id": "BAT-2026-1026-02",
          "shift": "Night Shift (8:00 PM - 4:00 AM)",
          "recipe": "Rusbi Medium & Coconut Bread",
          "flourBags50kg": 10,
          "flourBrand": "Dangote Refined Flour (50kg)",
          "sugarBags": 1.0,
          "yeastSachets": 10,
          "margarineCartons": 2,
          "calciumPropionateGrams": 300,
          "targetLoaves": 1250,
          "actualLoaves": 1230,
          "burntLoaves": 12,
          "fallenLoaves": 8,
          "unaccountedTheft": 0,
          "varianceLoaves": -20,
          "variancePct": -1.60,
          "status": "Completed & Dispatched",
          "chiefBaker": "John Ameh (Production Manager)",
          "costPerLoaf": 360.50,
          "sellingPrice": 650.00
        }
      ],
      "cratesSummary": {
        "totalOwned": 1200,
        "assetValuePerCrate": 6000,
        "totalAssetValue": 7200000,
        "inYard": 750,
        "inTransit": 450,
        "unreturnedDeficit": 42,
        "depositPerCrate": 4000,
        "refundableDepositsHeld": 168000,
        "holders": [
          { "distributor": "Alhaji Garba Kano", "cratesTaken": 50, "cratesReturned": 32, "deficit": 18, "depositHeld": 72000 },
          { "distributor": "Danlami Sani (Mai Shayi)", "cratesTaken": 10, "cratesReturned": 4, "deficit": 6, "depositHeld": 24000 },
          { "distributor": "Mai Shayi Sule", "cratesTaken": 20, "cratesReturned": 2, "deficit": 18, "depositHeld": 72000 }
        ]
      },
      "energyStats": {
        "generatorKVA": "60kVA Lister Soundproof Generator",
        "generatorRunHours": 6.5,
        "dieselLitresConsumed": 45,
        "dieselCostPerLitre": 1100,
        "totalDieselCost": 49500,
        "serviceHoursRemaining": 78,
        "gridPowerHours": 2.5,
        "gridUnitsConsumed": 18,
        "gridTariff": 110,
        "totalGridCost": 1980,
        "totalEnergyCostToday": 51480,
        "totalLoavesProduced": 3072,
        "energyCostPerLoaf": 16.76
      },
      "cashShift": {
        "cashier": "Zainab Bello",
        "shiftDate": "27 Oct 2026",
        "openingFloat": 50000,
        "cashCollectedSales": 680000,
        "cashCollectedBashi": 190000,
        "safeDrops": 500000,
        "expectedInDrawer": 420000,
        "actualPhysicalCount": 420000,
        "variance": 0,
        "safeVaultReserves": 1850000,
        "soiledNotesTracked": 8500
      },
    }
  ]
};
