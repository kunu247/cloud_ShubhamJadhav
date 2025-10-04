// File name: connect
// File name with extension: connect.js
// Full path: E:\cloud_ShubhamJadhav\db\connect.js
// Directory: E:\cloud_ShubhamJadhav\db
// db/connect.js
const sql = require("mssql");

// ✅ MS SQL Server Configuration
const config = {
  user: "DeveloperKunal", // or your DB username
  password: "tech@123",
  database: "FootwareApp_Dev",
  server: "GOD\\SQLSERVEREXP22", // or your remote server
  port: 1433,
  options: {
    encrypt: false, // set true if using Azure SQL
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// ✅ Create global connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("\n\t[ ✅ ] Connected to SQL Server successfully.\n");
    return pool;
  })
  .catch((err) => {
    console.error("\n\t[ ❌ ] Database Connection Failed! \n", err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };
