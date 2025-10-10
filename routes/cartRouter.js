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
} = require("../controllers/cartController");

/**
 * ✅ Cart Routes
 * Order matters: check for query param first
 */

// Handle both /api/v1/cart?id= and /api/v1/cart/:id
router.get("/", (req, res, next) => {
  if (req.query.id) {
    // If ?id= is provided, use the enriched JOIN query
    return getSingleCart(req, res, next);
  }
  // Otherwise, return all carts
  return getAllCartItems(req, res, next);
});

router.post("/", createCartItem);
router.route("/:id").get(getSingleCart).patch(updateCart);
router.route("/delete/:id").patch(deleteCartItem);

module.exports = router;
