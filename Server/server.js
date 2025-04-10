const express = require('express');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

//landing page client form
app.get('/clients/', async (req,res) => {
    const dancers = await prisma.dancer.findMany();
    res.json(dancers);
})

app.post('/clients/', async (req,res) => {
    const { name, 
        email, 
        phone, 
        services , 
        technique, 
        message 
    } = req.body;

    const dancer = await prisma.dancer.create({
        data: {full_name: name, email, phone_number: phone, services, technique, message}
    });

    res.json(dancer);
});

//-------------------------------------------------------------------------------------------------//

//dashboard
// const adminProtect = async (req, res, next) => {
//     // Verify user is an admin and exists in database
//     req.authoriza
//     const userId = await jsonwebtoken.decrypt(j)
//    const error = new Error('User not logged in'); 
    
//     next()
// }

//admin users
app.get('/admin/users/', async (req,res) => {
    const users = await prisma.super.findMany();
    res.json(users);
})

app.post('/admin/users', async (req,res) => {

    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.super.create({
            data: {username, password: hashedPassword}
        });
        res.status(201).json(user);
    } catch {
        res.status(500).send('error creating user');
    }

})

app.post('/admin/users/login', async (req,res) => {
    const users = await prisma.super.findMany();
    const user = users.find(user => user.username === req.body.username);
    if(user == null) { 
        res.status(400).send('could not find user');
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('SUCCESS!!');
        } else {
            res.send('Wrong Info');
        }
    } catch {
        res.status(500).send('error logging in');
    }
})

//base users
app.get('/users/', async (req,res) => {
    const users = await prisma.user.findMany();
    res.json(users);
})

app.post('/users', async (req,res) => {

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

})

app.post('/users/login', async (req,res) => {
    const users = await prisma.user.findMany();
    const user = users.find(user => user.username === req.body.username);
    if(user == null) { 
        res.status(400).send('could not find user');
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('SUCCESS!!');
        } else {
            res.send('Wrong Info');
        }
    } catch {
        res.status(500).send('error logging in');
    }
})


//client data from form
app.put('/admin/clients/:id', async (req,res) => {
    const { id } = req.params;
    const { name ,email, phone, services, technique} = req.body;

    const dancer = await prisma.dancer.update({
        where: {id: parseInt(id)},
        data: {full_name: name,email, phone_number: phone, services, technique}
    });

    res.json(dancer);});

app.delete('/admin/clients/:id', async (req,res) => {
    const { id } = req.params;
    await prisma.dancer.delete({
        where: {id: parseInt(id)}
    });
    res.json('dancer deleted');
});

app.listen(4004,()=> {
    console.log('app is running on port 4004');
});