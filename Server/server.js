require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const errorHandler = require('./Middlewares/errorHandler');
const app = express();

// const adminRoutes = require('./Admin/adminRoutes');
// const userRoutes = require('./Basic/userRoutes');
// const authRoutes = require('./Auth/authRoutes');

//Middleware
app.use(express.json());
app.use(cors());

//Route mounting
app.use('/admin', require('./Admin/adminRoutes'));
app.use('/auth', require('./Auth/authRoutes'));
app.use('/basic', require('./Basic/userRoutes'));

//landing page client form
// app.get('/admin/leads/', adminRoutes);
// app.post('/basic/leads', userRoutes);

//client data from form
// app.put('/admin/leads/:id', adminRoutes);
// app.delete('/admin/leads/:id', adminRoutes);

//-------------------------------------------------------------------------------------------------//

//dashboard
// const adminProtect = async (req, res, next) => {
//     // Verify user is an admin and exists in database
//     req.authoriza
//     const userId = await jsonwebtoken.decrypt(j)
//    const error = new Error('User not logged in'); 
    
//     next()
// }

//USERS
// app.get('/admin/users/', authenticateToken,adminRoutes);
// app.get('/basic/users', authenticateToken, userRoutes);
//CREATE
// app.post('/admin/users', adminRoutes);
// app.post('/basic/users', userRoutes);
//LOGIN
// app.post('/authentication/admin/login', authRoutes);
// app.post('/authentication/user/login', authRoutes);

// function authenticateToken(req,res,next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if(token == null) return res.sendStatus(401);

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if(err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     })
// }

app.use(errorHandler);

app.listen(4004,()=> {
    console.log('app is running on port 4004');
});