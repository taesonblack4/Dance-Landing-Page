const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req,res) => {
    const users = await prisma.user.findMany();
    res.json(users);
    //this is from authentixation video, not sure how to implement
    //res.json(users.filter(user => user.username === req.user.name))
};

exports.createUser = async (req,res) => {

    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {username, password: hashedPassword}
        });
        res.status(201).json(user);
    } catch {
        res.status(500).send('error creating user');
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