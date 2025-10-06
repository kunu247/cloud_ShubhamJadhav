// File name: cartController
// File name with extension: cartController.js
// Full path: E:\cloud_ShubhamJadhav\controllers\cartController.js
// Directory: E:\cloud_ShubhamJadhav\controllers

const asyncHandler = require("express-async-handler");
const {
  getAllCartItemsSql,
  createCartItemsSql,
  getSingleCartItemSql,
  updateCartSql,
  deleteCartItemSql
  /* createCartSql,
  getCartByIdSql */
} = require("../model/cartModel");

exports.getAllCartItems = asyncHandler(async (req, res) => {
  const items = await getAllCartItemsSql();
  res.status(200).json({ success: true, count: items.length, data: items });
});

exports.createCartItem = asyncHandler(async (req, res) => {
  const { cart_quantity, cart_id, product_id, purchased } = req.body;
  if (!cart_id || !product_id || !cart_quantity)
    return res.status(400).json({ success: false, msg: "Missing fields" });

  const result = await createCartItemsSql(
    cart_quantity,
    cart_id,
    product_id,
    purchased
  );
  res.status(201).json({ success: true, msg: "Cart item added", data: result });
});

exports.getSingleCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await getSingleCartItemSql(id);
  if (!data || data.length === 0)
    return res
      .status(200)
      .json({ success: true, msg: "Your cart is empty.", data: [] });
  // res.status(200).json({ success: true, data });
});

exports.updateCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cart_quantity, product_id } = req.body;
  const affected = await updateCartSql(id, cart_quantity, product_id);
  if (affected[0] === 0)
    return res.status(404).json({ success: false, msg: "Cart item not found" });
  res.status(200).json({ success: true, msg: "Cart updated" });
});

exports.deleteCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { product_id } = req.body;
  const deleted = await deleteCartItemSql(id, product_id);
  if (deleted[0] === 0)
    return res.status(404).json({ success: false, msg: "Cart item not found" });
  res.status(200).json({ success: true, msg: "Cart item deleted" });
});

/*
exports.createCart = asyncHandler(async (req, res) => {
  // optional: allow client to suggest a cart_id (not recommended for public API)
  const suggested = req.body && req.body.cart_id ? req.body.cart_id : undefined;
  const cart_id = await createCartSql(suggested);
  res.status(201).json({ success: true, cart_id, msg: "Cart created" });
});

exports.getCartById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cart = await getCartByIdSql(id);
  if (!cart || cart.length === 0) {
    return res.status(404).json({ success: false, msg: "Cart not found" });
  }
  res.status(200).json({ success: true, data: cart[0] });
});
*/
