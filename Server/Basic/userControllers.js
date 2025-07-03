const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req,res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: { 
                id: true, 
                username: true,
                full_name: true,
                title: true,
                email: true,
                phone_number: true,
                location: true,
                services: true,
                technique: true,
                experience: true,
                age: true,
                birthday: true,
                notes: true
            }
        });
        res.json({success: true, data: users });
    } catch (err) {
        next(err);
    }
};

exports.getUser = async (req,res,next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({error: 'Missing ID'})
        } 

        const user = await prisma.user.findUnique({
            where: {id: parseInt(id)}
        });

        if(!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getMe = async (req, res) => {
    try {
        const userId = req.user.userId; // from JWT payload
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                full_name: true,
                email: true,
                phone_number: true,
                location: true,
                age: true,
                title: true,
                technique: true,
                experience: true,
                birthday: true,
                services: true
            }
        });
        console.log(req.user)
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: 'Failed to get user data' });
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

        const {username, password, full_name, email, phone_number, location, age} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                full_name,
                email,
                phone_number,
                location,
                age
            },
            select: { id:true, username:true, full_name: true, email: true, phone_number: true, location: true, age: true }
        });
        res.status(201).json({success: true, data:user});
    } catch (err) {
        next(err);
    }

};

exports.updateUser = async (req,res) => {
    const { id } = req.params;
    const { 
        full_name,
        email, 
        phone_number,
        title,
        experience,
        location,
        birthday,
        age,
        services, 
        technique} = req.body;

    const user = await prisma.user.update({
        where: {id: parseInt(id)},
        data: {
            full_name,
            email, 
            phone_number, 
            title,
            experience,
            location,
            birthday: new Date(birthday),
            age, 
            services, 
            technique
        }
    });

    res.json(user);
}

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

exports.getPosts = async (req,res) => {
    try {
        const posts = await prisma.post.findMany({
        select: {
            id: true, 
            type: true,
            title: true, 
            content: true, 
            category: true , 
            audience: true, 
            created_at:true,
            updated_at: true,
            deleted_at: true
        }
       });

       res.json({success: true, data: posts});
    } catch (error) {
        console.error('error fetching posts: ', error);
    }
};

exports.getAnnouncements = async (req,res) => {
    try {
        const announcements = await prisma.post.findMany({
            where: {type: 'Announcement'},
            select: {
                id: true, 
                type: true,
                title: true, 
                content: true, 
                category: true , 
                audience: true, 
                created_at:true,
                updated_at: true
            }
        });
        res.json({success: true, data:announcements})
    } catch (error) {
        console.error('error fetching announcements: ', error);
    }
};

exports.getPromotions = async (req,res) => {
    try {
       const promotions = await prisma.post.findMany({
        where: {type: 'Promotion'},
        select: {
            id: true, 
            type: true,
            title: true, 
            content: true, 
            category: true , 
            audience: true, 
            created_at:true,
            updated_at: true
        }
       });
       res.json({success: true, data: promotions})
    } catch (error) {
        console.error('error fetching promotions: ', error);
    }
}