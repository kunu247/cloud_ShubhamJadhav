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
    "[💥 DEBUG MODE ON] Express routes and middleware tracing enabled."
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
// 🧭 Enhanced Route Debug Utility (UPDATED)
// ----------------------------------------------------
if (DEBUG) {
  const {
    AdvancedRouteDebugger,
    getRouteData
  } = require("./utils/routeDebugger");

  // Enhanced debug endpoint with multiple formats
  app.get("/api/debug/routes", (req, res) => {
    try {
      const format = req.query.format || "json";
      const filter = req.query.filter || null;
      const includeMiddleware = req.query.middleware === "true";

      const debuggerInstance = new AdvancedRouteDebugger({
        app,
        outputFormat: format,
        filter: filter,
        includeMiddleware: includeMiddleware,
        colorOutput: false
      });

      const routeData = debuggerInstance.extractRoutes();

      switch (format) {
        case "minimal":
          return res
            .type("text/plain")
            .send(
              routeData.routes
                .map((r) => `${r.methods.join(",")} ${r.path}`)
                .join("\n")
            );
        case "table":
          // For table format, we'll return as plain text with formatted table
          let tableOutput = `🚀 EXPRESS ROUTE DEBUGGER\n`;
          tableOutput += `Total Routes: ${routeData.stats.totalRoutes}\n`;
          tableOutput += `Generated: ${new Date().toISOString()}\n\n`;

          routeData.routes.forEach((route) => {
            const methods = route.methods.join(",").toUpperCase().padEnd(15);
            tableOutput += `${methods} ${route.path}\n`;
          });

          return res.type("text/plain").send(tableOutput);
        case "html":
          // Basic HTML response since we don't have a view engine setup
          let htmlOutput = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Route Debugger</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .route { margin: 5px 0; padding: 8px; background: #f5f5f5; }
                    .method { font-weight: bold; color: #007acc; }
                    .stats { background: #e8f4fd; padding: 15px; margin: 15px 0; }
                </style>
            </head>
            <body>
                <h1>🚀 Express Route Debugger</h1>
                <div class="stats">
                    <strong>Total Routes:</strong> ${
                      routeData.stats.totalRoutes
                    }<br>
                    <strong>Generated:</strong> ${new Date().toISOString()}
                </div>
          `;

          routeData.routes.forEach((route) => {
            htmlOutput += `
                <div class="route">
                    <span class="method">${route.methods
                      .join(", ")
                      .toUpperCase()}</span>
                    <span>${route.path}</span>
                </div>
            `;
          });

          htmlOutput += `</body></html>`;
          return res.type("text/html").send(htmlOutput);
        default:
          return res.status(StatusCodes.OK).json({
            success: true,
            data: routeData,
            metadata: {
              generated: new Date().toISOString(),
              total: routeData.stats.totalRoutes,
              format: "json"
            }
          });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message,
        message: "Failed to extract route data"
      });
    }
  });

  // Route documentation endpoint
  app.get("/api/debug/routes/doc", (req, res) => {
    try {
      const debuggerInstance = new AdvancedRouteDebugger({ app });
      const routeData = debuggerInstance.extractRoutes();
      const documentation = debuggerInstance.generateDocumentation(
        routeData.routes
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: documentation,
        metadata: {
          generated: new Date().toISOString(),
          totalEndpoints: documentation.endpoints.length
        }
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message,
        message: "Failed to generate route documentation"
      });
    }
  });

  // Route statistics endpoint
  app.get("/api/debug/routes/stats", (req, res) => {
    try {
      const debuggerInstance = new AdvancedRouteDebugger({ app });
      const routeData = debuggerInstance.extractRoutes();

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          statistics: routeData.stats,
          prefixes: routeData.prefixes,
          metadata: {
            generated: new Date().toISOString(),
            debugMode: DEBUG
          }
        }
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message,
        message: "Failed to generate route statistics"
      });
    }
  });

  // Keep the original simple debug endpoint for backward compatibility
  app.get("/api/debug/routes/simple", (req, res) => {
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

  console.log("[🔧 Route Debugger] Enhanced endpoints loaded:");
  console.log("   GET /api/debug/routes?format=json|minimal|table|html");
  console.log("   GET /api/debug/routes/doc");
  console.log("   GET /api/debug/routes/stats");
  console.log("   GET /api/debug/routes/simple");
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
app.listen(PORT, () => {
  console.log(`\n[✅] Server running on port ${PORT}\n`);
  if (DEBUG) {
    console.log(`[🔧 Debug Endpoints]`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`   Route Debug: http://localhost:${PORT}/api/debug/routes`);
    console.log(`   Route Docs: http://localhost:${PORT}/api/debug/routes/doc`);
    console.log(
      `   Route Stats: http://localhost:${PORT}/api/debug/routes/stats\n`
    );
  }
});

module.exports = app; // ✅ Required for test/debug scripts
