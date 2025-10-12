# SQL Create Queries:

```sql
USE FootwareApp_Dev
CREATE TABLE Cart (
    cart_id VARCHAR(7) PRIMARY KEY,
    created_on DATETIME NULL DEFAULT(GETDATE()),
    isactive BIT NULL DEFAULT(1)
);
CREATE TABLE Customer (
    customer_id VARCHAR(7) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL,
    email NVARCHAR(50) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    address NVARCHAR(MAX) NOT NULL,
    pincode INT NOT NULL,
    phone_number NVARCHAR(15) NOT NULL,
    cart_id VARCHAR(7) NOT NULL,
    role NVARCHAR(10) DEFAULT 'user',
    created_on DATETIME NULL DEFAULT(GETDATE()),
    isactive BIT NULL DEFAULT(1),
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id)
);
CREATE TABLE Product (
    product_id VARCHAR(10) PRIMARY KEY,
    product_name NVARCHAR(50) NOT NULL,
    product_company NVARCHAR(50) NOT NULL,
    color NVARCHAR(20),
    size INT,
    gender CHAR(1),
    cost INT,
    quantity INT,
    image NVARCHAR(MAX),
    created_on DATETIME NULL DEFAULT(GETDATE()),
    isactive BIT NULL DEFAULT(1)
);
CREATE TABLE Cart_item (
    cart_id VARCHAR(7) NOT NULL,
    product_id VARCHAR(10) NOT NULL,
    cart_quantity INT NOT NULL,
    date_added DATE NOT NULL,
    purchased NVARCHAR(10) DEFAULT 'NO',
    created_on DATETIME NULL DEFAULT(GETDATE()),
    isactive BIT NULL DEFAULT(1),
    PRIMARY KEY (cart_id, product_id),
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);
CREATE TABLE Payment (
    payment_id VARCHAR(10) PRIMARY KEY,
    payment_date DATE NOT NULL,
    payment_type NVARCHAR(20),
    customer_id VARCHAR(7),
    cart_id VARCHAR(7),
    product_ids NVARCHAR(MAX),
    total_amount INT,
    created_on DATETIME NULL DEFAULT(GETDATE()),
    isactive BIT NULL DEFAULT(1),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id)
);
CREATE TABLE AuditLog (
    audit_guid UNIQUEIDENTIFIER NOT NULL
        DEFAULT NEWSEQUENTIALID() PRIMARY KEY,  -- Globally unique, faster than NEWID()

    flag CHAR(3) NOT NULL CHECK (flag IN ('INS', 'UPD', 'DEL', 'SI', 'SO', 'ERR')),
        -- INS = Insert, UPD = Update, DEL = Delete,
        -- SI = Sign In (Login), SO = Sign Out (Logout), ERR = Error

    event_type NVARCHAR(50) NOT NULL,           -- optional human-readable label like 'USER_REGISTER'
    table_name NVARCHAR(100) NULL,              -- which table or module was affected
    record_key NVARCHAR(100) NULL,              -- e.g., product_id, customer_id
    action_by NVARCHAR(100) NULL,               -- user or system actor
    action_details NVARCHAR(MAX) NULL,          -- JSON or description of what happened
    status_ NVARCHAR(20) NULL DEFAULT('SUCCESS'),-- SUCCESS / FAILED
    created_on DATETIME DEFAULT(GETDATE()),     -- time of logging
    isactive BIT DEFAULT(1),

    -- ✅ Computed column: gives a readable one-liner summary for quick viewing
    summary AS
        CONCAT(flag, ' | ', ISNULL(table_name, ''), ' | ', ISNULL(record_key, ''), ' | ', ISNULL(status_, ''))
);
```

globalConfig:

```js
// File name: globalConfig
// File name with extension: globalConfig.js
// Full path: E:\cloud_ShubhamJadhav\shared\globalConfig.js
// Directory: E:\cloud_ShubhamJadhav\shared

// ✅ Detect environment safely across Node.js and Browser
const isBrowser = typeof window !== "undefined";
const isNode = typeof process !== "undefined" && process?.versions?.node;

// 🧠 Safe getter for environment variables (works in both Node.js + Vite)
const getEnv = (key, fallback = undefined) => {
  if (isBrowser && typeof import.meta !== "undefined") {
    return import.meta.env?.[key] ?? fallback;
  }
  if (isNode && process?.env) {
    return process.env[key] ?? fallback;
  }
  return fallback;
};

export const App_Config = {
  APP_NAME: "FootwareApp",
  VERSION: "v2.0.0",
  DEV_MODE:
    getEnv("MODE") === "development" ||
    getEnv("NODE_ENV") === "development" ||
    false,

  // 🌐 Base URLs
  API_URL:
    getEnv("VITE_API_BASE_URL") ||
    getEnv("API_BASE_URL") ||
    "http://localhost:8065/api/v1",

  UPLOAD_URL:
    getEnv("VITE_UPLOAD_URL") ||
    getEnv("UPLOAD_URL") ||
    "http://localhost:8065/uploads",

  // 🔗 Static endpoints
  ENDPOINTS: {
    PRODUCTS: "/products",
    PRODUCT: (id) => `/products/${id}`,
    CART: "/cart",
    CART_BY_ID: (id) => `/cart/${id}`,
    CUSTOMER: "/customer",
    CUSTOMER_ADMIN: "/customer/admin",
    PAYMENT: "/payment",
    LOGIN: "/customer/login",
    REGISTER: "/customer/register"
  },

  // ⚙️ Default settings
  LIMITS: {
    PAGE_SIZE: 10
  },

  // 💾 LocalStorage keys
  STORAGE_KEYS: {
    CUSTOMER: "customer",
    THEME: "theme"
  }
};

// 🌐 Universal helper for consistent API path resolution
export const getApiUrl = (endpoint = "") => {
  const base = App_Config.API_URL.replace(/\/$/, "");
  const clean = endpoint.replace(/^\//, "");
  return `${base}/${clean}`;
};
```

```js
// File name: customerController
// File name with extension: customerController.js
// Full path: E:\cloud_ShubhamJadhav\controllers\customerController.js
// Directory: E:\cloud_ShubhamJadhav\controllers

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { createJWT, attachCookiesToResponse } = require("../utils/jwt");
const {
  getCustomer,
  emailAlreadyExists,
  registerUserFunc,
  loginUserFunc
} = require("../model/customerModel");

exports.getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await getCustomer();
  res
    .status(200)
    .json({ success: true, count: customers.length, data: customers });
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, address, pincode, phone_number, role } =
    req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ success: false, msg: "Required fields missing" });

  const exists = await emailAlreadyExists(email);
  if (exists)
    return res
      .status(400)
      .json({ success: false, msg: "Email already registered" });

  const user = await registerUserFunc({
    name,
    email,
    password,
    address,
    pincode,
    phone_number,
    role
  });

  const tokenPayload = { userId: user.customer_id, role: role || "user" };
  const token = createJWT(tokenPayload);

  res.status(201).json({
    success: true,
    msg: "User registered successfully",
    token,
    data: { ...user, name, email, role }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, msg: "Email and password required" });

  const user = await loginUserFunc(email);
  if (!user)
    return res.status(401).json({ success: false, msg: "Invalid credentials" });

  const validPwd = await bcrypt.compare(password, user.password);
  if (!validPwd)
    return res.status(401).json({ success: false, msg: "Invalid credentials" });

  // ✅ Include cart_id in JWT payload
  const tokenPayload = {
    userId: user.customer_id,
    cartId: user.cart_id,
    role: user.role
  };
  attachCookiesToResponse(res, tokenPayload);

  // ✅ Send a consistent customer structure
  res.status(200).json({
    success: true,
    msg: "Login successful",
    customer: {
      id: user.customer_id,
      name: user.name,
      email: user.email,
      role: user.role,
      cart_id: user.cart_id,
      address: user.address,
      phone_number: user.phone_number
    }
  });
});

exports.getAdminStats = async (req, res) => {
  try {
    const pool = await poolPromise;

    // ✅ Query totals from DB
    const { recordset } = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM Customer WHERE isactive = 1) AS customer,
        (SELECT COUNT(*) FROM Product WHERE isactive = 1) AS product,
        (SELECT COUNT(*) FROM Payment WHERE isactive = 1) AS payment,
        (SELECT ISNULL(SUM(total), 0) FROM Payment WHERE isactive = 1) AS total
    `);

    res.status(200).json({
      success: true,
      msg: "Admin summary fetched successfully",
      data: recordset
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to load admin dashboard data",
      error: error.message
    });
  }
};
// File name: productsController
// File name with extension: productsController.js
// Full path: E:\cloud_ShubhamJadhav\controllers\productsController.js
// Directory: E:\cloud_ShubhamJadhav\controllers

const asyncHandler = require("express-async-handler");
const {
  getAllProductsSql,
  createProductSql,
  getSingleProductsSql,
  deleteProductSql,
  updateProductSql
} = require("../model/productsModel");

exports.getAllProducts = asyncHandler(async (req, res) => {
  const filters = [];
  const { name, company, color, size, gender, cost } = req.query;

  if (name) filters.push(`product_name = '${name}'`);
  if (company) filters.push(`product_company = '${company}'`);
  if (color) filters.push(`color = '${color}'`);
  if (size) filters.push(`size = ${size}`);
  if (gender) filters.push(`gender = '${gender}'`);
  if (cost) filters.push(`cost <= ${cost}`);

  const filterString = filters.length ? "WHERE " + filters.join(" AND ") : "";
  const products = await getAllProductsSql(filterString);

  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const data = await createProductSql(req.body);
  res.status(201).json({ success: true, msg: "Product created", data });
});

exports.getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await getSingleProductsSql(id);
  if (product.length === 0)
    return res.status(404).json({ success: false, msg: "Product not found" });
  res.status(200).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productExists = await getSingleProductsSql(id);
  if (productExists.length === 0)
    return res.status(404).json({ success: false, msg: "Product not found" });

  const updates = Object.entries(req.body)
    .map(([k, v]) => `${k}='${v}'`)
    .join(", ");

  await updateProductSql(id, updates);
  const updated = await getSingleProductsSql(id);
  res
    .status(200)
    .json({ success: true, msg: "Product updated", data: updated });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await getSingleProductsSql(id);
  if (existing.length === 0)
    return res.status(404).json({ success: false, msg: "Product not found" });

  await deleteProductSql(id);
  res.status(200).json({ success: true, msg: "Product deleted" });
});

exports.uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.image)
    return res
      .status(400)
      .json({ success: false, msg: "Please upload an image" });

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image"))
    return res
      .status(400)
      .json({ success: false, msg: "File must be an image" });

  if (productImage.size > 1024 * 1024)
    return res
      .status(400)
      .json({ success: false, msg: "Image must be under 1MB" });

  const imagePath = path.join(
    __dirname,
    "../public/uploads/",
    productImage.name
  );
  await productImage.mv(imagePath);

  res.status(201).json({
    success: true,
    msg: "Image uploaded",
    image: `${process.env.BASE_URL}/uploads/${productImage.name}`
  });
});
// File name: cartController
// File name with extension: cartController.js
// Full path: E:\cloud_ShubhamJadhav\controllers\cartController.js
// Directory: E:\cloud_ShubhamJadhav\controllers

const asyncHandler = require("express-async-handler");
const {
  getAllCartItemsSql,
  createCartItemsSql,
  getSingleCartItemSql,
  updateCartSql,
  deleteCartItemSql
} = require("../model/cartModel");

/* ✅ Get all cart items (admin/debug)  */
exports.getAllCartItems = asyncHandler(async (req, res) => {
  const items = await getAllCartItemsSql();
  return res.status(200).json({
    success: true,
    message: "All cart items retrieved successfully",
    count: items.length,
    data: items
  });
});

/* ✅ Create a new cart item */
exports.createCartItem = asyncHandler(async (req, res) => {
  const { cart_quantity, cart_id, product_id, purchased } = req.body;
  if (!cart_id || !product_id || !cart_quantity)
    return res.status(400).json({ success: false, msg: "Missing fields" });

  const result = await createCartItemsSql(
    cart_quantity,
    cart_id,
    product_id,
    purchased
  );
  res.status(201).json({ success: true, msg: "Cart item added", data: result });
});

/* ✅ Get a single cart (enriched with product details) */
exports.getSingleCart = asyncHandler(async (req, res) => {
  const cartId = req.params.id || req.query.id;

  if (!cartId) {
    return res.status(400).json({
      success: false,
      message: "Missing cart_id parameter"
    });
  }

  const data = await getSingleCartItemSql(cartId);

  if (!data || data.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Your cart is empty",
      count: 0,
      data: []
    });
  }

  return res.status(200).json({
    success: true,
    message: "Cart items retrieved successfully",
    count: data.length,
    cart_id: cartId,
    data
  });
});

exports.updateCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cart_quantity, product_id } = req.body;
  const affected = await updateCartSql(id, cart_quantity, product_id);
  if (affected[0] === 0)
    return res.status(404).json({ success: false, msg: "Cart item not found" });
  res.status(200).json({ success: true, msg: "Cart updated" });
});

exports.deleteCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { product_id } = req.body;
  const deleted = await deleteCartItemSql(id, product_id);
  if (deleted[0] === 0)
    return res.status(404).json({ success: false, msg: "Cart item not found" });
  res.status(200).json({ success: true, msg: "Cart item deleted" });
});
// File name: paymentController
// File name with extension: paymentController.js
// Full path: E:\cloud_ShubhamJadhav\controllers\paymentController.js
// Directory: E:\cloud_ShubhamJadhav\controllers

const asyncHandler = require("express-async-handler");
const {
  getAllpaymentsSql,
  createPaymentSql,
  getSinglePaymentSql
} = require("../model/paymentModel");

exports.getAllPayments = asyncHandler(async (req, res) => {
  const payments = await getAllpaymentsSql();
  res
    .status(200)
    .json({ success: true, count: payments.length, data: payments });
});

exports.createPayment = asyncHandler(async (req, res) => {
  const { payment_type, customer_id, cart_id, total_amount, product_id } =
    req.body;
  if (!payment_type || !customer_id || !cart_id || !total_amount) {
    return res.status(400).json({
      success: false,
      msg: "Missing required payment data"
    });
  }

  // ✅ Normalize product IDs (array or string)
  let productIds = "";
  if (Array.isArray(product_id)) {
    productIds = product_id.join(",");
  } else if (typeof product_id === "string") {
    productIds = product_id;
  }

  const payment = await createPaymentSql(
    payment_type,
    customer_id,
    cart_id,
    total_amount,
    productIds
  );
  res
    .status(201)
    .json({ success: true, msg: "Payment created", data: payment });
});

exports.getSinglePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payment = await getSinglePaymentSql(id);
  if (payment.length === 0)
    return res.status(404).json({ success: false, msg: "Payment not found" });
  res.status(200).json({ success: true, data: payment });
});
```

# Models:


```js
// File name: cartModel
// File name with extension: cartModel.js
// Full path: E:\cloud_ShubhamJadhav\model\cartModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");

/**
 * Cart Item with strongly typed properties
 */
class CartItem {
  constructor(
    cart_id,
    product_id,
    cart_quantity,
    date_added,
    purchased,
    created_on,
    isactive,
    product_name,
    product_company,
    cost,
    image,
    color,
    size
  ) {
    this.cart_id = cart_id;
    this.product_id = product_id;
    this.cart_quantity = cart_quantity;
    this.date_added = date_added;
    this.purchased = purchased;
    this.created_on = created_on;
    this.isactive = isactive;
    this.product_name = product_name;
    this.product_company = product_company;
    this.cost = cost;
    this.image = image;
    this.color = color;
    this.size = size;
  }
}

/**
 * Cart Operation Result
 */
class CartOperationResult {
  constructor(success, data, rowsAffected = 0, error = null) {
    this.success = success;
    this.data = data;
    this.rowsAffected = rowsAffected;
    this.error = error;
  }
}

/**
 * 🧩 Fetch all cart items (for admin/debug)
 */
async function getAllCartItems() {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool.request().execute("usp_GetAllCartItems");

    const cartItems = recordset.map(
      (row) =>
        new CartItem(
          row.cart_id,
          row.product_id,
          row.cart_quantity,
          row.date_added,
          row.purchased,
          row.created_on,
          row.isactive,
          row.product_name,
          row.product_company,
          row.cost,
          row.image,
          row.color,
          row.size
        )
    );

    return new CartOperationResult(true, cartItems, cartItems.length);
  } catch (error) {
    return new CartOperationResult(false, null, 0, error.message);
  }
}

/**
 * 🧠 Fetch all products in a single user's cart
 */
async function getSingleCartItem(cart_id) {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool
      .request()
      .input("cart_id", sql.VarChar(7), cart_id)
      .execute("usp_GetUserCartItems");

    const cartItems = recordset.map(
      (row) =>
        new CartItem(
          row.cart_id,
          row.product_id,
          row.cart_quantity,
          row.date_added,
          row.purchased,
          row.created_on,
          row.isactive,
          row.product_name,
          row.product_company,
          row.cost,
          row.image,
          row.color,
          row.size
        )
    );

    return new CartOperationResult(true, cartItems, cartItems.length);
  } catch (error) {
    return new CartOperationResult(false, null, 0, error.message);
  }
}

/**
 * Create cart item
 */
async function createCartItem(
  cart_quantity,
  cart_id,
  product_id,
  purchased = "NO"
) {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool
      .request()
      .input("cart_quantity", sql.Int, cart_quantity)
      .input("cart_id", sql.VarChar(7), cart_id)
      .input("product_id", sql.VarChar(10), product_id)
      .input("purchased", sql.VarChar(10), purchased)
      .execute("usp_CreateCartItem");

    const result = recordset[0];
    return new CartOperationResult(true, result, 1);
  } catch (error) {
    return new CartOperationResult(false, null, 0, error.message);
  }
}

/**
 * Update cart item quantity
 */
async function updateCart(cart_id, cart_quantity, product_id) {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool
      .request()
      .input("cart_id", sql.VarChar(7), cart_id)
      .input("cart_quantity", sql.Int, cart_quantity)
      .input("product_id", sql.VarChar(10), product_id)
      .execute("usp_UpdateCartItem");

    const rowsAffected = recordset[0]?.rowsAffected || 0;
    return new CartOperationResult(
      true,
      { cart_id, cart_quantity, product_id },
      rowsAffected
    );
  } catch (error) {
    return new CartOperationResult(false, null, 0, error.message);
  }
}

/**
 * Delete cart item
 */
async function deleteCartItem(cart_id, product_id) {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool
      .request()
      .input("cart_id", sql.VarChar(7), cart_id)
      .input("product_id", sql.VarChar(10), product_id)
      .execute("usp_DeleteCartItem");

    const rowsAffected = recordset[0]?.rowsAffected || 0;
    return new CartOperationResult(true, { cart_id, product_id }, rowsAffected);
  } catch (error) {
    return new CartOperationResult(false, null, 0, error.message);
  }
}

module.exports = {
  CartItem,
  CartOperationResult,
  getAllCartItems,
  createCartItem,
  getSingleCartItem,
  updateCart,
  deleteCartItem
};
// File name: customerModel
// File name with extension: customerModel.js
// Full path: E:\cloud_ShubhamJadhav\model\customerModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");
const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcryptjs");

async function getCustomer() {
  const pool = await poolPromise;
  const { recordset } = await pool.request().query("SELECT * FROM Customer");
  return recordset;
}

async function emailAlreadyExists(email) {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("email", sql.VarChar(50), email)
    .query("SELECT email FROM Customer WHERE email = @email");
  return recordset.length > 0;
}

async function registerUserFunc({
  name,
  email,
  password,
  address,
  pincode,
  phone_number,
  role = "user"
}) {
  const pool = await poolPromise;
  const uid = new ShortUniqueId({ length: 6 });
  const customer_id = uid.rnd();
  const hashedPwd = await bcrypt.hash(password, 10);

  // ✅ Ensure cart exists or create one
  let cart_id;
  const existingCart = await pool
    .request()
    .query("SELECT TOP 1 cart_id FROM Cart ORDER BY NEWID()");
  if (existingCart.recordset.length === 0) {
    cart_id = uid.rnd();
    await pool
      .request()
      .input("cart_id", sql.VarChar(7), cart_id)
      .query("INSERT INTO Cart (cart_id) VALUES (@cart_id)");
  } else {
    cart_id = uid.rnd();
    await pool
      .request()
      .input("cart_id", sql.VarChar(7), cart_id)
      .query("INSERT INTO Cart (cart_id) VALUES (@cart_id)");
  }

  // ✅ Insert Customer
  await pool
    .request()
    .input("customer_id", sql.VarChar(7), customer_id)
    .input("name", sql.NVarChar(50), name)
    .input("email", sql.NVarChar(50), email)
    .input("password", sql.NVarChar(255), hashedPwd)
    .input("address", sql.NVarChar(sql.MAX), address)
    .input("pincode", sql.Int, pincode)
    .input("phone_number", sql.NVarChar(15), phone_number)
    .input("cart_id", sql.VarChar(7), cart_id)
    .input("role", sql.NVarChar(10), role).query(`
      INSERT INTO Customer (customer_id, name, email, password, address, pincode, phone_number, cart_id, role)
      VALUES (@customer_id, @name, @email, @password, @address, @pincode, @phone_number, @cart_id, @role)
    `);

  return {
    customer_id,
    cart_id,
    email,
    name,
    role,
    // ⚠ Safe only in development mode — do not expose full hash in production
    ...(process.env.NODE_ENV !== "production"
      ? {
          password_debug: password,
          password_hash_preview: hashedPwd.slice(0, 15) + "..."
        }
      : {})
  };
}

async function loginUserFunc(email) {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("email", sql.VarChar(50), email)
    .query("SELECT * FROM Customer WHERE email = @email");
  return recordset[0];
}

module.exports = {
  getCustomer,
  emailAlreadyExists,
  registerUserFunc,
  loginUserFunc
};
// File name: paymentModel
// File name with extension: paymentModel.js
// Full path: E:\cloud_ShubhamJadhav\model\paymentModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");
const ShortUniqueId = require("short-unique-id");

async function getAllpaymentsSql() {
  const pool = await poolPromise;
  const payments = (await pool.request().query("SELECT * FROM Payment"))
    .recordset;
  const enriched = [];

  for (const p of payments) {
    const [{ names } = {}] = (
      await pool
        .request()
        .input("cart_id", sql.VarChar(7), p.cart_id)
        .input("payment_id", sql.VarChar(10), p.payment_id)
        .query(`SELECT STRING_AGG(product_name, ', ') AS names
              FROM Product WHERE product_id IN (
                SELECT product_id FROM Cart_item
                WHERE cart_id=@cart_id AND purchased=@payment_id)`)
    ).recordset;

    const [{ num } = {}] = (
      await pool
        .request()
        .input("cart_id", sql.VarChar(7), p.cart_id)
        .input("payment_id", sql.VarChar(10), p.payment_id)
        .query(`SELECT SUM(cart_quantity) AS num
              FROM Cart_item WHERE cart_id=@cart_id AND purchased=@payment_id`)
    ).recordset;

    const [{ name, address } = {}] = (
      await pool
        .request()
        .input("customer_id", sql.VarChar(7), p.customer_id)
        .query(
          "SELECT name,address FROM Customer WHERE customer_id=@customer_id"
        )
    ).recordset;

    enriched.push({
      ...p,
      product_names: names || "",
      total_items: num || 0,
      customer_name: name || "",
      address: address || ""
    });
  }
  return enriched;
}

async function createPaymentSql(
  payment_type,
  customer_id,
  cart_id,
  total_amount,
  product_ids = ""
) {
  const pool = await poolPromise;
  const payment_id = new ShortUniqueId({ length: 7 }).rnd();
  const date = new Date().toISOString().split("T")[0];

  if (isNaN(total_amount)) {
    throw new Error(`Invalid total_amount provided: ${total_amount}`);
  }

  // ✅ Insert Payment record
  await pool
    .request()
    .input("payment_id", sql.VarChar(10), payment_id)
    .input("payment_date", sql.Date, date)
    .input("payment_type", sql.VarChar(20), payment_type)
    .input("customer_id", sql.VarChar(7), customer_id)
    .input("cart_id", sql.VarChar(7), cart_id)
    .input("product_ids", sql.NVarChar(sql.MAX), product_ids) // ✅ Added
    .input("total_amount", sql.Decimal(18, 2), total_amount).query(`
      INSERT INTO Payment 
      (payment_id, payment_date, payment_type, customer_id, cart_id, product_ids, total_amount)
      VALUES (@payment_id, @payment_date, @payment_type, @customer_id, @cart_id, @product_ids, @total_amount)
    `);

  // ✅ Update all cart items as purchased
  await pool
    .request()
    .input("cart_id", sql.VarChar(7), cart_id)
    .input("payment_id", sql.VarChar(10), payment_id)
    .query("UPDATE Cart_item SET purchased=@payment_id WHERE cart_id=@cart_id");

  return {
    payment_id,
    payment_date: date,
    total_amount,
    product_ids
  };
}

async function getSinglePaymentSql(cart_id) {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("cart_id", sql.VarChar(7), cart_id)
    .query("SELECT * FROM Payment WHERE cart_id=@cart_id");
  return recordset;
}

module.exports = { getAllpaymentsSql, createPaymentSql, getSinglePaymentSql };
// File name: productsModel
// File name with extension: productsModel.js
// Full path: E:\cloud_ShubhamJadhav\model\productsModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");
const ShortUniqueId = require("short-unique-id");

async function getAllProductsSql(filter = "") {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .query(`SELECT * FROM Product ${filter}`);
  return recordset;
}

async function createProductSql({
  product_name,
  product_company,
  color,
  size,
  gender,
  cost,
  quantity,
  image
}) {
  const pool = await poolPromise;
  const uid = new ShortUniqueId({ length: 6 });
  const product_id = uid.rnd();

  // Validate inputs
  if (!product_name || !product_company || !cost || !quantity) {
    throw new Error("Missing required fields for product creation.");
  }

  // SQL Insert with strict parameterization
  const query = `
    INSERT INTO Product (
      product_id, product_name, product_company, color, size, gender, cost, quantity, image
    )
    VALUES (
      @product_id, @product_name, @product_company, @color, @size, @gender, @cost, @quantity, @image
    )
  `;

  await pool
    .request()
    .input("product_id", sql.VarChar(10), product_id)
    .input("product_name", sql.NVarChar(50), product_name)
    .input("product_company", sql.NVarChar(50), product_company)
    .input("color", sql.NVarChar(20), color || null)
    .input("size", sql.Int, size || null)
    .input("gender", sql.Char(1), gender || "U")
    .input("cost", sql.Int, cost)
    .input("quantity", sql.Int, quantity)
    .input("image", sql.NVarChar(sql.MAX), image || null)
    .query(query);

  return {
    success: true,
    product_id,
    message: "Product created successfully."
  };
}

async function getSingleProductsSql(id) {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("id", sql.VarChar(10), id)
    .query("SELECT * FROM Product WHERE product_id = @id");
  return recordset;
}

async function deleteProductSql(id) {
  const pool = await poolPromise;
  await pool
    .request()
    .input("id", sql.VarChar(10), id)
    .query("DELETE FROM Product WHERE product_id = @id");
  return { deleted: true, product_id: id };
}

async function updateProductSql(id, updates) {
  const pool = await poolPromise;
  await pool
    .request()
    .query(`UPDATE Product SET ${updates} WHERE product_id = '${id}'`);
  return { updated: true, product_id: id };
}

module.exports = {
  getAllProductsSql,
  createProductSql,
  getSingleProductsSql,
  deleteProductSql,
  updateProductSql
};
```

# Routes:

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```
