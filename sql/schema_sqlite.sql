PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS translation;
DROP TABLE IF EXISTS language;
DROP TABLE IF EXISTS voice_response;
DROP TABLE IF EXISTS voice_command;
DROP TABLE IF EXISTS ai_recommendation;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS expense;
DROP TABLE IF EXISTS purchase_item;
DROP TABLE IF EXISTS purchase;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS supplier;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS business;
DROP TABLE IF EXISTS entrepreneur;

PRAGMA foreign_keys = ON;

CREATE TABLE entrepreneur (
  entrepreneur_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone_no TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  address TEXT,
  registration_date TEXT NOT NULL
);

CREATE TABLE business (
  business_id INTEGER PRIMARY KEY AUTOINCREMENT,
  entrepreneur_id INTEGER NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  start_date TEXT,
  gst_number TEXT,
  FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneur (entrepreneur_id) ON DELETE CASCADE
);

CREATE TABLE customer (
  customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  phone_no TEXT NOT NULL,
  email TEXT,
  address TEXT,
  loyalty_points INTEGER DEFAULT 0
);

CREATE TABLE supplier (
  supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_name TEXT NOT NULL,
  contact_person TEXT,
  phone_no TEXT NOT NULL,
  email TEXT,
  address TEXT,
  rating INTEGER
);

CREATE TABLE product (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name TEXT NOT NULL,
  brand TEXT,
  cost_price REAL,
  unit_price REAL NOT NULL,
  expiry_date TEXT,
  reorder_level INTEGER DEFAULT 0
);

CREATE TABLE inventory (
  product_id INTEGER PRIMARY KEY,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  location TEXT,
  status TEXT,
  last_updated TEXT,
  FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE CASCADE
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  order_status TEXT,
  discount REAL DEFAULT 0,
  net_amount REAL,
  tax REAL DEFAULT 0,
  delivery_mode TEXT,
  FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON DELETE RESTRICT
);

CREATE TABLE order_item (
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  sub_total REAL,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE RESTRICT
);

CREATE TABLE payment (
  payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  payment_date TEXT,
  payment_method TEXT,
  payment_status TEXT,
  amount_paid REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
);

CREATE TABLE purchase (
  purchase_id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  purchase_date TEXT NOT NULL,
  total_cost REAL,
  invoice_no TEXT,
  status TEXT,
  FOREIGN KEY (supplier_id) REFERENCES supplier (supplier_id) ON DELETE RESTRICT
);

CREATE TABLE purchase_item (
  purchase_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  cost_price REAL NOT NULL,
  sub_total REAL,
  PRIMARY KEY (purchase_id, product_id),
  FOREIGN KEY (purchase_id) REFERENCES purchase (purchase_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE RESTRICT
);

CREATE TABLE expense (
  expense_id INTEGER PRIMARY KEY AUTOINCREMENT,
  expense_type TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_mode TEXT,
  expense_date TEXT
);

CREATE TABLE notification (
  notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT,
  status TEXT
);

CREATE TABLE category (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE ai_recommendation (
  recommendation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT,
  description TEXT,
  data_used TEXT,
  status TEXT,
  business_id INTEGER NOT NULL,
  suggestion TEXT,
  confidence_score REAL,
  FOREIGN KEY (business_id) REFERENCES business (business_id) ON DELETE CASCADE
);

CREATE TABLE voice_command (
  command_id INTEGER PRIMARY KEY AUTOINCREMENT,
  audio_file TEXT,
  command_text TEXT NOT NULL,
  command_type TEXT,
  created_time TEXT
);

CREATE TABLE voice_response (
  response_id INTEGER PRIMARY KEY AUTOINCREMENT,
  response_text TEXT NOT NULL,
  audio_file TEXT,
  generated_time TEXT
);

CREATE TABLE language (
  language_id INTEGER PRIMARY KEY AUTOINCREMENT,
  language_name TEXT NOT NULL,
  script TEXT
);

CREATE TABLE translation (
  translation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  language_id INTEGER NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  context TEXT,
  FOREIGN KEY (language_id) REFERENCES language (language_id) ON DELETE RESTRICT
);
