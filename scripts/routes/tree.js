// File name: tree
// File name with extension: tree.js
// Full path: E:\cloud_ShubhamJadhav\scripts\routes\tree.js
// Directory: E:\cloud_ShubhamJadhav\scripts\routes


const { AdvancedRouteDebugger } = require('../../utils/routeDebugger');

function showTree() {
  const debugger = new AdvancedRouteDebugger({
    app: require('../../app'),
    outputFormat: 'tree',
    colorOutput: true
  });

  debugger.debug();
}

if (require.main === module) {
  showTree();
}