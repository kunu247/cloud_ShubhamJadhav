// File name: productRoute
// File name with extension: productRoute.js
// Full path: E:\cloud_ShubhamJadhav\routes\productRoute.js
// Directory: E:\cloud_ShubhamJadhav\routes

const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct
} = require("../controllers/productsController");
const { uploadProductImage } = require("../controllers/uploadsController");

router.route("/").get(getAllProducts).post(createProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);
router.route("/uploads").post(uploadProductImage);

module.exports = router;
