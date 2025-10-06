// File name: generate-docs
// File name with extension: generate-docs.js
// Full path: E:\cloud_ShubhamJadhav\scripts\routes\generate-docs.js
// Directory: E:\cloud_ShubhamJadhav\scripts\routes

/**
 * Generate API Documentation
 * Usage: npm run routes:doc
 */

const { AdvancedRouteDebugger } = require('../../utils/routeDebugger');
const fs = require('fs');
const path = require('path');

function generateDocs() {
  const debugger = new AdvancedRouteDebugger({ 
    app: require('../../app') 
  });
  const routeData = debugger.extractRoutes();
  const documentation = debugger.generateDocumentation(routeData.routes);
  
  const docsDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  const filename = `api-documentation-${new Date().toISOString().split('T')[0]}.json`;
  const filepath = path.join(docsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(documentation, null, 2));
  
  console.log('📚 API Documentation Generated\n');
  console.log(`File: ${filepath}`);
  console.log(`Total Endpoints: ${documentation.endpoints.length}`);
  console.log(`Base URL: ${documentation.baseURL}`);
}

if (require.main === module) {
  generateDocs();
}