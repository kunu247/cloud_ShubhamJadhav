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
  const { payment_type, customer_id, cart_id, total_amount } = req.body;
  if (!payment_type || !customer_id || !cart_id)
    return res
      .status(400)
      .json({ success: false, msg: "Missing payment data" });

  const payment = await createPaymentSql(
    payment_type,
    customer_id,
    cart_id,
    total_amount
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
