// File name: cartRouter
// File name with extension: cartRouter.js
// Full path: E:\cloud_ShubhamJadhav\routes\cartRouter.js
// Directory: E:\cloud_ShubhamJadhav\routes

const express = require("express");
const {
  getAllCartItems,
  createCartItems,
  getSingleCart,
  updateCart,
  deleteCartItem
} = require("../controllers/cartController");
const router = express.Router();

router.route("/").get(getAllCartItems).post(createCartItems);
router.route("/:id").get(getSingleCart).patch(updateCart);
router.route("/delete/:id").patch(deleteCartItem);

module.exports = router;
