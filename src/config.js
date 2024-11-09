const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "devUser",
  password: process.env.DB_PASSWORD || "devUser",
  database: process.env.DB_NAME || "vuetest",
});

module.exports = db;
