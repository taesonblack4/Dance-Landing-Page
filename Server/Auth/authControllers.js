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
                role: 'super'
            }, //safer payload
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1h'}
        );
        //standard response
        res.json({
            success: true,
            data: {accessToken}
        });
    } catch (err) {
        next(err);
    }
};

exports.adminLogin = loginHandler('super');
exports.userLogin = loginHandler('user');



// exports.adminLogin = async (req,res) => {
//     const users = await prisma.super.findMany();
//     const user = users.find(user => user.username === req.body.username);

//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

//     if(user == null) { 
//         res.status(400).send('could not find user');
//     }
//     try {
//         if(await bcrypt.compare(req.body.password, user.password)) {
//             //res.send('SUCCESS!!');
//             res.json({accessToken: accessToken});
//         } else {
//             res.send('Wrong Info');
//         }
//     } catch {
//         res.status(500).send('error logging in');
//     }
// };

// exports.userLogin = async (req,res) => {
//     const users = await prisma.user.findMany();
//     const user = users.find(user => user.username === req.body.username);
    
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    
//     if(user == null) { 
//         res.status(400).send('could not find user');
//     }
//     try {
//         if(await bcrypt.compare(req.body.password, user.password)) {
//             //res.send('SUCCESS!!');
//             res.json({accessToken: accessToken});
//         } else {
//             res.send('Wrong Info');
//         }
//     } catch {
//         res.status(500).send('error logging in');
//     }
// }