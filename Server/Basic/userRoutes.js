const express = require('express');
const router = express.Router();
const {authUser} = require('../Middlewares/auth')
const {getUsers ,getUser, getMe,createUser, createLead, updateUser} = require('./userControllers');

router.get('/users', getUsers); // get all users
//if i removed the '/basic' then the user login fails due to missing ID
router.get('/basic/users/:id', getUser); //get single user
router.get('/users/me', authUser,getMe) // get signedin user
router.post('/users', createUser);
router.post('/leads', createLead);
router.put('/users/:id', updateUser);

module.exports = router;