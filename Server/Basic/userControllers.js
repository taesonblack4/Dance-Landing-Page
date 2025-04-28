const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req,res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true}
        });
        res.json({success: true, data: users });
    } catch (err) {
        next(err);
    }
};

exports.createUser = async (req,res,next) => {

    try {
        const existingUser = await prisma.user.findUnique({
            where: {username: req.body.username}
        });

        if(existingUser) {
            throw new Error('Username already exists', {statusCode: 409});
        }

        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            },
            select: { id:true, username:true }
        });
        res.status(201).json({success: true, data:user});
    } catch (err) {
        next(err);
    }

};

exports.createLead = async (req,res) => {
    const { name, 
        email, 
        phone, 
        services , 
        technique, 
        message 
    } = req.body;

    const lead = await prisma.leads.create({
        data: {full_name: name, email, phone_number: phone, services, technique, message}
    });

    res.json(lead);
};