# AI Based Business Management for Micro Entrepreneurs

Micro Business Manager is a database-driven system that helps small entrepreneurs manage customers, products, orders, inventory, and payments efficiently.

Vercel-ready full-stack app with:
- Frontend: Next.js dashboard (table viewer + forms + CRUD)
- Backend: Next.js API routes
- Database: SQL (Turso for cloud, plus MySQL scripts included from your original design)

## 1) Project Features

- Supports all 19 entities from your document:
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
- Generic CRUD API for every table
- Dynamic frontend forms based on table metadata
- Composite key support for `order_item` and `purchase_item`

## 2) Setup Locally

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_token
```

3. Initialize Turso schema + seed:
```bash
npm run db:setup:turso
```

4. Start app:
```bash
npm run dev
```

## 3) Deploy on Vercel

1. Push this project to GitHub.
2. In Vercel, import the repo.
3. Add Environment Variables in Vercel project settings:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
4. Deploy.

## 4) Important Note

This project includes:
- `sql/schema.sql` and `sql/seed.sql` (your original MySQL model)
- `sql/schema_sqlite.sql` and `sql/seed_sqlite.sql` (cloud SQL setup for Turso)

## 5) API Endpoints

- `GET /api/meta` - table metadata for UI
- `GET /api/{entity}` - list records
- `POST /api/{entity}` - create record
- `GET /api/{entity}/{id}` - get one record
- `PUT /api/{entity}/{id}` - update record
- `DELETE /api/{entity}/{id}` - delete record

Composite key IDs use `~` separator:
- Example: `/api/order_item/1~101`
