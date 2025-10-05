// File name: uploadsController
// File name with extension: uploadsController.js
// Full path: E:\cloud_ShubhamJadhav\controllers\uploadsController.js
// Directory: E:\cloud_ShubhamJadhav\controllers

const asyncHandler = require("express-async-handler");
const path = require("path");

exports.uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.image)
    return res
      .status(400)
      .json({ success: false, msg: "Please upload an image" });

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image"))
    return res
      .status(400)
      .json({ success: false, msg: "File must be an image" });

  if (productImage.size > 1024 * 1024)
    return res
      .status(400)
      .json({ success: false, msg: "Image must be under 1MB" });

  const imagePath = path.join(
    __dirname,
    "../public/uploads/",
    productImage.name
  );
  await productImage.mv(imagePath);

  res.status(201).json({
    success: true,
    msg: "Image uploaded",
    image: `${process.env.BASE_URL}/uploads/${productImage.name}`
  });
});
