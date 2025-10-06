// File name: list
// File name with extension: list.js
// Full path: E:\cloud_ShubhamJadhav\scripts\routes\list.js
// Directory: E:\cloud_ShubhamJadhav\scripts\routes

/**
 * Minimal Route Lister
 * Usage: npm run routes:list
 */

const { AdvancedRouteDebugger } = require("../../utils/routeDebugger");

function listRoutes() {
  const routeDebugger = new AdvancedRouteDebugger({
    app: require("../../app"),
    outputFormat: "minimal",
    colorOutput: false
  });

  routeDebugger.debug();
}

if (require.main === module) {
  listRoutes();
}

module.exports = listRoutes;
