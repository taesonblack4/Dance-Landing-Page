const express = require('express');
const router = express.Router();
//USER AUTHENTICATION
const {authAdmin} = require('../Middlewares/auth')
//ADMIN
const {
    getAdmins, 
    getLeads, 
    createAdmin, 
    updateLead, 
    deleteLead,
    createPost,
    getPost,
    deletePost,
    updatePost,
    getAdminDashboard,
    deleteUserById
} = require('./adminControllers');
//COMMON
const {getPosts,
} = require('../Basic/userControllers');

//FETCH
router.get('/users/',getAdmins);
router.get('/leads/', authAdmin,getLeads);
router.get('/posts',getPosts );
router.get('/posts/:id', getPost);
router.get('/dashboard/', authAdmin,getAdminDashboard);
//CREATE
router.post('/users/', createAdmin);
router.post('/posts/', createPost);
//UPDATE
router.put('/leads/:id', authAdmin,updateLead);
router.put('/posts/:id', updatePost)
//DELETE
router.delete('/leads/:id', authAdmin,deleteLead);
router.delete('/posts/:id', deletePost);
router.delete('/users/:id', authAdmin, deleteUserById);



module.exports = router;