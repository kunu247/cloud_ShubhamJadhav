// File name: customerModel
// File name with extension: customerModel.js
// Full path: E:\cloud_ShubhamJadhav\model\customerModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");
const ShortUniqueId = require("short-unique-id");
const bcrypt = require("bcryptjs");
const Customer = require("./Customer");
const ApiResponse = require("./ApiResponse");

async function getCustomer() {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool
      .request()
      .query("SELECT * FROM Customer WHERE isactive = 1");
    const customers = recordset.map((row) => Customer.fromDatabase(row));
    return new ApiResponse(
      true,
      customers,
      "Customers retrieved successfully",
      customers.length
    );
  } catch (error) {
    return ApiResponse.error("Failed to retrieve customers", error.message);
  }
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
  try {
    const pool = await poolPromise;
    const uid = new ShortUniqueId({ length: 6 });
    const customer_id = uid.rnd();
    const hashedPwd = await bcrypt.hash(password, 10);

    let cart_id = uid.rnd();
    await pool
      .request()
      .input("cart_id", sql.VarChar(7), cart_id)
      .query("INSERT INTO Cart (cart_id) VALUES (@cart_id)");

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

    const customer = new Customer(
      customer_id,
      name,
      email,
      hashedPwd,
      address,
      pincode,
      phone_number,
      cart_id,
      role
    );

    return ApiResponse.success(
      customer.toSafeObject(),
      "User registered successfully"
    );
  } catch (error) {
    return ApiResponse.error("Registration failed", error.message);
  }
}

async function loginUserFunc(email) {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool
      .request()
      .input("email", sql.VarChar(50), email)
      .query("SELECT * FROM Customer WHERE email = @email AND isactive = 1");

    if (recordset.length === 0) {
      return ApiResponse.error("User not found");
    }

    const customer = Customer.fromDatabase(recordset[0]);
    return ApiResponse.success(customer, "User found");
  } catch (error) {
    return ApiResponse.error("Login query failed", error.message);
  }
}

module.exports = {
  getCustomer,
  emailAlreadyExists,
  registerUserFunc,
  loginUserFunc
};
