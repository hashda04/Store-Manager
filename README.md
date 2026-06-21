<div align="center">

# 🏪 Store Manager
### A full-stack store management PWA — built for a real business, used by a real person.



</div>

---

## The Story

My father runs a neighborhood provision store. He tracked everything manually — udhaar (credit) in a physical book, stock in his head, profit never calculated.

I built this app for him. Not as a portfolio piece — as a real tool. He uses it daily.

---

## What It Does

### 📒 Udhaar Book
Track customer credit the way a provision store actually works.
- Add customers, log credit entries and payments
- Running balance calculated automatically
- Search across all customers instantly
- Send full transaction history to customer via WhatsApp
- Partial and full payment support

### 📦 Stock Book
Inventory management built for a real store with 300+ items.
- Items grouped by **category** with brand-level tracking
- Bulk restock support (e.g. 10 bags × 25kg)
- Low stock alerts with one-tap restock from home screen
- Units: kg, litre, piece, packet, dozen, gram, bottle, box

### 🧾 Billing / POS
Point-of-sale built for speed at a busy counter.
- Search and add items to cart in seconds
- Editable quantity (type directly) and sell price per item
- **Cash or Udhaar** — bill can be directly added to a customer's credit
- Optional WhatsApp bill to customer (profit hidden from customer)
- Stock auto-deducts on every sale

### 📊 Profit Report
Real profit from actual sales — not estimates.
- Daily, monthly, yearly profit and revenue
- Current stock value (cost vs sell)
- Per-item margin breakdown
- Recent bills with item count and profit

### 📋 Daily Summary
End-of-day snapshot.
- Total bills, revenue, profit, udhaar given
- Top 5 selling items of the day

### 🚚 Supplier Log
Track what goes out to suppliers.
- Log supplier payments with notes
- Monthly and yearly spend totals

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, PWA (next-pwa) |
| Backend | FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL |
| Deployment | Vercel (frontend) + Railway (backend + DB) |
| Auth | None — single-user app by design |

---

## Architecture

```
Store-Manager/
├── frontend/                  # Next.js 16 App Router
│   ├── app/
│   │   ├── page.tsx           # Landing — all modules
│   │   ├── udhaar/            # Customer credit module
│   │   ├── stock/             # Inventory module
│   │   ├── billing/           # POS module
│   │   ├── profit/            # Analytics module
│   │   ├── summary/           # Daily summary
│   │   └── suppliers/         # Supplier log
│   ├── components/
│   │   └── BottomNav.tsx      # Shared nav
│   └── lib/
│       └── api.ts             # Typed API layer
│
└── backend/                   # FastAPI
    └── app/
        ├── models/            # SQLAlchemy models
        ├── schemas/           # Pydantic schemas
        ├── routers/           # Route handlers
        └── services/          # Business logic
```

---

## Database Schema

```
customers          transactions        items
─────────────      ────────────────    ──────────────────
id                 id                  id
name               customer_id (FK)    name
phone              type                category
created_at         amount              brand
                   note                unit
                   created_at          buy_price
                                       sell_price
                                       min_stock
                                       created_at

stock_entries      sales               bills
─────────────      ──────────          ──────────────
id                 id                  id
item_id (FK)       item_id (FK)        total_amount
type               bill_id (FK)        total_profit
quantity           quantity_sold       created_at
buy_price          sell_price
sell_price         buy_price
noted_at           profit
                   sold_at

supplier_payments
─────────────────
id
supplier_name
amount
note
paid_at
```

---

## Key API Endpoints

```
GET    /customers/              All customers with live balance
POST   /customers/              Create customer
GET    /customers/{id}          Customer + balance
POST   /transactions/           Add credit or payment
GET    /transactions/today      Today's credit entries

GET    /items/                  All items grouped, with stock
POST   /items/                  Create item
GET    /items/categories        Distinct categories
POST   /stock/entry             Restock or count entry

POST   /sales/bill              Create bill (deducts stock, records profit)
POST   /sales/quick             Quick single-item sell
GET    /sales/profit            Daily / monthly / yearly P&L
GET    /sales/summary/today     Full today snapshot
GET    /sales/bills             Recent bills

POST   /suppliers/payment       Log supplier payment
GET    /suppliers/summary       Monthly / yearly spend
```

---

## Design Decisions Worth Noting

**Why PWA over React Native?**
Single codebase, instant updates, no app store approval. For a single-user store app on consistent WiFi, PWA delivers identical UX.

**Why no auth?**
Deliberate. This is a single-owner store tool. Login adds friction with zero security benefit in this context.

**Profit from sales, not estimates.**
Every bill creates a `Sale` record with exact profit. No stock counting needed — profit is always accurate from real transactions.

**Stock deduction is automatic.**
Every bill deducts from stock immediately. No manual inventory updates needed after a sale.

**WhatsApp as the notification layer.**
No push notification infra needed. Every bill and udhaar summary goes to WhatsApp — which the customer is already on.

---

## Running Locally

```bash
# Backend
cd backend
pip install -r requirements.txt
# Set DATABASE_URL in .env
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
# Set NEXT_PUBLIC_API_URL in .env.local
npm run dev
```

---

## What I Learned

- Designing for a **non-technical real user** — every UX decision was validated against "will my father actually use this?"
- **PWA configuration** with Next.js including manifest, icons, offline caching
- **SQLAlchemy relationships** and computed fields (balance, current_stock) derived at query time
- **Railway + Vercel deployment** with environment-specific configs and CORS
- The gap between "technically correct" and "actually usable" — this project closed it

---

<div align="center">

Built by **Hashida Sherin** · [LinkedIn](https://linkedin.com/in/hashida-sherin-14445727a) · [GitHub](https://github.com/hashda04)

*This app runs in production. My father uses it every day.*

</div>