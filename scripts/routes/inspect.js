// File name: inspect
// File name with extension: inspect.js
// Full path: E:\cloud_ShubhamJadhav\scripts\routes\inspect.js
// Directory: E:\cloud_ShubhamJadhav\scripts\routes

const { AdvancedRouteDebugger } = require('../../utils/routeDebugger');

function inspectRoutes() {
  console.log('🔍 Route Inspector - Comprehensive Analysis\n');
  
  const debugger = new AdvancedRouteDebugger({
    app: require('../../app'),
    depth: 3,
    outputFormat: 'table',
    includeMiddleware: true,
    showStats: true,
    colorOutput: true
  });

  const routeData = debugger.debug();
  
  if (routeData) {
    console.log('\n📋 Quick Commands:');
    console.log('  npm run routes:list     - List all routes in minimal format');
    console.log('  npm run routes:tree     - Display routes as tree');
    console.log('  npm run routes:stats    - Show route statistics');
    console.log('  npm run routes:doc      - Generate API documentation');
    console.log('  npm run routes:health   - Check route health');
  }
}

if (require.main === module) {
  inspectRoutes();
}

module.exports = inspectRoutes;