    CREATE TABLE Cart
    (
        cart_id VARCHAR(7) NOT NULL,
        PRIMARY KEY(cart_id)
    );

    CREATE TABLE Customer
    (
        customer_id VARCHAR(7) NOT NULL,
        name VARCHAR(20) NOT NULL,
        email VARCHAR(30) NOT NULL,
        password VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        pincode INTEGER NOT NULL,
        phone_number varchar(12) NOT NULL,
        PRIMARY KEY (customer_id),
        cart_id VARCHAR(7) NOT NULL,
        role varchar(6) default "user",
        FOREIGN KEY(cart_id) REFERENCES cart(cart_id)
    );



    CREATE TABLE Payment
    (
        payment_id VARCHAR(10) NOT NULL,
        payment_date DATE NOT NULL,
        payment_type VARCHAR(10) NOT NULL,
        customer_id VARCHAR(6) NOT NULL,
        cart_id VARCHAR(7) NOT NULL,
        PRIMARY KEY (payment_id),
        FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
        FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
        total_amount integer
    );

    CREATE TABLE Product
    (
        product_id VARCHAR(10) NOT NULL,
        product_name VARCHAR(20) NOT NULL,
        product_company VARCHAR(20) NOT NULL,
        color VARCHAR(10) NOT NULL,
        size integer NOT NULL,
        gender CHAR(1) NOT NULL,
        cost integer NOT NULL,
        quantity integer NOT NULL,
        PRIMARY KEY (Product_id),
        image text NOT NULL
    );

    CREATE TABLE Cart_item
    (
        cart_quantity INTEGER NOT NULL,
        date_added DATE NOT NULL,
        cart_id VARCHAR(7) NOT NULL,
        product_id VARCHAR(10) NOT NULL,
        FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
        FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE,
        Primary key(cart_id,product_id),
        purchased varchar(3) default 'NO'
    );


ENDPOINTS

BASE - http://localhost:3000/api/v1
Customer - /customer/register  - register user
         - /customer/login     - login user
         - /customer           - get all users

Products - /products           - get all products
         - /products           - create product
         - /products/1         - get single product
         - /products/1         - update product
         - /products/1         - delete product

Payment  - /payment            - get all payments that are completed
         - /payment            - create payment

Length Of Id's

product_id - 4
cart_id - 5
customer_id - 6
payment_id - 7