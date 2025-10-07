// File name: route-tools
// File name with extension: route-tools.js
// Full path: E:\cloud_ShubhamJadhav\scripts\routes\route-tools.js
// Directory: E:\cloud_ShubhamJadhav\scripts\routes

/**
 * Unified Route Debugging and Documentation Suite
 * ------------------------------------------------
 * ✅ Combines export, list, tree, stats, docs, inspect, health-check
 * ✅ Handles port conflicts gracefully
 * ✅ Aligned with package.json scripts
 *
 * Usage:
 *   npm run routes:list
 *   npm run routes:tree
 *   npm run routes:stats
 *   npm run routes:doc
 *   npm run routes:export
 *   npm run routes:health
 */

const fs = require("fs");
const path = require("path");
const {
  AdvancedRouteDebugger,
  getRouteData
} = require("../../utils/routeDebugger");

const app = require("../../app");
const exportsDir = path.join(process.cwd(), "exports");
const docsDir = path.join(process.cwd(), "docs");

// 🔧 Helper: ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/* ------------------------------------------------------------
 *  📦 Export Routes to JSON
 * ------------------------------------------------------------ */
function exportRoutes() {
  ensureDir(exportsDir);
  const routeData = getRouteData(app);
  const filename = `routes-export-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.json`;
  const filepath = path.join(exportsDir, filename);

  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      totalRoutes: routeData.stats.totalRoutes,
      app: "Footware Management Software"
    },
    ...routeData
  };

  fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
  console.log(`✅ Routes exported → ${filepath}`);
}

/* ------------------------------------------------------------
 *  📚 Generate API Documentation
 * ------------------------------------------------------------ */
function generateDocs() {
  ensureDir(docsDir);
  const debuggerInstance = new AdvancedRouteDebugger({ app });
  const routeData = debuggerInstance.extractRoutes();
  const documentation = debuggerInstance.generateDocumentation(
    routeData.routes
  );
  const filename = `api-documentation-${
    new Date().toISOString().split("T")[0]
  }.json`;
  const filepath = path.join(docsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(documentation, null, 2));

  console.log(`📚 API Docs Generated → ${filepath}`);
  console.log(`Endpoints: ${documentation.endpoints.length}`);
}

/* ------------------------------------------------------------
 *  🏥 Route Health Check
 * ------------------------------------------------------------ */
function healthCheck() {
  const routeData = getRouteData(app);
  const issues = [];
  const routeMap = new Map();

  routeData.routes.forEach((r) => {
    const key = `${r.methods.join(",")}-${r.path}`;
    if (routeMap.has(key))
      issues.push(`Duplicate route: ${r.methods.join(",")} ${r.path}`);
    routeMap.set(key, true);

    if (r.path.includes("//")) issues.push(`Double slash in path: ${r.path}`);
    if (r.path.endsWith("/") && r.path !== "/")
      issues.push(`Trailing slash: ${r.path}`);
  });

  if (issues.length === 0) {
    console.log("✅ All routes are healthy!");
    console.log(`📊 Total routes: ${routeData.stats.totalRoutes}`);
  } else {
    console.log("❌ Found potential route issues:");
    issues.forEach((i) => console.log("  -", i));
  }
}

/* ------------------------------------------------------------
 *  🔍 Inspect Routes (Comprehensive)
 * ------------------------------------------------------------ */
function inspectRoutes() {
  console.log("🔍 Route Inspector - Full Analysis\n");
  const dbg = new AdvancedRouteDebugger({
    app,
    depth: 3,
    outputFormat: "table",
    includeMiddleware: true,
    showStats: true,
    colorOutput: true
  });
  dbg.debug();
}

/* ------------------------------------------------------------
 *  📋 Minimal Route Listing
 * ------------------------------------------------------------ */
function listRoutes() {
  const dbg = new AdvancedRouteDebugger({ app, outputFormat: "minimal" });
  dbg.debug();
}

/* ------------------------------------------------------------
 *  🌳 Route Tree
 * ------------------------------------------------------------ */
function showTree() {
  const dbg = new AdvancedRouteDebugger({
    app,
    outputFormat: "tree",
    colorOutput: true
  });
  dbg.debug();
}

/* ------------------------------------------------------------
 *  📈 Route Stats
 * ------------------------------------------------------------ */
function showStats() {
  const routeData = getRouteData(app);
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

/* ------------------------------------------------------------
 *  🧩 CLI Command Switch
 * ------------------------------------------------------------ */
const command = process.argv[2];

switch (command) {
  case "export":
    exportRoutes();
    break;
  case "doc":
    generateDocs();
    break;
  case "health":
    healthCheck();
    break;
  case "inspect":
    inspectRoutes();
    break;
  case "list":
    listRoutes();
    break;
  case "tree":
    showTree();
    break;
  case "stats":
    showStats();
    break;
  default:
    console.log(`
Usage:
  node scripts/routes/route-tools.js <command>

Commands:
  export     → Export routes to JSON
  doc        → Generate API documentation
  health     → Run route health checks
  inspect    → Inspect routes (deep analysis)
  list       → List all routes
  tree       → Display routes as a tree
  stats      → Show route stats
`);
}
