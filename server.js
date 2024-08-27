const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const pool = require('./ConnectDb/db'); 
const schoolRoutes=require('./Routes/schoolRoutes.js')

app.use(morgan("dev"));
app.use(express.json());
app.use('/api/v1/school_management',schoolRoutes)
const PORT = process.env.PORT || 4000;


//db connection

// pool.query('SELECT 1').then(() => {
//     console.log("MySQL DB connected");
//     app.listen(PORT, () => {
//         console.log("Listening on port", PORT);
//     });
// }).catch((err) => {
//     console.log("Error connecting to the database:", err);
// });
