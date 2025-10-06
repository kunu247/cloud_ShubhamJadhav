// File name: health-check
// File name with extension: health-check.js
// Full path: E:\cloud_ShubhamJadhav\scripts\routes\health-check.js
// Directory: E:\cloud_ShubhamJadhav\scripts\routes

const { getRouteData } = require('../../utils/routeDebugger');

function healthCheck() {
  const routeData = getRouteData(require('../../app'));
  
  console.log('🏥 Route Health Check\n');
  
  // Check for common issues
  const issues = [];
  
  // Check for duplicate routes
  const routeMap = new Map();
  routeData.routes.forEach(route => {
    const key = `${route.methods.join(',')}-${route.path}`;
    if (routeMap.has(key)) {
      issues.push(`Duplicate route: ${route.methods.join(',')} ${route.path}`);
    }
    routeMap.set(key, route);
  });
  
  // Check for potentially problematic routes
  routeData.routes.forEach(route => {
    if (route.path.includes('//')) {
      issues.push(`Double slash in route: ${route.path}`);
    }
    if (route.path.endsWith('/') && route.path !== '/') {
      issues.push(`Trailing slash in route: ${route.path}`);
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ All routes are healthy');
    console.log(`📊 Total routes: ${routeData.stats.totalRoutes}`);
    console.log(`🌐 Route prefixes: ${routeData.prefixes.length}`);
  } else {
    console.log('❌ Found potential issues:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
}

if (require.main === module) {
  healthCheck();
}