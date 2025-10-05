// =========================
// File: app.js
// Path: E:\cloud_ShubhamJadhav\app.js
// =========================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/error-handler");
const { StatusCodes } = require("http-status-codes"); // ✅ for standardized HTTP codes

const app = express();

// ----------------------------------------------------
// 🧠 Debugging & Performance Hooks (NEW)
// ----------------------------------------------------
const DEBUG = process.env.DEBUG_MODE === "true"; // controlled via .env
if (DEBUG) {
  console.log(
    "[🪶 DEBUG MODE ON] Express routes and middleware tracing enabled."
  );
  const morgan = require("morgan"); // no extra package—comes with nodemon dev use
  app.use(morgan("dev")); // log HTTP requests in console
}

// ----------------------------------------------------
// 🧪 Health Check Endpoint (NEW)
// ----------------------------------------------------
app.get("/api/health", (req, res) => {
  res.status(StatusCodes.OK).json({
    app: "Footware Management Software",
    status: "running",
    time: new Date(),
    debugMode: DEBUG
  });
});

// ----------------------------------------------------
// Middleware
// ----------------------------------------------------
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));

// ----------------------------------------------------
// Routers
// ----------------------------------------------------
const customerRouter = require("./routes/customerRoute");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRouter");
const paymentRouter = require("./routes/paymentRouter");

app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/payment", paymentRouter);

// ----------------------------------------------------
// 🧭 Route Debug Utility (NEW)
// ----------------------------------------------------
if (DEBUG) {
  app.get("/api/debug/routes", (req, res) => {
    const routes = [];
    app._router.stack.forEach((r) => {
      if (r.route && r.route.path) {
        routes.push({
          methods: Object.keys(r.route.methods).join(",").toUpperCase(),
          path: r.route.path
        });
      }
    });
    res.status(StatusCodes.OK).json({
      totalRoutes: routes.length,
      routes
    });
  });
}

// ----------------------------------------------------
// Fallback 404 Route
// ----------------------------------------------------
app.get("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: 404,
    msg: "Route not found"
  });
});

// ----------------------------------------------------
// Error Middleware
// ----------------------------------------------------
app.use(errorHandler);

// ----------------------------------------------------
// Server Start
// ----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`\n[✅] Server running on port ${PORT}\n`));

module.exports = app; // ✅ Required for test/debug scripts
