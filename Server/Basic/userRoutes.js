const express = require('express');
const router = express.Router();
const {getUsers , createUser, createLead} = require('./userControllers');

router.get('/basic/users', getUsers);
router.post('/users', createUser);
router.post('/leads', createLead);

module.exports = router;