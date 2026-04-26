CREATE DATABASE IF NOT EXISTS MicroBusinessDB;
USE MicroBusinessDB;

CREATE TABLE IF NOT EXISTS entrepreneur (
  entrepreneur_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone_no VARCHAR(15) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  address TEXT,
  registration_date DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS business (
  business_id INT AUTO_INCREMENT PRIMARY KEY,
  entrepreneur_id INT NOT NULL,
  business_name VARCHAR(100) NOT NULL,
  business_type VARCHAR(50) NOT NULL,
  start_date DATE,
  gst_number VARCHAR(50),
  CONSTRAINT fk_business_entrepreneur
    FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneur(entrepreneur_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  phone_no VARCHAR(15) NOT NULL,
  email VARCHAR(100),
  address TEXT,
  loyalty_points INT DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS supplier (
  supplier_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  phone_no VARCHAR(15) NOT NULL,
  email VARCHAR(100),
  address TEXT,
  rating INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  brand VARCHAR(50),
  cost_price DECIMAL(10,2),
  unit_price DECIMAL(10,2) NOT NULL,
  expiry_date DATE,
  reorder_level INT DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory (
  product_id INT PRIMARY KEY,
  stock_quantity INT NOT NULL DEFAULT 0,
  location VARCHAR(100),
  status VARCHAR(50),
  last_updated DATE,
  CONSTRAINT fk_inventory_product
    FOREIGN KEY (product_id) REFERENCES product(product_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_date DATE NOT NULL,
  order_status VARCHAR(50),
  discount DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2),
  tax DECIMAL(10,2) DEFAULT 0,
  delivery_mode VARCHAR(50),
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_item (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  sub_total DECIMAL(10,2),
  PRIMARY KEY (order_id, product_id),
  CONSTRAINT fk_order_item_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_order_item_product
    FOREIGN KEY (product_id) REFERENCES product(product_id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  payment_date DATE,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50),
  amount_paid DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_payment_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS purchase (
  purchase_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  purchase_date DATE NOT NULL,
  total_cost DECIMAL(10,2),
  invoice_no VARCHAR(50),
  status VARCHAR(50),
  CONSTRAINT fk_purchase_supplier
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS purchase_item (
  purchase_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  sub_total DECIMAL(10,2),
  PRIMARY KEY (purchase_id, product_id),
  CONSTRAINT fk_purchase_item_purchase
    FOREIGN KEY (purchase_id) REFERENCES purchase(purchase_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_purchase_item_product
    FOREIGN KEY (product_id) REFERENCES product(product_id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS expense (
  expense_id INT AUTO_INCREMENT PRIMARY KEY,
  expense_type VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_mode VARCHAR(50),
  expense_date DATE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notification (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  timestamp DATETIME,
  status VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS category (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  description TEXT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ai_recommendation (
  recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50),
  description TEXT,
  data_used VARCHAR(100),
  status VARCHAR(50),
  business_id INT NOT NULL,
  suggestion TEXT,
  confidence_score DECIMAL(5,2),
  CONSTRAINT fk_ai_recommendation_business
    FOREIGN KEY (business_id) REFERENCES business(business_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS voice_command (
  command_id INT AUTO_INCREMENT PRIMARY KEY,
  audio_file VARCHAR(100),
  command_text TEXT NOT NULL,
  command_type VARCHAR(50),
  created_time DATETIME
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS voice_response (
  response_id INT AUTO_INCREMENT PRIMARY KEY,
  response_text TEXT NOT NULL,
  audio_file VARCHAR(100),
  generated_time DATETIME
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS language (
  language_id INT AUTO_INCREMENT PRIMARY KEY,
  language_name VARCHAR(50) NOT NULL,
  script VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS translation (
  translation_id INT AUTO_INCREMENT PRIMARY KEY,
  language_id INT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  context VARCHAR(100),
  CONSTRAINT fk_translation_language
    FOREIGN KEY (language_id) REFERENCES language(language_id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;
