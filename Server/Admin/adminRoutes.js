const express = require('express');
const router = express.Router();
const {authAdmin} = require('../Middlewares/auth')
const {
    getAdmins, 
    getLeads, 
    createAdmin, 
    updateLead, 
    deleteLead,
    createPost,
    getPost
} = require('./adminControllers');

const {getPosts, getAnnouncements, getPromotions} = require('../Basic/userControllers')

router.get('/users/',getAdmins);
router.get('/leads/', authAdmin,getLeads);
router.get('/posts',getPosts );
router.get('/posts/:id', getPost);
router.post('/users/', createAdmin);
router.post('/posts/', createPost);
router.put('/leads/:id', authAdmin,updateLead);
router.delete('/leads/:id', authAdmin,deleteLead);



module.exports = router;