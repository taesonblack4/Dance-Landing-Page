const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAdmins = async (req,res) => {
    const users = await prisma.super.findMany();
    res.json(users);
};

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


exports.getPost = async (req,res) => {
    try {
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({error: "Missing ID"});
        }

        const post = await prisma.post.findUnique({
            where: {id: parseInt(id)}
        });

        if(!post) {
            return res.status(404).json({error: 'Post not found'});
        }

        res.json({
            success: true,
            data: post
        });

    } catch (error) {
        console.error('error fetching post: ', error);
        res.status(500).json({error: 'internal server Error'});
    }
};

exports.createPost = async (req, res) => {
    try {
        const {type , title, content, category, audience , created_at} = req.body;
        const post = await prisma.post.create({
            data: {
                type,
                title,
                content,
                category,
                audience,
                created_at
            },
            select: {
                id: true,
                type: true, 
                title: true, 
                content: true, 
                category: true , 
                audience: true, 
                created_at:true
            }
        })
        res.status(201).json({success: true, data: post});
    } catch (error) {
        res.status(500).send('error creating post');
    }
};

exports.updatePost = async (req,res) => {
    try {
        const {id} = req.params;
        const {
            type,
            title,
            content,
            category,
            audience
        } = req.body;

        const post = await prisma.post.update({
            where: {id: parseInt(id)},
            data: {
                type,
                title,
                content,
                category,
                audience
            }
        });

        res.json(post);
    } catch (error) {
        console.log('error updating post: ', error);
    }
};

exports.deletePost = async (req,res) => {
    try {
       const {id} = req.params;
       await prisma.post.delete({
        where: {id: parseInt(id)}
       });
       res.json('Post has been deleted')
    } catch (error) {
        console.error('error deleting post: ', error);
    }
}


