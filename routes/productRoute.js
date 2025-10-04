// File name: productRoute
// File name with extension: productRoute.js
// Full path: E:\cloud_ShubhamJadhav\routes\productRoute.js
// Directory: E:\cloud_ShubhamJadhav\routes

const express = require("express");
const { uploadProductImage } = require("../controllers/uploadsController");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct
} = require("../controllers/productsController");
const router = express.Router();

router.route("/").post(createProduct).get(getAllProducts);
router
  .route("/:id")
  .get(getSingleProduct)
  .delete(deleteProduct)
  .patch(updateProduct);

router.route("/uploads").post(uploadProductImage);

module.exports = router;
