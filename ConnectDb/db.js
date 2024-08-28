const mysql = require("mysql2/promise");
const fs = require("fs");
const dotenv=require('dotenv').config()

const pool = mysql.createPool({
  uri: process.env.URI,
  ssl: {
    ca: fs.readFileSync(process.env.CA),
    rejectUnauthorized: true,
  },
});

pool
  .getConnection()
  .then((connection) => {
    console.log("Successfully connected to the database.");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:");
  });

module.exports = pool;