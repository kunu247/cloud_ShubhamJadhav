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
