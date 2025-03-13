const express = require('express');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient;

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

//landing page
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
app.put('/admin/clients/:id', async (req,res) => {
    const { id } = req.params;
    const { name ,email, phone, services, technique} = req.body;

    const dancer = await prisma.dancer.update({
        where: {id: parseInt(id)},
        data: {full_name: name,email, phone_number: phone, services, technique}
    });

    res.json(dancer);
});

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