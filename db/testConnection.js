// File name: testConnection
// File name with extension: testConnection.js
// Full path: E:\cloud_ShubhamJadhav\db\testConnection.js
// Directory: E:\cloud_ShubhamJadhav\db

require("dotenv").config();
const sql = require("mssql");

(async () => {
  try {
    const pool = await sql.connect({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      options: { encrypt: false, trustServerCertificate: true }
    });

    const result = await pool
      .request()
      .query("SELECT @@SERVERNAME AS ServerName, GETDATE() AS Now");
    console.log("✅ MSSQL Connected Successfully:", result.recordset[0]);
    await sql.close();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

/*
const { sql, poolPromise } = require("./connect");

(async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT DB_NAME() AS CurrentDB");
    console.log("Connected to Database:", result.recordset[0].CurrentDB);
  } catch (err) {
    console.error("Connection Test Failed:", err);
  }
})();
*/
