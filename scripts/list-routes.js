// File name: list-routes
// File name with extension: list-routes.js
// Full path: E:\cloud_ShubhamJadhav\scripts\list-routes.js
// Directory: E:\cloud_ShubhamJadhav\scripts

try {
  const app = require("../app");
  console.log("📋 Express Routes:");
  app._router.stack.forEach((r) => {
    if (r.route) {
      const methods = Object.keys(r.route.methods).join(",").toUpperCase();
      console.log(`${methods.padEnd(10)} ${r.route.path}`);
    }
  });
  console.log("✅ Route listing complete.");
} catch (err) {
  console.error("❌ Could not list routes:", err.message);
}
