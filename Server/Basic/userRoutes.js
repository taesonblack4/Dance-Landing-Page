const express = require('express');
const router = express.Router();
const {authUser} = require('../Middlewares/auth')
const {
    getUsers,
    getUser, 
    getMe,
    createUser,
    deleteUser, 
    createLead, 
    updateUser, 
    getPosts, 
    getAnnouncements,
    getPromotions
} = require('./userControllers');

/* Fetch Routes */
router.get('/users', getUsers); // get all users
//if i removed the '/basic' then the user login fails due to missing ID
router.get('/basic/users/:id', getUser); //get single user
router.get('/users/me', authUser,getMe) // get signedin user
router.get('/posts', getPosts)
router.get('/posts/announcements', getAnnouncements);
router.get('/posts/promos', getPromotions);

/* Create Routes */
router.post('/users', createUser);
router.post('/leads', createLead);

/* Update Routes */
router.put('/users/:id', updateUser);

/* Delete Routes */
router.delete('/users/:id', deleteUser)

module.exports = router;