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
  const result = await getCustomer();
  res.status(result.success ? 200 : 400).json(result);
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, address, pincode, phone_number, role } =
    req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing"
    });
  }

  const exists = await emailAlreadyExists(email);
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Email already registered"
    });
  }

  const result = await registerUserFunc({
    name,
    email,
    password,
    address,
    pincode,
    phone_number,
    role
  });

  if (result.success) {
    const tokenPayload = {
      userId: result.data.customer_id,
      role: result.data.role || "user"
    };
    const token = createJWT(tokenPayload);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: result.data
    });
  } else {
    res.status(400).json(result);
  }
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required"
    });
  }

  const result = await loginUserFunc(email);
  if (!result.success) {
    return res.status(401).json(result);
  }

  const user = result.data;
  const validPwd = await bcrypt.compare(password, user.password);
  if (!validPwd) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const tokenPayload = {
    userId: user.customer_id,
    cartId: user.cart_id,
    role: user.role
  };
  attachCookiesToResponse(res, tokenPayload);

  res.status(200).json({
    success: true,
    message: "Login successful",
    customer: user.toSafeObject()
  });
});

exports.getAdminStats = asyncHandler(async (req, res) => {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM Customer WHERE isactive = 1) AS customer,
        (SELECT COUNT(*) FROM Product WHERE isactive = 1) AS product,
        (SELECT COUNT(*) FROM Payment WHERE isactive = 1) AS payment,
        (SELECT ISNULL(SUM(total_amount), 0) FROM Payment WHERE isactive = 1) AS total
    `);

    res.status(200).json({
      success: true,
      message: "Admin summary fetched successfully",
      data: recordset[0]
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard data",
      error: error.message
    });
  }
});
