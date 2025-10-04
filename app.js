// File name: app
// File name with extension: app.js
// Full path: E:\cloud_ShubhamJadhav\app.js
// Directory: E:\cloud_ShubhamJadhav

const express = require("express");
const app = express();
const cors = require("cors");
const customerRouter = require("./routes/customerRoute");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRouter");
const paymentRouter = require("./routes/paymentRouter");

const fileUpload = require("express-fileupload");
app.use(express.static("./public"));
app.use(fileUpload());

app.use(express.json());

app.use(cors());

app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/payment", paymentRouter);

app.get("*", (req, res) => {
  res.send({
    status: 404,
    msg: "Page Not Found..."
  });
});

app.listen(3000, () => {
  console.log("\n\n\tServer is listening on port 3000\n\n\n");
});
