// File name: routeDebugger
// File name with extension: routeDebugger.js
// Full path: E:\cloud_ShubhamJadhav\utils\routeDebugger.js
// Directory: E:\cloud_ShubhamJadhav\utils

module.exports = function routeDebugger() {
  const app = require("../app");
  console.log("\n🧭 Active Express Routes:\n");

  if (!app._router || !app._router.stack) {
    console.log("No routes found.");
    return;
  }

  app._router.stack
    .filter((r) => r.route)
    .forEach((r) => {
      const methods = Object.keys(r.route.methods).join(",").toUpperCase();
      console.log(`${methods.padEnd(10)} ${r.route.path}`);
    });

  console.log("\n✅ Route check complete.\n");
};
