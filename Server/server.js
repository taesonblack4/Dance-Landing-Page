require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const errorHandler = require('./Middlewares/errorHandler');
const app = express();


//Middleware
app.use(express.json());
app.use(cors());

//Route mounting
app.use('/admin', require('./Admin/adminRoutes'));
app.use('/auth', require('./Auth/authRoutes'));
app.use('/basic', require('./Basic/userRoutes'));



app.use(errorHandler);

app.listen(4004,()=> {
    console.log('app is running on port 4004');
});