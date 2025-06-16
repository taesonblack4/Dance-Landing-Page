const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginHandler = (userType) => async (req, res, next) => {
    try {
        const {username , password} = req.body;
        //validate input
        if( !username || !password) {
            throw new Error('missing credentials', { statusCode: 400 })
        }
        //database query
        const user = await prisma[userType].findUnique({
            where: {username}
        });
        //validate credentials
        if(!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials', {statusCode: 401});
        }
        //create token
        const accessToken = jwt.sign(
            {
                userId: user.id, 
                role: userType.toLowerCase()
            }, //safer payload
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1h'}
        );
        //standard response
        res.json({
            success: true,
            token: accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.adminLogin = loginHandler('Super');
exports.userLogin = loginHandler('user');



