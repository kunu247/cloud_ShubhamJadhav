// File name: sql
// File name with extension: sql.js
// Full path: E:\cloud_ShubhamJadhav\sql.js
// Directory: E:\cloud_ShubhamJadhav

const mysql = require("mysql2");

// Create connection
const connection = mysql.createConnection({
  host: "junction.proxy.rlwy.net",
  user: "root",
  password: "BgXIoEPDfEIjjSHgTEuHIkIPDJbqDOho",
  database: "railway",
  port: "38945"
});
// mysql://root:BgXIoEPDfEIjjSHgTEuHIkIPDJbqDOho@junction.proxy.rlwy.net:38945/railway
// Fetch all tables

// "CREATE TABLE Customer (customer_id VARCHAR(7) NOT NULL, name VARCHAR(20) NOT NULL, email VARCHAR(30) NOT NULL, password VARCHAR(20) NOT NULL, address TEXT NOT NULL, pincode INTEGER NOT NULL, phone_number VARCHAR(12) NOT NULL, PRIMARY KEY (customer_id), cart_id VARCHAR(7) NOT NULL, role VARCHAR(6) DEFAULT 'user', FOREIGN KEY(cart_id) REFERENCES Cart(cart_id));"

// "CREATE TABLE Payment (payment_id VARCHAR(10) NOT NULL, payment_date DATE NOT NULL, payment_type VARCHAR(10) NOT NULL, customer_id VARCHAR(6) NOT NULL, cart_id VARCHAR(7) NOT NULL, PRIMARY KEY (payment_id), FOREIGN KEY (customer_id) REFERENCES Customer(customer_id), FOREIGN KEY (cart_id) REFERENCES Cart(cart_id), total_amount INTEGER);"

// "CREATE TABLE Product (product_id VARCHAR(10) NOT NULL, product_name VARCHAR(20) NOT NULL, product_company VARCHAR(20) NOT NULL, color VARCHAR(10) NOT NULL, size INTEGER NOT NULL, gender CHAR(1) NOT NULL, cost INTEGER NOT NULL, quantity INTEGER NOT NULL, PRIMARY KEY (product_id), image TEXT NOT NULL);"

// "CREATE TABLE Cart_item (cart_quantity INTEGER NOT NULL, date_added DATE NOT NULL, cart_id VARCHAR(7) NOT NULL, product_id VARCHAR(10) NOT NULL, FOREIGN KEY (cart_id) REFERENCES Cart(cart_id), FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE, PRIMARY KEY(cart_id, product_id), purchased VARCHAR(3) DEFAULT 'NO');"

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");

  const addTable =
    "CREATE TABLE Cart_item (cart_quantity INTEGER NOT NULL, date_added DATE NOT NULL, cart_id VARCHAR(7) NOT NULL, product_id VARCHAR(10) NOT NULL, FOREIGN KEY (cart_id) REFERENCES Cart(cart_id), FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE, PRIMARY KEY(cart_id, product_id), purchased VARCHAR(3) DEFAULT 'NO');";
  connection.query(addTable, (err, result) => {
    if (err) throw err;
    console.log("Table added successfully!");
    connection.end();
  });

  connection.query("SHOW TABLES", (err, result) => {
    if (err) throw err;
    console.log("Tables in Database:");
    console.log(result);
    connection.end();
  });
});
