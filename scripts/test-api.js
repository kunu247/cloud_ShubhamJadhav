// File name: test-api
// File name with extension: test-api.js
// Full path: E:\cloud_ShubhamJadhav\scripts\test-api.js
// Directory: E:\cloud_ShubhamJadhav\scripts

// scripts/test-api.js
const http = require("http");

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/health",
  method: "GET"
};

console.log("🧪 Testing API endpoint: GET /api/health");

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => console.log("✅ Response:", data));
});

req.on("error", (err) => console.error("❌ API Test Failed:", err.message));
req.end();
