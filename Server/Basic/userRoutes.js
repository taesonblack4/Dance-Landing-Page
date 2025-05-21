const express = require('express');
const router = express.Router();
const {getUsers ,getUser, createUser, createLead} = require('./userControllers');

router.get('/basic/users', getUsers);
router.get('/basic/users/:id', getUser);
router.post('/users', createUser);
router.post('/leads', createLead);

module.exports = router;