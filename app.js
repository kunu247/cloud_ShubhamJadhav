// File name: app
// File name with extension: app.js
// Full path: E:\cloud_ShubhamJadhav\app.js
// Directory: E:\cloud_ShubhamJadhav

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("./middleware/error-handler");

const app = express();

// ----------------------------------------------------
// 🧠 Debug Mode
// ----------------------------------------------------
const DEBUG = process.env.DEBUG_MODE === "true";
if (DEBUG) {
  console.log("[💥 DEBUG MODE ON]");
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// ----------------------------------------------------
// 🧪 Health Check
// ----------------------------------------------------
app.get("/api/health", (req, res) =>
  res.status(StatusCodes.OK).json({
    app: "Footware Management Software",
    status: "running",
    timestamp: new Date().toISOString(),
    debugMode: DEBUG
  })
);

// ----------------------------------------------------
// Middleware
// ----------------------------------------------------
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));

// ----------------------------------------------------
// Unified Router
// ----------------------------------------------------
app.use("/api/v1", require("./routes/mainRouter"));

// ----------------------------------------------------
// Optional Route Debugger
// ----------------------------------------------------
if (DEBUG) {
  const { AdvancedRouteDebugger } = require("./utils/routeDebugger");
  app.get("/api/debug/routes", (req, res) => {
    try {
      const dbg = new AdvancedRouteDebugger({ app });
      res.status(StatusCodes.OK).json(dbg.extractRoutes());
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  });
  console.log("[🔧 Debug] Route debugger active → /api/debug/routes");
}

// ----------------------------------------------------
// 404 Handler
// ----------------------------------------------------
app.all("*", (_, res) =>
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route not found"
  })
);

// ----------------------------------------------------
// Error Middleware
// ----------------------------------------------------
app.use(errorHandler);

// ----------------------------------------------------
// 🚀 Safe Server Start (Auto Port Resolution)
// ----------------------------------------------------
const PORT = process.env.PORT || 8065;
const HOST = process.env.HOST || "0.0.0.0";
const { execSync } = require("child_process");

if (require.main === module) {
  try {
    const server = app.listen(PORT, HOST, () => {
      console.log(`\n✅ Server running → http://${HOST}:${PORT}`);
      if (DEBUG) {
        console.log(`🧠 Health → http://${HOST}:${PORT}/api/health`);
        console.log(`🧩 Routes → http://${HOST}:${PORT}/api/debug/routes`);
      }
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(
          `⚠️ Port ${PORT} already in use. Attempting to free it...`
        );

        try {
          if (process.platform === "win32") {
            const pid = execSync(`netstat -ano | findstr :${PORT}`)
              .toString()
              .split(/\s+/)
              .pop()
              .trim();

            if (pid && !isNaN(pid)) {
              console.log(
                `🔪 Killing process on port ${PORT} (PID: ${pid})...`
              );
              execSync(`taskkill /PID ${pid} /F`);
              console.log("✅ Port freed. Restarting server...");
              setTimeout(() => {
                execSync(`node ${process.argv[1]}`, { stdio: "inherit" });
              }, 1500);
            } else {
              console.error("❌ Could not identify PID for that port.");
              process.exit(1);
            }
          } else {
            console.log("🐧 Linux/macOS: using lsof to free port");
            execSync(`lsof -ti:${PORT} | xargs kill -9 || true`);
            console.log("✅ Port freed. Restarting server...");
            setTimeout(() => {
              execSync(`node ${process.argv[1]}`, { stdio: "inherit" });
            }, 1500);
          }
        } catch (killErr) {
          console.error("❌ Failed to free port:", killErr.message);
          process.exit(1);
        }
      } else {
        console.error("❌ Server error:", err);
        process.exit(1);
      }
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
      console.log("\n🛑 Gracefully shutting down...");
      server.close(() => process.exit(0));
    });
  } catch (e) {
    console.error("❌ Fatal error starting server:", e.message);
    process.exit(1);
  }
} else {
  module.exports = app;
}
