const express = require('express');
const router = express.Router();
const {authenticate} = require('../Middlewares/auth')
const {
    getAdmins, 
    getLeads, 
    createAdmin, 
    updateLead, 
    deleteLead
} = require('./adminControllers');

router.get('/users/',getAdmins);
router.get('/leads/', authenticate,getLeads);
router.post('/users/', createAdmin);
router.put('/leads/:id', authenticate,updateLead);
router.delete('/leads/:id', authenticate,deleteLead);



module.exports = router;