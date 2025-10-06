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
