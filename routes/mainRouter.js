// File name: mainRouter
// File name with extension: mainRouter.js
// Full path: E:\cloud_ShubhamJadhav\routes\mainRouter.js
// Directory: E:\cloud_ShubhamJadhav\routes

const express = require("express");
const router = express.Router();

// ------------------------------
// Controllers
// ------------------------------
const cartController = require("../controllers/cartController");
const customerController = require("../controllers/customerController");
const paymentController = require("../controllers/paymentController");
const productController = require("../controllers/productsController");

// ------------------------------
// 🛍️ Product Routes
// ------------------------------
router
  .route("/products")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route("/products/:id")
  .get(productController.getSingleProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router.route("/products/uploads").post(productController.uploadProductImage);

// ------------------------------
// 👤 Customer Routes
// ------------------------------
router.route("/customer").get(customerController.getAllCustomers);
router.route("/customer/register").post(customerController.register);
router.route("/customer/login").post(customerController.login);

// Optional: Admin route for dashboard or stats
if (customerController.getAdminStats) {
  router.route("/customer/admin").get(customerController.getAdminStats);
}

// ------------------------------
// 🛒 Cart Routes
// ------------------------------
router
  .route("/cart")
  .get(cartController.getAllCartItems)
  .post(cartController.createCartItem);

router
  .route("/cart/:id")
  .get(cartController.getSingleCart)
  .patch(cartController.updateCart);

router.route("/cart/delete/:id").patch(cartController.deleteCartItem);

// ------------------------------
// 💳 Payment Routes
// ------------------------------
router
  .route("/payment")
  .get(paymentController.getAllPayments)
  .post(paymentController.createPayment);

router.route("/payment/:id").get(paymentController.getSinglePayment);

// ------------------------------
// ✅ Export Unified Router
// ------------------------------
module.exports = router;
