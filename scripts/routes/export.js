// File name: export
// File name with extension: export.js
// Full path: E:\cloud_ShubhamJadhav\scripts\routes\export.js
// Directory: E:\cloud_ShubhamJadhav\scripts\routes

/**
 * Export Routes to JSON
 * Usage: npm run routes:export
 */

const { getRouteData } = require("../../utils/routeDebugger");
const fs = require("fs");
const path = require("path");

function exportRoutes() {
  const routeData = getRouteData(require("../../app"));
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `routes-export-${timestamp}.json`;
  const filepath = path.join(process.cwd(), "exports", filename);

  // Ensure exports directory exists
  const exportsDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      totalRoutes: routeData.stats.totalRoutes,
      app: "Footware Management Software"
    },
    ...routeData
  };

  fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
  console.log(`✅ Routes exported to: ${filepath}`);
}

if (require.main === module) {
  exportRoutes();
}
