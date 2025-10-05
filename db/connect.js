// File name: connect
// File name with extension: connect.js
// Full path: E:\cloud_ShubhamJadhav\db\connect.js
// Directory: E:\cloud_ShubhamJadhav\db

require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  instanceName: process.env.DB_INSTANCE
};

let poolPromise;

async function connectDB() {
  try {
    if (!poolPromise) {
      const pool = new sql.ConnectionPool(config);
      poolPromise = pool.connect();
      await poolPromise;
      console.log("[✅] SQL Server connected successfully.");
    }
    return poolPromise;
  } catch (err) {
    console.error("[❌] Database connection failed:", err.message);
    process.exit(1);
  }
}

connectDB();

module.exports = { sql, poolPromise: connectDB() };
