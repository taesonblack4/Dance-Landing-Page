const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const {
    startOfWeek,
    endOfWeek,
    startOfDay,
    endOfDay
} = require('date-fns')

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

exports.getAdminDashboard = async (req,res) => {
    try {
        const now = new Date();

        //compute boundaries , week starts on the Monday of the current date (1 = Monday)
        const weekStart = startOfWeek(now,{weekStartsOn: 1});
        const weekEnd = endOfWeek(now, {weekStartsOn: 1});
        const todayStart = startOfDay(now);
        const todayEnd = endOfDay(now);

        // Queries
        const [
            usersThisWeek,
            leadsThisWeek,
            userCount,
            leadCount,
            latestPost
        ] = await Promise.all([
            /*
             created_at: {
                gte: weekStart, // created_at >= weekStart
                lte: weekEnd    // created_at <= weekEnd
            }
             */
            //count all the users created this week , using (User.creationDate)
            prisma.user.count({
                where: {creationDate: {gte: weekStart, lte: weekEnd}}
            }),
            //count all the leads created this week , using (Leads.submitted_at)
            prisma.leads.count({
                where: {submitted_at: {gte: weekStart, lte: weekEnd}}
            }),
            //total users
            prisma.user.count(),
            //total leads
            prisma.leads.count(),
            //latest post
            prisma.post.findFirst({
                orderBy: {created_at: 'desc'},
                take: 1
            })
        ]);

        res.json({
            usersThisWeek,
            leadsThisWeek,
            userCount,
            leadCount,
            latestPost
        })

    } catch (err) {
        console.error('error fetching Admin Dashboard: ', err);
        res.status(500).json({success: false, message: 'Failed to load Dashboard', error: err.message});
    }
};

exports.deleteUserById = async (req,res) => {
    try {
        const { id } = req.params;
        if(!id) {
            return res.status(400).json({error: 'Missing user ID'});
        }
        await prisma.user.delete({
            where: {id: parseInt(id)}
        });
        res.json(`User with ID: ${id} has been deleted`)
    } catch (error) {
        console.error('error deleting user: ', error);
    }
};


