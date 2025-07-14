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
    updatePost
} = require('./adminControllers');
//COMMON
const {getPosts, 
    getAnnouncements, 
    getPromotions
} = require('../Basic/userControllers');

//FETCH
router.get('/users/',getAdmins);
router.get('/leads/', authAdmin,getLeads);
router.get('/posts',getPosts );
router.get('/posts/:id', getPost);
//CREATE
router.post('/users/', createAdmin);
router.post('/posts/', createPost);
//UPDATE
router.put('/leads/:id', authAdmin,updateLead);
router.put('/posts/:id', updatePost)
//DELETE
router.delete('/leads/:id', authAdmin,deleteLead);
router.delete('/posts/:id', deletePost);



module.exports = router;