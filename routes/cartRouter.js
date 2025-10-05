// File name: cartRouter
// File name with extension: cartRouter.js
// Full path: E:\cloud_ShubhamJadhav\routes\cartRouter.js
// Directory: E:\cloud_ShubhamJadhav\routes

const express = require("express");
const router = express.Router();
const {
  getAllCartItems,
  createCartItem,
  getSingleCart,
  updateCart,
  deleteCartItem
  /* createCart,
  getCartById */
} = require("../controllers/cartController");

// create a cart (returns cart_id)
// router.post("/", createCart);

// optional: get cart record (metadata)
// router.get("/:id/meta", getCartById);

// cart item routes
router.route("/").get(getAllCartItems).post(createCartItem);
router.route("/:id").get(getSingleCart).patch(updateCart);
router.route("/delete/:id").patch(deleteCartItem);

module.exports = router;
