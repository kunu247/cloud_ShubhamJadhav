// File name: productsController
// File name with extension: productsController.js
// Full path: E:\cloud_ShubhamJadhav\controllers\productsController.js
// Directory: E:\cloud_ShubhamJadhav\controllers

const asyncHandler = require("express-async-handler");
const {
  getAllProductsSql,
  createProductSql,
  getSingleProductsSql,
  deleteProductSql,
  updateProductSql
} = require("../model/productsModel");

exports.getAllProducts = asyncHandler(async (req, res) => {
  const filters = [];
  const { name, company, color, size, gender, cost } = req.query;

  if (name) filters.push(`product_name = '${name}'`);
  if (company) filters.push(`product_company = '${company}'`);
  if (color) filters.push(`color = '${color}'`);
  if (size) filters.push(`size = ${size}`);
  if (gender) filters.push(`gender = '${gender}'`);
  if (cost) filters.push(`cost <= ${cost}`);

  const filterString = filters.length ? "WHERE " + filters.join(" AND ") : "";
  const products = await getAllProductsSql(filterString);

  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const data = await createProductSql(req.body);
  res.status(201).json({ success: true, msg: "Product created", data });
});

exports.getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await getSingleProductsSql(id);
  if (product.length === 0)
    return res.status(404).json({ success: false, msg: "Product not found" });
  res.status(200).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productExists = await getSingleProductsSql(id);
  if (productExists.length === 0)
    return res.status(404).json({ success: false, msg: "Product not found" });

  const updates = Object.entries(req.body)
    .map(([k, v]) => `${k}='${v}'`)
    .join(", ");

  await updateProductSql(id, updates);
  const updated = await getSingleProductsSql(id);
  res
    .status(200)
    .json({ success: true, msg: "Product updated", data: updated });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await getSingleProductsSql(id);
  if (existing.length === 0)
    return res.status(404).json({ success: false, msg: "Product not found" });

  await deleteProductSql(id);
  res.status(200).json({ success: true, msg: "Product deleted" });
});
