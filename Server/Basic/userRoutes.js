const express = require('express');
const router = express.Router();
const {getUsers ,getUser, createUser, createLead, updateUser} = require('./userControllers');

router.get('/basic/users', getUsers);
router.get('/basic/users/:id', getUser);
router.post('/users', createUser);
router.post('/leads', createLead);
router.put('/users/:id', updateUser);

module.exports = router;