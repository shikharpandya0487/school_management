// const mysql=require('mysql2/promise')

// const pool=mysql.createPool({
//     host:'localhost',
//     user:'root',
//     password:'mysql',
//     database:'school_db'
// })

// module.exports=pool 
console.log(process.env.DB_HOST)
const mysql = require("mysql2");

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

connection.connect((err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the MySQL server.');
});

module.exports = connection;