// File name: customerRoute
// File name with extension: customerRoute.js
// Full path: E:\cloud_ShubhamJadhav\routes\customerRoute.js
// Directory: E:\cloud_ShubhamJadhav\routes

const express = require("express");
const router = express.Router();
const {
  getAllCustomers,
  register,
  login,
  getAdminStats
} = require("../controllers/customerController");

router.route("/").get(getAllCustomers);
router.route("/register").post(register);
router.route("/login").post(login);

// ✅ Admin statistics route
router.route("/admin").get(getAdminStats);

module.exports = router;
