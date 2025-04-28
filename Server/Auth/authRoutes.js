const express = require('express');
const router = express.Router();
const { adminLogin, userLogin} = require('./authControllers');
const { validateLogin } = require('../Middlewares/validators')

router.post('/user/login',validateLogin, userLogin );
router.post('/admin/login',validateLogin ,adminLogin );

module.exports = router;