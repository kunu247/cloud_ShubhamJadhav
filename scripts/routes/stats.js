// File name: stats
// File name with extension: stats.js
// Full path: E:\cloud_ShubhamJadhav\scripts\routes\stats.js
// Directory: E:\cloud_ShubhamJadhav\scripts\routes

const { getRouteData } = require("../../utils/routeDebugger");

function showStats() {
  const routeData = getRouteData(require("../../app"));

  console.log("📊 Route Statistics\n");
  console.log(`Total Routes: ${routeData.stats.totalRoutes}`);
  console.log(`Unique Prefixes: ${routeData.stats.uniquePrefixes}`);

  console.log("\nMethod Distribution:");
  Object.entries(routeData.stats.methodCount).forEach(([method, count]) => {
    console.log(`  ${method.padEnd(6)}: ${count}`);
  });

  console.log("\nRoute Prefixes:");
  routeData.prefixes.forEach((prefix) => {
    const count = routeData.stats.prefixCount[prefix] || 0;
    console.log(`  ${prefix || "/root"}: ${count} routes`);
  });
}

if (require.main === module) {
  showStats();
}
