// File name: debug-setup
// File name with extension: debug-setup.js
// Full path: E:\cloud_ShubhamJadhav\scripts\debug-setup.js
// Directory: E:\cloud_ShubhamJadhav\scripts

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔧 Setting up FullStack Debug Environment...");

// Kill any existing processes on required ports
try {
  console.log(
    "🛑 Killing existing processes on ports 5173, 8065, 9222, 9229..."
  );
  execSync("npx kill-port 5173 8065 9222 9229", { stdio: "inherit" });
} catch (error) {
  console.log("✅ No existing processes found or already cleared");
}

// Create Chrome debug profile directory
const chromeDebugDir = path.join(__dirname, "..", ".chrome-debug-profile");
if (!fs.existsSync(chromeDebugDir)) {
  fs.mkdirSync(chromeDebugDir, { recursive: true });
  console.log("✅ Created Chrome debug profile directory");
}

console.log("🎯 Debug Environment Ready!");
console.log("📱 React Dev Server: http://localhost:5173");
console.log("🔗 Node API Server: http://localhost:8065");
console.log("🔍 Chrome DevTools: http://localhost:9222");
console.log("🐛 Node Debugger: port 9229");

// Add to package.json scripts
// "debug:setup": "node scripts/debug-setup.js"
