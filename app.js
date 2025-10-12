// File name: app
// File name with extension: app.js
// Full path: E:\cloud_ShubhamJadhav\app.js
// Directory: E:\cloud_ShubhamJadhav

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const os = require("os");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("./middleware/error-handler");
const { AdvancedRouteDebugger } = require("./utils/routeDebugger");

const app = express();

/* ---------------------------------------------------------
 * 🧠 Environment & Debug Mode
 * --------------------------------------------------------- */
const DEBUG = process.env.DEBUG_MODE === "true";
if (DEBUG) {
  console.log("[💥 DEBUG MODE ON]");
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

/* ---------------------------------------------------------
 * 🌐 Detect Local Network IP (LAN)
 * --------------------------------------------------------- */
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const details of iface) {
      if (
        details.family === "IPv4" &&
        !details.internal &&
        details.address.startsWith("192.")
      ) {
        return details.address;
      }
    }
  }
  return "127.0.0.1"; // fallback
}
const LOCAL_IP = getLocalIPAddress();

/* ---------------------------------------------------------
 * 🧪 Health Endpoints
 * --------------------------------------------------------- */
app.get("/api/health", (req, res) =>
  res.status(StatusCodes.OK).json({
    app: "Footware Management Software",
    status: "running",
    timestamp: new Date().toISOString(),
    ip: LOCAL_IP,
    host: os.hostname(),
    debugMode: DEBUG
  })
);

app.get("/api/v1/health", (req, res) => {
  res.status(StatusCodes.OK).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    ip: LOCAL_IP,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

/* ---------------------------------------------------------
 * 🧩 Debug Info Endpoint
 * --------------------------------------------------------- */
app.get("/api/v1/debug-info", (req, res) => {
  res.status(StatusCodes.OK).json({
    debug: {
      chromeDevTools: "http://localhost:9222",
      nodeInspect: "port 9229",
      sourceMaps: "enabled"
    },
    endpoints: {
      react: `http://${LOCAL_IP}:5173`,
      api: `http://${LOCAL_IP}:8065`
    }
  });
});

/* ---------------------------------------------------------
 * ⚙️ Middleware
 * --------------------------------------------------------- */
app.use(express.json());
app.use(cors({ origin: "*" })); // ✅ Allow any network device
app.use(cookieParser());
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));

/* ---------------------------------------------------------
 * 🧭 Unified Router
 * --------------------------------------------------------- */
app.use("/api/v1", require("./routes/mainRouter"));

/* ---------------------------------------------------------
 * 🧠 Optional Route Debugger
 * --------------------------------------------------------- */
if (DEBUG) {
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

/* ---------------------------------------------------------
 * 🚫 404 Handler
 * --------------------------------------------------------- */
app.all("*", (_, res) =>
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route not found"
  })
);

/* ---------------------------------------------------------
 * ⚠️ Error Middleware
 * --------------------------------------------------------- */
app.use(errorHandler);

/* ---------------------------------------------------------
 * 🚀 Start Server with Auto IP + Info Table
 * --------------------------------------------------------- */
const PORT = process.env.PORT || 8065;
const HOST = "0.0.0.0"; // ✅ Allows network-wide access
const { execSync } = require("child_process");

if (require.main === module) {
  try {
    const server = app.listen(PORT, HOST, () => {
      const BASE_URL = `http://${LOCAL_IP}:${PORT}`;
      console.log("\n✅ Server Started Successfully!\n");

      console.table([
        { Label: "App", Value: "Footware Management Software" },
        { Label: "Host", Value: os.hostname() },
        { Label: "Local IP", Value: LOCAL_IP },
        { Label: "Base URL", Value: BASE_URL },
        { Label: "Health Check", Value: `${BASE_URL}/api/health` },
        { Label: "Routes Debug", Value: `${BASE_URL}/api/debug/routes` },
        { Label: "React Frontend", Value: `http://${LOCAL_IP}:5173` },
        { Label: "Access (Local)", Value: `http://localhost:${PORT}` },
        { Label: "Network Access", Value: BASE_URL },
        { Label: "Status", Value: "Running 🟢" }
      ]);

      // Show short, precise summary
      console.log(
        `\n🌍  Accessible from:\n  → Local:   http://localhost:${PORT}\n  → Network: http://${LOCAL_IP}:${PORT}\n`
      );

      if (DEBUG) {
        console.log(`🧠 Debug Health → ${BASE_URL}/api/health`);
        console.log(`🧩 Debug Routes → ${BASE_URL}/api/debug/routes`);
      }
    });

    /* ----------------------------------------------
     * 🧹 Handle Port Conflict Gracefully
     * ---------------------------------------------- */
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`⚠️ Port ${PORT} in use. Attempting to free it...`);
        try {
          if (process.platform === "win32") {
            const pid = execSync(`netstat -ano | findstr :${PORT}`)
              .toString()
              .split(/\s+/)
              .pop()
              .trim();
            if (pid && !isNaN(pid)) {
              console.log(`🔪 Killing process on port ${PORT} (PID: ${pid})`);
              execSync(`taskkill /PID ${pid} /F`);
              console.log("✅ Port freed. Restarting...");
              setTimeout(
                () => execSync(`node ${process.argv[1]}`, { stdio: "inherit" }),
                1500
              );
            }
          } else {
            console.log("🐧 Killing Linux/macOS port process...");
            execSync(`lsof -ti:${PORT} | xargs kill -9 || true`);
            console.log("✅ Port freed. Restarting...");
            setTimeout(
              () => execSync(`node ${process.argv[1]}`, { stdio: "inherit" }),
              1500
            );
          }
        } catch (killErr) {
          console.error("❌ Could not free port:", killErr.message);
          process.exit(1);
        }
      } else {
        console.error("❌ Server error:", err);
        process.exit(1);
      }
    });

    /* ----------------------------------------------
     * 🛑 Graceful Shutdown
     * ---------------------------------------------- */
    process.on("SIGINT", () => {
      console.log("\n🛑 Gracefully shutting down...");
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error("❌ Fatal error starting server:", err.message);
    process.exit(1);
  }
} else {
  module.exports = app;
}
