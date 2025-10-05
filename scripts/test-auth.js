// File name: test-auth
// File name with extension: test-auth.js
// Full path: E:\cloud_ShubhamJadhav\scripts\test-auth.js
// Directory: E:\cloud_ShubhamJadhav\scripts

// scripts/test-auth.js
const http = require("http");

const loginData = JSON.stringify({
  email: "demo@user.in",
  password: "Demo@123"
});

const loginOptions = {
  hostname: "localhost",
  port: 5000,
  path: "/api/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": loginData.length
  }
};

console.log("🔐 Testing login endpoint...");

const req = http.request(loginOptions, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      console.log("✅ Logged in. Token:", json.token ? "Received" : "Missing");
    } catch {
      console.error("❌ Invalid login response:", data);
    }
  });
});

req.on("error", (err) => console.error("❌ Auth test failed:", err.message));
req.write(loginData);
req.end();
