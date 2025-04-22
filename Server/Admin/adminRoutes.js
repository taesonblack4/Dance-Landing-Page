const express = require('express');
const router = express.Router();
const {getAdmins, getLeads, createAdmin, updateLead, deleteLead} = require('./adminControllers');

router.get('/admin/users/', getAdmins);
router.get('/admin/leads/', getLeads);
router.post('/admin/users/', createAdmin);
router.put('/admin/leads/:id', updateLead);
router.delete('/admin/leads/:id', deleteLead);



module.exports = router;