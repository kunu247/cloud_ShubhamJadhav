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
} = require("../model/cartModel");

exports.getAllCartItems = asyncHandler(async (req, res) => {
  const result = await getAllCartItemsSql();
  res.status(result.success ? 200 : 400).json(result);
});

exports.createCartItem = asyncHandler(async (req, res) => {
  const { cart_quantity, cart_id, product_id, purchased } = req.body;
  if (!cart_id || !product_id || !cart_quantity) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  const result = await createCartItemsSql(
    cart_quantity,
    cart_id,
    product_id,
    purchased
  );
  res.status(result.success ? 201 : 400).json(result);
});

exports.getSingleCart = asyncHandler(async (req, res) => {
  const cartId = req.params.id || req.query.id;

  if (!cartId) {
    return res.status(400).json({
      success: false,
      message: "Missing cart_id parameter"
    });
  }

  const result = await getSingleCartItemSql(cartId);

  if (result.success && result.data.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Your cart is empty",
      count: 0,
      data: []
    });
  }

  res.status(result.success ? 200 : 400).json(result);
});

exports.updateCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cart_quantity, product_id } = req.body;

  const result = await updateCartSql(id, cart_quantity, product_id);
  res.status(result.success ? 200 : 404).json(result);
});

exports.deleteCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { product_id } = req.body;

  const result = await deleteCartItemSql(id, product_id);
  res.status(result.success ? 200 : 404).json(result);
});
