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

  const filterString = filters.length ? "AND " + filters.join(" AND ") : "";
  const result = await getAllProductsSql(filterString);
  res.status(result.success ? 200 : 400).json(result);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const result = await createProductSql(req.body);
  res.status(result.success ? 201 : 400).json(result);
});

exports.getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleProductsSql(id);
  res.status(result.success ? 200 : 404).json(result);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productExists = await getSingleProductsSql(id);
  if (!productExists.success) {
    return res.status(404).json(productExists);
  }

  const updates = Object.entries(req.body)
    .map(([k, v]) => `${k}='${v}'`)
    .join(", ");

  const result = await updateProductSql(id, updates);
  res.status(result.success ? 200 : 400).json(result);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await getSingleProductsSql(id);
  if (!existing.success) {
    return res.status(404).json(existing);
  }

  const result = await deleteProductSql(id);
  res.status(result.success ? 200 : 400).json(result);
});

exports.uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image"
    });
  }

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    return res.status(400).json({
      success: false,
      message: "File must be an image"
    });
  }

  if (productImage.size > 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: "Image must be under 1MB"
    });
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/",
    productImage.name
  );
  await productImage.mv(imagePath);

  res.status(201).json({
    success: true,
    message: "Image uploaded",
    image: `${process.env.BASE_URL}/uploads/${productImage.name}`
  });
});
