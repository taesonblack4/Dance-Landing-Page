const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAdmins = async (req,res) => {
    const users = await prisma.super.findMany();
    res.json(users);
};

exports.getLeads = async (req,res,next) => {
    try {
        const leads = await prisma.leads.findMany();
        res.json({
            success: true, 
            data: leads
        })
    } catch (error) {
        next(error)
    }
}

exports.createAdmin = async (req,res) => {

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

};

exports.updateLead = async (req,res) => {
    const { id } = req.params;
    const { full_name ,email, phone_number, services, technique} = req.body;

    const lead = await prisma.leads.update({
        where: {id: parseInt(id)},
        data: {full_name,email, phone_number, services, technique}
    });

    res.json(lead);
}

exports.deleteLead =  async (req,res) => {
    const { id } = req.params;
    await prisma.leads.delete({
        where: {id: parseInt(id)}
    });
    res.json('Lead deleted');
};