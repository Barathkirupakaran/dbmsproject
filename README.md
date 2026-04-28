# AI Based Business Management for Micro Entrepreneurs

🌐 **Live Demo:** http://dbmsproject-delta.vercel.app/

## Overview

**Micro Business Manager** is a full-stack AI-powered business management platform designed for **micro entrepreneurs, street vendors, home businesses, retail shops, and small-scale sellers** who need a simple and affordable way to manage their daily operations.

It transforms traditional manual record-keeping into a **smart digital system** for handling:

- Customers  
- Products  
- Inventory  
- Orders  
- Payments  
- Suppliers  
- Expenses  
- Business Insights  

Built using modern web technologies and based on a DBMS project model, this application is fully deployable and production-ready.

---

## Live Website

🔗 **Visit Now:** http://dbmsproject-delta.vercel.app/

---

## Why This App Is Needed

Many small businesses still face common problems:

- Manual notebooks get lost or damaged  
- Incorrect stock entries lead to losses  
- Pending payments are forgotten  
- Orders become unorganized  
- No proper idea of profit or sales growth  
- Hard to use complex software systems  

### Solution

Micro Business Manager provides:

✅ One centralized dashboard  
✅ Easy CRUD operations  
✅ Real-time business tracking  
✅ Voice-assisted commands  
✅ Smart analytics & insights  
✅ Mobile-friendly UI  
✅ Multi-language support  

---

## Key Features

## 1️⃣ Smart Dashboard

Track complete business performance in one place:

- Total Orders  
- Total Revenue  
- Total Products  
- Total Customers  
- Pending Payments  
- Low Stock Warnings  

---

## 2️⃣ Business Management Modules

Supports **19 relational entities**:

- entrepreneur  
- business  
- customer  
- supplier  
- product  
- inventory  
- orders  
- order_item  
- payment  
- purchase  
- purchase_item  
- expense  
- notification  
- category  
- ai_recommendation  
- voice_command  
- voice_response  
- language  
- translation  

---

## 3️⃣ Voice + AI Assistance

Users can manage tasks through voice commands:

Examples:

- "Show today's orders"  
- "Add customer Ravi"  
- "Check low stock"  
- "Pending payments"  

If voice is unavailable, typed command mode works.

---

## 4️⃣ Analytics & Reports

Interactive charts for:

- Monthly Sales Trend  
- Payment Method Split  
- Top Selling Products  
- Order Status Breakdown  
- Low Stock Alerts  

Helps owners make smarter decisions.

---

## 5️⃣ Settings & Accessibility

Customizable UI includes:

- Theme Mode  
- Language Selection  
- Text Size  
- Compact Layout  
- Voice Feedback Toggle  
- Auto Refresh Dashboard  
- Quick Guide Steps  

---

## Tech Stack

### Frontend
- Next.js  
- React.js  
- Tailwind CSS  

### Backend
- Next.js API Routes  

### Database
- Turso Cloud Database  
- SQLite Fallback Mode  

### Deployment
- Vercel  

---

## Deployment Ready

Hosted on **Vercel** with automatic support for:

- Cloud DB mode using Turso  
- Local SQLite fallback  
- Fast loading pages  
- Production optimization  

---

## API Endpoints

### Core APIs

- `/api/meta` → Metadata  
- `/api/health` → Database Health  
- `/api/analytics` → Dashboard Data  

### CRUD APIs

- `GET /api/{entity}`  
- `POST /api/{entity}`  
- `PUT /api/{entity}/{id}`  
- `DELETE /api/{entity}/{id}`  

---

## Project Impact

This project converts an academic DBMS model into a **real-world startup solution**.

### Benefits:

✔ Saves Time  
✔ Reduces Errors  
✔ Improves Sales Tracking  
✔ Better Stock Control  
✔ Easy Payment Follow-up  
✔ Digital Transformation for Small Vendors  

---

## Future Enhancements

Planned upgrades:

- AI Sales Prediction  
- WhatsApp Order Alerts  
- GST Billing  
- Barcode Scanner  
- Mobile App Version  
- Multi-user Staff Login  
- Profit/Loss Auto Reports  
- Smart Expense Analysis  

---
## Developed By
Barath K
Kotapati KavyaSree

---

## Final Note
This is not just a college DBMS project — it is a practical SaaS solution that can genuinely help thousands of small business owners move from paper records to smart digital management.

---

## Repository Structure

```bash
app/        Frontend + APIs
lib/        Database helpers
sql/        Schema + Seed files
scripts/    Setup scripts
vercel.json Deployment config


