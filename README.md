# AI Based Business Management for Micro Entrepreneurs

Micro Business Manager is a full-stack business app built for small and micro vendors who need simple daily operations: customer handling, product/inventory tracking, orders, payments, purchases, and quick business insights.

It is based on your DBMS project model and is production-ready on Vercel.

## Why This App Is Useful

Small vendors usually face these issues:
- Records are written manually and become inconsistent.
- Stock updates are missed, leading to over-selling or dead stock.
- Payment follow-ups and order status are hard to track.
- Business decisions are made without clear numbers.

This app solves that by giving:
- One central system for all business data.
- Fast CRUD operations for all entities.
- Ready-to-use insights (top-selling items, payment mix, low stock, sales trend).
- Voice-assisted operations + typed command fallback for ease of use.
- Multi-language friendly interface and simple settings for non-technical users.

## Tech Stack

- Frontend: Next.js + React
- Backend: Next.js API routes
- Database driver: `@libsql/client`
- Cloud DB mode: Turso (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`)
- Fallback mode: Auto-seeded SQLite file DB for quick deployment/testing

## What Was Implemented In This App

### 1) Database Layer
- Relational model implemented from your ER design.
- Supports all 19 entities:
  - `entrepreneur`
  - `business`
  - `customer`
  - `supplier`
  - `product`
  - `inventory`
  - `orders`
  - `order_item`
  - `payment`
  - `purchase`
  - `purchase_item`
  - `expense`
  - `notification`
  - `category`
  - `ai_recommendation`
  - `voice_command`
  - `voice_response`
  - `language`
  - `translation`

### 2) Backend/API
- Generic CRUD APIs generated per entity.
- Composite key handling for:
  - `order_item`
  - `purchase_item`
- Analytics endpoint for dashboard charts.
- Health endpoint for deployment diagnostics:
  - `GET /api/health`

### 3) Frontend UI
- Table-based management interface with search, add, edit, delete.
- Dynamic forms from metadata (no hardcoded form per table).
- Mobile-friendly dashboard layout.
- User-focused settings panel:
  - Language selection
  - Theme selection
  - Text size option
  - Compact mode
  - Voice feedback toggle
  - Quick Steps card toggle
  - Dashboard auto-refresh toggle
  - Manual refresh button
- Creator credits displayed in settings:
  - Barath K
  - Kotapati KavyaSree

### 4) Voice + Accessibility
- Browser voice input support where available.
- Typed command mode as fallback.
- In-app feedback messages and guided quick steps.

### 5) Analytics/Stats
- KPI cards:
  - Total Orders
  - Total Products
  - Total Customers
  - Pending Payments
  - Total Revenue
- Visual charts:
  - Top-selling products
  - Order status split
  - Payment method split
  - Monthly sales trend
  - Low stock alerts

### 6) Deployment Robustness
- Vercel build compatibility script.
- Explicit Vercel config (`vercel.json`).
- Automatic fallback SQLite mode when Turso env vars are not provided.
  - This ensures app works immediately in fresh deployments.

## Repository Structure

- `app/` - frontend pages and API routes
- `lib/` - DB client, schema metadata, helper types
- `sql/` - schema and seed SQL files
- `scripts/` - Turso setup script
- `vercel.json` - Vercel build settings

## Local Setup

1. Install dependencies
```bash
npm install
```

2. (Optional for cloud mode) create `.env.local`
```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_token
```

3. (Optional) seed Turso directly
```bash
npm run db:setup:turso
```

4. Run
```bash
npm run dev
```

## Vercel Deployment

1. Import this repo into Vercel.
2. Use:
  - Root Directory: `.`
  - Build Command: `npm run build`
3. For Turso cloud mode, add env vars:
  - `TURSO_DATABASE_URL`
  - `TURSO_AUTH_TOKEN`
4. Deploy.

If env vars are missing, app still runs using fallback SQLite mode.

## API Endpoints

- `GET /api/meta` - entity metadata for UI/form rendering
- `GET /api/health` - DB connection and mode diagnostics
- `GET /api/analytics` - dashboard stats and chart data
- `GET /api/{entity}` - list records
- `POST /api/{entity}` - create record
- `GET /api/{entity}/{id}` - get single record
- `PUT /api/{entity}/{id}` - update record
- `DELETE /api/{entity}/{id}` - delete record

Composite key format:
- `/api/order_item/1~101`
- `/api/purchase_item/2~105`

## SQL Files Included

- `sql/schema.sql` and `sql/seed.sql` - MySQL-style version from project model
- `sql/schema_sqlite.sql` and `sql/seed_sqlite.sql` - SQLite/Turso-compatible version

## Project Impact

This app converts your academic DBMS design into a usable product for real vendors:
- Better data consistency and less manual error
- Faster daily business operations
- Clear visibility into sales, stock, and payments
- Scalable base for future AI and automation features
