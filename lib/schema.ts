import type { EntityDefinition } from "@/lib/types";

export const ENTITIES: Record<string, EntityDefinition> = {
  entrepreneur: {
    key: "entrepreneur",
    table: "entrepreneur",
    label: "Entrepreneur",
    primaryKey: ["entrepreneur_id"],
    defaultSort: "entrepreneur_id",
    columns: [
      { name: "entrepreneur_id", label: "Entrepreneur ID", type: "number", autoIncrement: true },
      { name: "name", label: "Name", type: "string", required: true },
      { name: "phone_no", label: "Phone", type: "string", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "password", label: "Password", type: "password", required: true },
      { name: "address", label: "Address", type: "text" },
      { name: "registration_date", label: "Registration Date", type: "date", required: true }
    ]
  },
  business: {
    key: "business",
    table: "business",
    label: "Business",
    primaryKey: ["business_id"],
    defaultSort: "business_id",
    columns: [
      { name: "business_id", label: "Business ID", type: "number", autoIncrement: true },
      { name: "entrepreneur_id", label: "Entrepreneur ID", type: "number", required: true },
      { name: "business_name", label: "Business Name", type: "string", required: true },
      { name: "business_type", label: "Business Type", type: "string", required: true },
      { name: "start_date", label: "Start Date", type: "date" },
      { name: "gst_number", label: "GST Number", type: "string" }
    ]
  },
  customer: {
    key: "customer",
    table: "customer",
    label: "Customer",
    primaryKey: ["customer_id"],
    defaultSort: "customer_id",
    columns: [
      { name: "customer_id", label: "Customer ID", type: "number", autoIncrement: true },
      { name: "customer_name", label: "Customer Name", type: "string", required: true },
      { name: "phone_no", label: "Phone", type: "string", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "address", label: "Address", type: "text" },
      { name: "loyalty_points", label: "Loyalty Points", type: "number" }
    ]
  },
  supplier: {
    key: "supplier",
    table: "supplier",
    label: "Supplier",
    primaryKey: ["supplier_id"],
    defaultSort: "supplier_id",
    columns: [
      { name: "supplier_id", label: "Supplier ID", type: "number", autoIncrement: true },
      { name: "supplier_name", label: "Supplier Name", type: "string", required: true },
      { name: "contact_person", label: "Contact Person", type: "string" },
      { name: "phone_no", label: "Phone", type: "string", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "address", label: "Address", type: "text" },
      { name: "rating", label: "Rating", type: "number" }
    ]
  },
  product: {
    key: "product",
    table: "product",
    label: "Product",
    primaryKey: ["product_id"],
    defaultSort: "product_id",
    columns: [
      { name: "product_id", label: "Product ID", type: "number", autoIncrement: true },
      { name: "product_name", label: "Product Name", type: "string", required: true },
      { name: "brand", label: "Brand", type: "string" },
      { name: "cost_price", label: "Cost Price", type: "decimal" },
      { name: "unit_price", label: "Unit Price", type: "decimal", required: true },
      { name: "expiry_date", label: "Expiry Date", type: "date" },
      { name: "reorder_level", label: "Reorder Level", type: "number" }
    ]
  },
  inventory: {
    key: "inventory",
    table: "inventory",
    label: "Inventory",
    primaryKey: ["product_id"],
    defaultSort: "product_id",
    columns: [
      { name: "product_id", label: "Product ID", type: "number", required: true },
      { name: "stock_quantity", label: "Stock Quantity", type: "number", required: true },
      { name: "location", label: "Location", type: "string" },
      { name: "status", label: "Status", type: "string" },
      { name: "last_updated", label: "Last Updated", type: "date" }
    ]
  },
  orders: {
    key: "orders",
    table: "orders",
    label: "Orders",
    primaryKey: ["order_id"],
    defaultSort: "order_id",
    columns: [
      { name: "order_id", label: "Order ID", type: "number", autoIncrement: true },
      { name: "customer_id", label: "Customer ID", type: "number", required: true },
      { name: "order_date", label: "Order Date", type: "date", required: true },
      { name: "order_status", label: "Order Status", type: "string" },
      { name: "discount", label: "Discount", type: "decimal" },
      { name: "net_amount", label: "Net Amount", type: "decimal" },
      { name: "tax", label: "Tax", type: "decimal" },
      { name: "delivery_mode", label: "Delivery Mode", type: "string" }
    ]
  },
  order_item: {
    key: "order_item",
    table: "order_item",
    label: "Order Item",
    primaryKey: ["order_id", "product_id"],
    defaultSort: "order_id",
    columns: [
      { name: "order_id", label: "Order ID", type: "number", required: true },
      { name: "product_id", label: "Product ID", type: "number", required: true },
      { name: "quantity", label: "Quantity", type: "number", required: true },
      { name: "unit_price", label: "Unit Price", type: "decimal", required: true },
      { name: "sub_total", label: "Sub Total", type: "decimal" }
    ]
  },
  payment: {
    key: "payment",
    table: "payment",
    label: "Payment",
    primaryKey: ["payment_id"],
    defaultSort: "payment_id",
    columns: [
      { name: "payment_id", label: "Payment ID", type: "number", autoIncrement: true },
      { name: "order_id", label: "Order ID", type: "number", required: true },
      { name: "payment_date", label: "Payment Date", type: "date" },
      { name: "payment_method", label: "Payment Method", type: "string" },
      { name: "payment_status", label: "Payment Status", type: "string" },
      { name: "amount_paid", label: "Amount Paid", type: "decimal", required: true }
    ]
  },
  purchase: {
    key: "purchase",
    table: "purchase",
    label: "Purchase",
    primaryKey: ["purchase_id"],
    defaultSort: "purchase_id",
    columns: [
      { name: "purchase_id", label: "Purchase ID", type: "number", autoIncrement: true },
      { name: "supplier_id", label: "Supplier ID", type: "number", required: true },
      { name: "purchase_date", label: "Purchase Date", type: "date", required: true },
      { name: "total_cost", label: "Total Cost", type: "decimal" },
      { name: "invoice_no", label: "Invoice Number", type: "string" },
      { name: "status", label: "Status", type: "string" }
    ]
  },
  purchase_item: {
    key: "purchase_item",
    table: "purchase_item",
    label: "Purchase Item",
    primaryKey: ["purchase_id", "product_id"],
    defaultSort: "purchase_id",
    columns: [
      { name: "purchase_id", label: "Purchase ID", type: "number", required: true },
      { name: "product_id", label: "Product ID", type: "number", required: true },
      { name: "quantity", label: "Quantity", type: "number", required: true },
      { name: "cost_price", label: "Cost Price", type: "decimal", required: true },
      { name: "sub_total", label: "Sub Total", type: "decimal" }
    ]
  },
  expense: {
    key: "expense",
    table: "expense",
    label: "Expense",
    primaryKey: ["expense_id"],
    defaultSort: "expense_id",
    columns: [
      { name: "expense_id", label: "Expense ID", type: "number", autoIncrement: true },
      { name: "expense_type", label: "Expense Type", type: "string", required: true },
      { name: "amount", label: "Amount", type: "decimal", required: true },
      { name: "payment_mode", label: "Payment Mode", type: "string" },
      { name: "expense_date", label: "Expense Date", type: "date" }
    ]
  },
  notification: {
    key: "notification",
    table: "notification",
    label: "Notification",
    primaryKey: ["notification_id"],
    defaultSort: "notification_id",
    columns: [
      { name: "notification_id", label: "Notification ID", type: "number", autoIncrement: true },
      { name: "title", label: "Title", type: "string", required: true },
      { name: "message", label: "Message", type: "text", required: true },
      { name: "timestamp", label: "Timestamp", type: "datetime" },
      { name: "status", label: "Status", type: "string" }
    ]
  },
  category: {
    key: "category",
    table: "category",
    label: "Category",
    primaryKey: ["category_id"],
    defaultSort: "category_id",
    columns: [
      { name: "category_id", label: "Category ID", type: "number", autoIncrement: true },
      { name: "category_name", label: "Category Name", type: "string", required: true },
      { name: "description", label: "Description", type: "text" }
    ]
  },
  ai_recommendation: {
    key: "ai_recommendation",
    table: "ai_recommendation",
    label: "AI Recommendation",
    primaryKey: ["recommendation_id"],
    defaultSort: "recommendation_id",
    columns: [
      { name: "recommendation_id", label: "Recommendation ID", type: "number", autoIncrement: true },
      { name: "type", label: "Type", type: "string" },
      { name: "description", label: "Description", type: "text" },
      { name: "data_used", label: "Data Used", type: "string" },
      { name: "status", label: "Status", type: "string" },
      { name: "business_id", label: "Business ID", type: "number", required: true },
      { name: "suggestion", label: "Suggestion", type: "text" },
      { name: "confidence_score", label: "Confidence Score", type: "decimal" }
    ]
  },
  voice_command: {
    key: "voice_command",
    table: "voice_command",
    label: "Voice Command",
    primaryKey: ["command_id"],
    defaultSort: "command_id",
    columns: [
      { name: "command_id", label: "Command ID", type: "number", autoIncrement: true },
      { name: "audio_file", label: "Audio File", type: "string" },
      { name: "command_text", label: "Command Text", type: "text", required: true },
      { name: "command_type", label: "Command Type", type: "string" },
      { name: "created_time", label: "Created Time", type: "datetime" }
    ]
  },
  voice_response: {
    key: "voice_response",
    table: "voice_response",
    label: "Voice Response",
    primaryKey: ["response_id"],
    defaultSort: "response_id",
    columns: [
      { name: "response_id", label: "Response ID", type: "number", autoIncrement: true },
      { name: "response_text", label: "Response Text", type: "text", required: true },
      { name: "audio_file", label: "Audio File", type: "string" },
      { name: "generated_time", label: "Generated Time", type: "datetime" }
    ]
  },
  language: {
    key: "language",
    table: "language",
    label: "Language",
    primaryKey: ["language_id"],
    defaultSort: "language_id",
    columns: [
      { name: "language_id", label: "Language ID", type: "number", autoIncrement: true },
      { name: "language_name", label: "Language Name", type: "string", required: true },
      { name: "script", label: "Script", type: "string" }
    ]
  },
  translation: {
    key: "translation",
    table: "translation",
    label: "Translation",
    primaryKey: ["translation_id"],
    defaultSort: "translation_id",
    columns: [
      { name: "translation_id", label: "Translation ID", type: "number", autoIncrement: true },
      { name: "language_id", label: "Language ID", type: "number", required: true },
      { name: "original_text", label: "Original Text", type: "text", required: true },
      { name: "translated_text", label: "Translated Text", type: "text", required: true },
      { name: "context", label: "Context", type: "string" }
    ]
  }
};

export const ENTITY_LIST = Object.values(ENTITIES).sort((a, b) => a.label.localeCompare(b.label));

export const getEntity = (entityKey: string): EntityDefinition | undefined => ENTITIES[entityKey];
