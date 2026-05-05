# Database Report Evidence (GitHub View)

This page is prepared for **Chapter 7.2 - Screenshots of Database**.

## 1) Schema / Table Structure

Reference file (full schema with PK/FK):
- [sql/schema_sqlite.sql](../sql/schema_sqlite.sql)

Main core tables:

| Table | Primary Key | Important Foreign Keys |
|---|---|---|
| `business` | `business_id` | `entrepreneur_id -> entrepreneur(entrepreneur_id)` |
| `inventory` | `product_id` | `product_id -> product(product_id)` |
| `orders` | `order_id` | `customer_id -> customer(customer_id)` |
| `order_item` | `(order_id, product_id)` | `order_id -> orders(order_id)`, `product_id -> product(product_id)` |
| `payment` | `payment_id` | `order_id -> orders(order_id)` |
| `purchase` | `purchase_id` | `supplier_id -> supplier(supplier_id)` |
| `purchase_item` | `(purchase_id, product_id)` | `purchase_id -> purchase(purchase_id)`, `product_id -> product(product_id)` |
| `translation` | `translation_id` | `language_id -> language(language_id)` |

Discussion: Confirms successful translation of conceptual ER design into relational implementation.

## 2) Sample Data (Core Tables)

Live API links:
- [Customer](https://dbmsproject-delta.vercel.app/api/customer)
- [Product](https://dbmsproject-delta.vercel.app/api/product)
- [Orders](https://dbmsproject-delta.vercel.app/api/orders)
- [Payment](https://dbmsproject-delta.vercel.app/api/payment)
- [Inventory](https://dbmsproject-delta.vercel.app/api/inventory)

Sample preview (representative):

| Table | Sample Fields |
|---|---|
| `customer` | `customer_id`, `customer_name`, `phone_no`, `email`, `address`, `loyalty_points` |
| `product` | `product_id`, `product_name`, `brand`, `cost_price`, `unit_price`, `reorder_level` |
| `orders` | `order_id`, `customer_id`, `order_date`, `order_status`, `net_amount`, `delivery_mode` |
| `payment` | `payment_id`, `order_id`, `payment_method`, `payment_status`, `amount_paid` |
| `inventory` | `product_id`, `stock_quantity`, `location`, `status`, `last_updated` |

Discussion: Confirms meaningful and connected data population across transactional modules.

## 3) Query Output (Join / Aggregation)

Live analytics API:
- [Analytics Output](https://dbmsproject-delta.vercel.app/api/analytics)

Included outputs:

| Output Section | Purpose |
|---|---|
| `topProducts` | Top-selling products based on joined order and product data |
| `paymentMethods` | Payment method distribution summary |
| `lowStock` | Products at or below reorder level |
| `salesTrend` | Monthly sales totals |

Discussion: Demonstrates analytical capability and usefulness for business monitoring.

## 4) Connectivity / Health

Live health API:
- [Health Endpoint](https://dbmsproject-delta.vercel.app/api/health)

Expected status:

| Field | Meaning |
|---|---|
| `ok` | API health endpoint is working |
| `dbConnected` | DB query is successful |
| `dbMode` | Runtime DB mode (`turso` or `fallback_sqlite`) |
| `hasDbUrl` | Whether `TURSO_DATABASE_URL` is configured |
| `hasAuthToken` | Whether `TURSO_AUTH_TOKEN` is configured |

Discussion: Confirms robust backend connectivity and deployment resilience.
