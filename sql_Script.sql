USE FootwareApp_Dev;
GO

-- SELECT * FROM customer;
--SELECT * FROM sys.tables
SELECT * FROM product

SELECT * FROM [Customer];
SELECT * FROM [Cart];
SELECT * FROM [Product];
SELECT * FROM [Cart_item];
SELECT * FROM [Payment];
SELECT * FROM [AuditLog];

-- For Customer
SELECT * FROM [Customer] where cart_id in (SELECT cart_id FROM [Cart]) and cart_id = 'Q3jpDB'
/*
customer_id	name	email	password	address	pincode	phone_number	cart_id	role	created_on	isactive
RskcsD	Shubham Jadhav	shubham.dev@devcorner.co.in	$2b$10$QWHph3fi41.rnXjtnjmTAOOlsTJ0bENShOf.4TKeYSreTA6.z1tpO	49, Temple Street, MI Road, Jaipur, India	302001	+91990373015	Q3jpDB	admin	2025-10-06 12:52:09.700	1
*/
-- For Cart
SELECT * FROM [Cart] where cart_id in (SELECT cart_id FROM [Customer] where cart_id = 'Q3jpDB')
/*
cart_id	created_on	isactive
Q3jpDB	2025-10-06 12:52:09.690	1
*/

-- Fetching Cart Items with Products
SELECT
	p.product_name, p.product_company, c.cart_quantity, p.cost,
	p.image, p.color, c.product_id, c.cart_id
FROM Product p
JOIN Cart_item c ON p.product_id = c.product_id
WHERE c.cart_id = 'Q3jpDB' AND c.purchased = 'NO'
/*
product_name	product_company	cart_quantity	cost	image	color	product_id	cart_id
Air Boots	Puma	2	1619	http://localhost:8065/uploads/footware_assets_21.jfif	Green	2ZMag4	Q3jpDB
Classic Sandals	Bata	4	2703	http://localhost:8065/uploads/94490874_9971468.jpg	Red	F9A55F	Q3jpDB
*/




select * from Cart_item where cart_id = 'xmd5gu'



SELECT
  (SELECT COUNT(*) FROM Customer WHERE isactive = 1) AS customer,
  (SELECT COUNT(*) FROM Product WHERE isactive = 1) AS product,
  (SELECT COUNT(*) FROM Payment WHERE isactive = 1) AS payment,
  (SELECT ISNULL(SUM(total), 0) FROM Payment WHERE isactive = 1) AS total

select * from product

