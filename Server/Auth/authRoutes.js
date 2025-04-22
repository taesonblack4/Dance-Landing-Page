const express = require('express');
const router = express.Router();
const { adminLogin, userLogin} = require('./authControllers');

router.post('/authentication/user/login', userLogin );
router.post('/authentication/admin/login', adminLogin );

module.exports = router;