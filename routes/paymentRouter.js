// File name: paymentRouter
// File name with extension: paymentRouter.js
// Full path: E:\cloud_ShubhamJadhav\routes\paymentRouter.js
// Directory: E:\cloud_ShubhamJadhav\routes

const express = require("express");
const router = express.Router();
const {
  getAllPayments,
  createPayment,
  getSinglePayment
} = require("../controllers/paymentController");

router.route("/").get(getAllPayments).post(createPayment);
router.route("/:id").get(getSinglePayment);

module.exports = router;
