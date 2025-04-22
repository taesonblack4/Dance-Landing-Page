const express = require('express');
const router = express.Router();
const {getUsers , createUser, createLead} = require('./userControllers');

router.get('/basic/users', getUsers);
router.post('/basic/users', createUser);
router.post('/basic/leads', createLead);

module.exports = router;