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
  admin
} = require("../controllers/customerController");

router.route("/").get(getAllCustomers);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/admin").get(admin);

module.exports = router;
