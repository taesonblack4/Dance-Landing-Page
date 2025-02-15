const express = require('express');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient;

const app = express();
app.use(express.json());

app.get('/', async (req,res) => {
    const dancers = await prisma.dancer.findMany();
    res.json(dancers);
})

app.post('/clients', async (req,res) => {
    const { name, 
        email, 
        phone, 
        services , 
        technique, 
        message 
    } = req.body;
    const dancer = await prisma.dancer.create({
        data: {name, email, phone, services, technique, message}
    });
    //need a better way to display
    res.json(dancer);
});

app.put('/clients/:id', (req,res) => {
    //update client
    //what would be updated in this context?
    const { id } = req.params;
    const { name} = req.body;
    res.json(`${id} -- ${name}`);
});

app.delete('/clients/:id', (req,res) => {
    const { id } = req.params;
    res.json(`${id} has been deleted`);
});

app.listen(4004,()=> {
    console.log('app is running on port 4004');
});