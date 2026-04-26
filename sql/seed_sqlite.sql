INSERT INTO entrepreneur VALUES
  (1, 'Kavya', '9876543210', 'kavya@gmail.com', 'pass', 'Chennai', '2024-01-01'),
  (2, 'Utshav', '9876543211', 'utshav@gmail.com', 'pass', 'Bangalore', '2024-01-02'),
  (3, 'Barath', '9876543212', 'barath@gmail.com', 'pass', 'Madurai', '2024-01-03'),
  (4, 'Surya', '9876543213', 'surya@gmail.com', 'pass', 'Hyderabad', '2024-01-04'),
  (5, 'Abhi', '9876543214', 'abhi@gmail.com', 'pass', 'Coimbatore', '2024-01-05');

INSERT INTO business VALUES
  (1, 1, 'Kavya Mart', 'Retail', '2024-02-01', 'GST101'),
  (2, 2, 'Utshav Stores', 'Wholesale', '2024-02-02', 'GST102'),
  (3, 3, 'Barath Traders', 'Retail', '2024-02-03', 'GST103'),
  (4, 4, 'Surya Enterprises', 'Wholesale', '2024-02-04', 'GST104'),
  (5, 5, 'Abhi Supermarket', 'Retail', '2024-02-05', 'GST105');

INSERT INTO customer VALUES
  (1, 'Ramya', '9001111111', 'ramya@gmail.com', 'Chennai', 20),
  (2, 'Kavya', '9002222222', 'kavya_cust@gmail.com', 'Bangalore', 15),
  (3, 'Utshav', '9003333333', 'utshav_cust@gmail.com', 'Madurai', 18),
  (4, 'Barath', '9004444444', 'barath_cust@gmail.com', 'Hyderabad', 25),
  (5, 'Surya', '9005555555', 'surya_cust@gmail.com', 'Coimbatore', 30);

INSERT INTO supplier VALUES
  (1, 'Kavya Supplies', 'Kavya', '8001111111', 'kavya_sup@gmail.com', 'Salem', 5),
  (2, 'Utshav Traders', 'Utshav', '8002222222', 'utshav_sup@gmail.com', 'Erode', 4),
  (3, 'Barath Distributors', 'Barath', '8003333333', 'barath_sup@gmail.com', 'Trichy', 5),
  (4, 'Surya Wholesale', 'Surya', '8004444444', 'surya_sup@gmail.com', 'Vellore', 3),
  (5, 'Abhi Suppliers', 'Abhi', '8005555555', 'abhi_sup@gmail.com', 'Tirunelveli', 4);

INSERT INTO product VALUES
  (101, 'Rice', 'IndiaGate', 45, 60, '2026-01-01', 10),
  (102, 'Oil', 'Fortune', 90, 120, '2026-02-01', 8),
  (103, 'Sugar', 'Parry', 35, 50, '2026-03-01', 7),
  (104, 'Salt', 'Aashirvaad', 12, 20, '2026-04-01', 5),
  (105, 'Milk', 'Aavin', 25, 35, '2026-05-01', 6);

INSERT INTO inventory VALUES
  (101, 100, 'Warehouse-A', 'OK', '2025-01-01'),
  (102, 80, 'Warehouse-A', 'OK', '2025-01-02'),
  (103, 60, 'Warehouse-B', 'LOW', '2025-01-03'),
  (104, 50, 'Warehouse-B', 'OK', '2025-01-04'),
  (105, 70, 'Warehouse-C', 'OK', '2025-01-05');

INSERT INTO orders VALUES
  (1, 1, '2025-02-01', 'Placed', 5, 120, 10, 'Online'),
  (2, 2, '2025-02-02', 'Shipped', 0, 240, 20, 'Offline'),
  (3, 3, '2025-02-03', 'Delivered', 10, 180, 15, 'Online'),
  (4, 4, '2025-02-04', 'Placed', 0, 300, 25, 'Offline'),
  (5, 5, '2025-02-05', 'Cancelled', 0, 150, 10, 'Online');

INSERT INTO order_item VALUES
  (1, 101, 2, 60, 120),
  (2, 102, 2, 120, 240),
  (3, 103, 3, 50, 150),
  (4, 104, 5, 20, 100),
  (5, 105, 4, 35, 140);

INSERT INTO payment VALUES
  (1, 1, '2025-02-01', 'UPI', 'Completed', 120),
  (2, 2, '2025-02-02', 'Card', 'Completed', 240),
  (3, 3, '2025-02-03', 'Cash', 'Completed', 180),
  (4, 4, '2025-02-04', 'UPI', 'Pending', 300),
  (5, 5, '2025-02-05', 'Card', 'Failed', 150);

INSERT INTO purchase VALUES
  (1, 1, '2025-01-10', 500, 'INV1001', 'Completed'),
  (2, 2, '2025-01-11', 600, 'INV1002', 'Completed'),
  (3, 3, '2025-01-12', 700, 'INV1003', 'Completed'),
  (4, 4, '2025-01-13', 800, 'INV1004', 'Pending'),
  (5, 5, '2025-01-14', 900, 'INV1005', 'Completed');

INSERT INTO purchase_item VALUES
  (1, 101, 10, 45, 450),
  (2, 102, 8, 90, 720),
  (3, 103, 12, 35, 420),
  (4, 104, 20, 12, 240),
  (5, 105, 15, 25, 375);

INSERT INTO expense VALUES
  (1, 'Rent', 15000, 'Bank', '2025-01-01'),
  (2, 'Electricity', 3000, 'UPI', '2025-01-02'),
  (3, 'Transport', 2000, 'Cash', '2025-01-03'),
  (4, 'Salary', 25000, 'Bank', '2025-01-04'),
  (5, 'Maintenance', 3500, 'UPI', '2025-01-05');

INSERT INTO notification VALUES
  (1, 'Stock Alert', 'Low stock', '2025-02-01 10:00:00', 'No'),
  (2, 'Order Update', 'Order shipped', '2025-02-02 11:00:00', 'Yes'),
  (3, 'Payment Alert', 'Payment pending', '2025-02-03 12:00:00', 'No'),
  (4, 'New Order', 'Order received', '2025-02-04 01:00:00', 'Yes'),
  (5, 'Reminder', 'Check inventory', '2025-02-05 02:00:00', 'No');

INSERT INTO category VALUES
  (1, 'Grains', 'Food items'),
  (2, 'Oils', 'Cooking oils'),
  (3, 'Dairy', 'Milk products'),
  (4, 'Spices', 'Masala items'),
  (5, 'Others', 'Misc');

INSERT INTO ai_recommendation VALUES
  (1, 'Restock', 'Low stock', 'Data1', 'Active', 1, 'Order more', 0.91),
  (2, 'Pricing', 'High demand', 'Data2', 'Active', 2, 'Increase price', 0.85),
  (3, 'Discount', 'Slow sales', 'Data3', 'Active', 3, 'Give discount', 0.80),
  (4, 'Expand', 'New area', 'Data4', 'Active', 4, 'Open branch', 0.88),
  (5, 'Reduce', 'Low profit', 'Data5', 'Active', 5, 'Reduce cost', 0.75);

INSERT INTO voice_command VALUES
  (1, 'cmd1.mp3', 'Show sales', 'Query', '2025-02-01 10:00:00'),
  (2, 'cmd2.mp3', 'Add product', 'Insert', '2025-02-02 11:00:00'),
  (3, 'cmd3.mp3', 'Check stock', 'Query', '2025-02-03 12:00:00'),
  (4, 'cmd4.mp3', 'Delete item', 'Delete', '2025-02-04 01:00:00'),
  (5, 'cmd5.mp3', 'Update price', 'Update', '2025-02-05 02:00:00');

INSERT INTO voice_response VALUES
  (1, 'Sales shown', 'resp1.mp3', '2025-02-01 10:01:00'),
  (2, 'Product added', 'resp2.mp3', '2025-02-02 11:01:00'),
  (3, 'Stock displayed', 'resp3.mp3', '2025-02-03 12:01:00'),
  (4, 'Item deleted', 'resp4.mp3', '2025-02-04 01:01:00'),
  (5, 'Price updated', 'resp5.mp3', '2025-02-05 02:01:00');

INSERT INTO language VALUES
  (1, 'English', 'Latin'),
  (2, 'Tamil', 'Dravidian'),
  (3, 'Hindi', 'Devanagari'),
  (4, 'Telugu', 'Telugu'),
  (5, 'Malayalam', 'Malayalam');

INSERT INTO translation VALUES
  (1, 1, 'Hello', 'Hello', 'General'),
  (2, 2, 'Hello', 'Vanakkam', 'Greeting'),
  (3, 3, 'Hello', 'Namaste', 'Greeting'),
  (4, 4, 'Hello', 'Namaskaram', 'Greeting'),
  (5, 5, 'Hello', 'Namaskaram', 'Greeting');

INSERT INTO customer VALUES
  (6, 'Meena', '9006666666', 'meena@gmail.com', 'Trichy', 10),
  (7, 'Ravi', '9007777777', 'ravi@gmail.com', 'Salem', 12),
  (8, 'Kumar', '9008888888', 'kumar@gmail.com', 'Erode', 14),
  (9, 'Divya', '9009999999', 'divya@gmail.com', 'Chennai', 8),
  (10, 'Sanjay', '9010000000', 'sanjay@gmail.com', 'Madurai', 22);

INSERT INTO supplier VALUES
  (6, 'Fresh Fields', 'Nila', '8011111111', 'fresh@gmail.com', 'Chennai', 4),
  (7, 'Daily Needs Co', 'Arun', '8012222222', 'daily@gmail.com', 'Bangalore', 5);

INSERT INTO product VALUES
  (106, 'Tea Powder', 'Tata', 110, 145, '2026-06-01', 12),
  (107, 'Wheat Flour', 'Aashirvaad', 38, 55, '2026-08-01', 10),
  (108, 'Soap', 'Lux', 22, 32, '2027-01-01', 20),
  (109, 'Biscuits', 'Parle', 8, 12, '2026-12-01', 30),
  (110, 'Dal', '24Mantra', 70, 95, '2026-09-01', 14);

INSERT INTO inventory VALUES
  (106, 90, 'Warehouse-C', 'OK', '2025-02-01'),
  (107, 120, 'Warehouse-A', 'OK', '2025-02-01'),
  (108, 18, 'Warehouse-B', 'LOW', '2025-02-01'),
  (109, 25, 'Warehouse-C', 'LOW', '2025-02-01'),
  (110, 140, 'Warehouse-A', 'OK', '2025-02-01');

INSERT INTO orders VALUES
  (6, 6, '2025-02-06', 'Delivered', 5, 340, 25, 'Online'),
  (7, 7, '2025-02-07', 'Delivered', 0, 190, 12, 'Offline'),
  (8, 8, '2025-02-08', 'Shipped', 3, 260, 18, 'Online'),
  (9, 9, '2025-02-09', 'Placed', 0, 420, 30, 'Offline'),
  (10, 10, '2025-02-10', 'Delivered', 7, 310, 20, 'Online'),
  (11, 6, '2025-03-02', 'Delivered', 0, 275, 15, 'Online'),
  (12, 7, '2025-03-04', 'Cancelled', 0, 95, 8, 'Offline'),
  (13, 8, '2025-03-06', 'Delivered', 5, 460, 30, 'Online'),
  (14, 9, '2025-03-08', 'Shipped', 2, 230, 16, 'Offline'),
  (15, 10, '2025-03-11', 'Placed', 0, 180, 11, 'Online');

INSERT INTO order_item VALUES
  (6, 101, 3, 60, 180),
  (6, 106, 1, 145, 145),
  (7, 109, 8, 12, 96),
  (7, 105, 2, 35, 70),
  (8, 102, 1, 120, 120),
  (8, 107, 2, 55, 110),
  (9, 110, 3, 95, 285),
  (9, 106, 1, 145, 145),
  (10, 103, 4, 50, 200),
  (10, 108, 3, 32, 96),
  (11, 101, 2, 60, 120),
  (11, 109, 10, 12, 120),
  (12, 104, 4, 20, 80),
  (13, 110, 2, 95, 190),
  (13, 102, 2, 120, 240),
  (14, 107, 3, 55, 165),
  (14, 105, 1, 35, 35),
  (15, 109, 12, 12, 144);

INSERT INTO payment VALUES
  (6, 6, '2025-02-06', 'UPI', 'Completed', 340),
  (7, 7, '2025-02-07', 'Cash', 'Completed', 190),
  (8, 8, '2025-02-08', 'Card', 'Pending', 260),
  (9, 9, '2025-02-09', 'UPI', 'Pending', 420),
  (10, 10, '2025-02-10', 'Card', 'Completed', 310),
  (11, 11, '2025-03-02', 'UPI', 'Completed', 275),
  (12, 12, '2025-03-04', 'Cash', 'Failed', 95),
  (13, 13, '2025-03-06', 'Card', 'Completed', 460),
  (14, 14, '2025-03-08', 'UPI', 'Completed', 230),
  (15, 15, '2025-03-11', 'Cash', 'Pending', 180);

INSERT INTO expense VALUES
  (6, 'Internet', 1200, 'UPI', '2025-01-06'),
  (7, 'Packing', 1800, 'Cash', '2025-01-08'),
  (8, 'Cooling', 2400, 'Bank', '2025-01-10');

INSERT INTO notification VALUES
  (6, 'Demand Spike', 'Rice sales increased this week', '2025-02-10 11:30:00', 'No'),
  (7, 'Low Stock', 'Soap stock is below reorder level', '2025-02-11 09:15:00', 'No');

INSERT INTO ai_recommendation VALUES
  (6, 'Bundle', 'Combine tea and biscuits', 'Data6', 'Active', 1, 'Offer combo packs', 0.83),
  (7, 'Stock', 'Soap demand rising', 'Data7', 'Active', 2, 'Increase purchase volume', 0.87);

INSERT INTO voice_command VALUES
  (6, 'cmd6.mp3', 'Open customer', 'Query', '2025-02-06 10:00:00'),
  (7, 'cmd7.mp3', 'Add customer', 'Insert', '2025-02-07 11:00:00');

INSERT INTO voice_response VALUES
  (6, 'Customer section opened', 'resp6.mp3', '2025-02-06 10:01:00'),
  (7, 'Customer added', 'resp7.mp3', '2025-02-07 11:01:00');
