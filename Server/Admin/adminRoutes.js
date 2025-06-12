const express = require('express');
const router = express.Router();
const {authAdmin} = require('../Middlewares/auth')
const {
    getAdmins, 
    getLeads, 
    createAdmin, 
    updateLead, 
    deleteLead
} = require('./adminControllers');

router.get('/users/',getAdmins);
router.get('/leads/', authAdmin,getLeads);
router.post('/users/', createAdmin);
router.put('/leads/:id', authAdmin,updateLead);
router.delete('/leads/:id', authAdmin,deleteLead);



module.exports = router;