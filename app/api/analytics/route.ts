import { NextResponse } from "next/server";

import { dbAll } from "@/lib/db";

const toNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return value;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toText = (value: unknown, fallback = ""): string => {
  if (value === null || value === undefined) {
    return fallback;
  }
  const text = String(value).trim();
  return text || fallback;
};

export async function GET() {
  try {
    const [topProductsRows, orderStatusRows, paymentMethodRows, lowStockRows, kpiRows, salesTrendRows] =
      await Promise.all([
        dbAll(`
          SELECT
            p.product_id,
            p.product_name,
            SUM(COALESCE(oi.quantity, 0)) AS total_qty,
            ROUND(SUM(COALESCE(oi.sub_total, 0)), 2) AS total_sales
          FROM order_item oi
          JOIN product p ON p.product_id = oi.product_id
          GROUP BY p.product_id, p.product_name
          ORDER BY total_qty DESC
          LIMIT 8
        `),
        dbAll(`
          SELECT
            COALESCE(NULLIF(TRIM(order_status), ''), 'Unknown') AS status,
            COUNT(*) AS total
          FROM orders
          GROUP BY COALESCE(NULLIF(TRIM(order_status), ''), 'Unknown')
          ORDER BY total DESC
        `),
        dbAll(`
          SELECT
            COALESCE(NULLIF(TRIM(payment_method), ''), 'Unknown') AS method,
            COUNT(*) AS total
          FROM payment
          GROUP BY COALESCE(NULLIF(TRIM(payment_method), ''), 'Unknown')
          ORDER BY total DESC
        `),
        dbAll(`
          SELECT
            p.product_name,
            COALESCE(i.stock_quantity, 0) AS stock_quantity,
            COALESCE(p.reorder_level, 0) AS reorder_level
          FROM inventory i
          JOIN product p ON p.product_id = i.product_id
          WHERE COALESCE(i.stock_quantity, 0) <= COALESCE(p.reorder_level, 0)
          ORDER BY i.stock_quantity ASC
          LIMIT 10
        `),
        dbAll(`
          SELECT
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT COUNT(*) FROM product) AS total_products,
            (SELECT COUNT(*) FROM customer) AS total_customers,
            (SELECT COUNT(*) FROM payment WHERE LOWER(COALESCE(payment_status, '')) = 'pending') AS pending_payments,
            (SELECT ROUND(COALESCE(SUM(amount_paid), 0), 2) FROM payment) AS total_revenue
        `),
        dbAll(`
          SELECT
            SUBSTR(order_date, 1, 7) AS month,
            ROUND(SUM(COALESCE(net_amount, 0)), 2) AS sales
          FROM orders
          WHERE order_date IS NOT NULL
          GROUP BY SUBSTR(order_date, 1, 7)
          ORDER BY month ASC
          LIMIT 12
        `)
      ]);

    const kpiRow = kpiRows[0] ?? {};

    return NextResponse.json({
      kpis: {
        totalOrders: toNumber(kpiRow.total_orders),
        totalProducts: toNumber(kpiRow.total_products),
        totalCustomers: toNumber(kpiRow.total_customers),
        pendingPayments: toNumber(kpiRow.pending_payments),
        totalRevenue: toNumber(kpiRow.total_revenue)
      },
      topProducts: topProductsRows.map((row) => ({
        productId: toNumber(row.product_id),
        productName: toText(row.product_name, "Unknown"),
        totalQty: toNumber(row.total_qty),
        totalSales: toNumber(row.total_sales)
      })),
      orderStatus: orderStatusRows.map((row) => ({
        status: toText(row.status, "Unknown"),
        total: toNumber(row.total)
      })),
      paymentMethods: paymentMethodRows.map((row) => ({
        method: toText(row.method, "Unknown"),
        total: toNumber(row.total)
      })),
      lowStock: lowStockRows.map((row) => ({
        productName: toText(row.product_name, "Unknown"),
        stockQuantity: toNumber(row.stock_quantity),
        reorderLevel: toNumber(row.reorder_level)
      })),
      salesTrend: salesTrendRows.map((row) => ({
        month: toText(row.month, "Unknown"),
        sales: toNumber(row.sales)
      }))
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load analytics";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
