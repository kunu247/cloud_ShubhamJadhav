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
  const result = await getAllpaymentsSql();
  res.status(result.success ? 200 : 400).json(result);
});

exports.createPayment = asyncHandler(async (req, res) => {
  const { payment_type, customer_id, cart_id, total_amount, product_id } =
    req.body;

  if (!payment_type || !customer_id || !cart_id || !total_amount) {
    return res.status(400).json({
      success: false,
      message: "Missing required payment data"
    });
  }

  // ✅ Normalize products into array form
  let products = [];
  if (Array.isArray(product_id)) {
    products = product_id;
  } else if (typeof product_id === "string") {
    try {
      const parsed = JSON.parse(product_id);
      products = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      products = product_id.split(",").map((p) => p.trim());
    }
  }

  const result = await createPaymentSql(
    payment_type,
    customer_id,
    cart_id,
    total_amount,
    products
  );

  res.status(result.success ? 201 : 400).json(result);
});

exports.getSinglePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getSinglePaymentSql(id);
  res.status(result.success ? 200 : 404).json(result);
});
