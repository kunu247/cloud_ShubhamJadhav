// File name: health-check
// File name with extension: health-check.js
// Full path: E:\cloud_ShubhamJadhav\scripts\health-check.js
// Directory: E:\cloud_ShubhamJadhav\scripts

const axios = require("axios");

async function healthCheck() {
  console.log("🏥 Running FullStack Health Check...");

  try {
    // Check React Dev Server
    const reactResponse = await axios.get("http://localhost:5173", {
      timeout: 5000
    });
    console.log("✅ React Dev Server: RUNNING");
  } catch (error) {
    console.log("❌ React Dev Server: NOT RUNNING");
  }

  try {
    // Check Node API Server
    const apiResponse = await axios.get("http://localhost:8065/api/v1/health", {
      timeout: 5000
    });
    console.log("✅ Node API Server: RUNNING");
  } catch (error) {
    console.log("❌ Node API Server: NOT RUNNING");
  }

  try {
    // Check Chrome DevTools
    const devToolsResponse = await axios.get("http://localhost:9222/json", {
      timeout: 3000
    });
    console.log("✅ Chrome DevTools: RUNNING");
  } catch (error) {
    console.log("❌ Chrome DevTools: NOT RUNNING");
  }
}

healthCheck();
