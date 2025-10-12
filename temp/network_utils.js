const os = require("os");

/* ---------------------------------------------------------
 * 🌐 Detect Local Network IP (LAN)
 * --------------------------------------------------------- */
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const details of iface) {
      if (
        details.family === "IPv4" &&
        !details.internal &&
        details.address.startsWith("192.")
      ) {
        return details.address;
      }
    }
  }
  return "127.0.0.1"; // fallback
}
const LOCAL_IP = getLocalIPAddress();
const PORT = process.env.PORT || 5000;

console.log(`🌐 Local Network IP detected: http://${LOCAL_IP}:${PORT}`);
