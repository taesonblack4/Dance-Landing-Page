const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.adminLogin = async (req,res) => {
    const users = await prisma.super.findMany();
    const user = users.find(user => user.username === req.body.username);

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    if(user == null) { 
        res.status(400).send('could not find user');
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            //res.send('SUCCESS!!');
            res.json({accessToken: accessToken});
        } else {
            res.send('Wrong Info');
        }
    } catch {
        res.status(500).send('error logging in');
    }
};

exports.userLogin = async (req,res) => {
    const users = await prisma.user.findMany();
    const user = users.find(user => user.username === req.body.username);
    
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    
    if(user == null) { 
        res.status(400).send('could not find user');
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            //res.send('SUCCESS!!');
            res.json({accessToken: accessToken});
        } else {
            res.send('Wrong Info');
        }
    } catch {
        res.status(500).send('error logging in');
    }
}