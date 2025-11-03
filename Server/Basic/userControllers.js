const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req,res, next) => {
    try {
        const users = await prisma.user.findMany({
            include:{
                goals: true
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
        const userId = req.userId // from JWT payload
        const user = await prisma.user.findUnique({
            where: { id: userId }
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
            }
        });
        res.status(201).json({success: true, data:user});
    } catch (err) {
        next(err);
    }

};

exports.updateUser = async (req,res) => {
    const userId = req.userId;
   
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
        technique
    } = req.body;

    const data = {} //only update what new data is passed
    if(full_name) data.full_name = full_name;
    if(email) data.email = email;
    if(phone_number) data.phone_number = phone_number;
    if(title) data.title = title;
    if(experience) data.experience = experience;
    if(location) data.location = location;
    if(birthday) data.birthday = new Date(birthday);
    if(age) data.age = age;
    if(services) data.services = services;
    if(technique) data.technique = technique;

    const user = await prisma.user.update({
        where: {id: parseInt(userId)},
        data
    });

    res.json(user);
}

exports.updateUserById = async (req,res) => {
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
        technique
    } = req.body;

    const data = {} //only update what new data is passed
    if(full_name) data.full_name = full_name;
    if(email) data.email = email;
    if(phone_number) data.phone_number = phone_number;
    if(title) data.title = title;
    if(experience) data.experience = experience;
    if(location) data.location = location;
    if(birthday) data.birthday = new Date(birthday);
    if(age) data.age = age;
    if(services) data.services = services;
    if(technique) data.technique = technique;

    const user = await prisma.user.update({
        where: {id: parseInt(id)},
        data
    });

    res.json(user);
   
} 

exports.deleteUser = async (req,res) => {
    try {
        const userId = req.userId;
        await prisma.user.delete({
            where: {id: parseInt(userId)}
        });
        res.json(`User with ID: ${userId} has been deleted`)
    } catch (error) {
        console.error('error deleting user: ', error);
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

exports.getPosts = async (req,res) => {
    try {
        const posts = await prisma.post.findMany();

       res.json({success: true, data: posts});
    } catch (error) {
        console.error('error fetching posts: ', error);
    }
};

exports.getAnnouncements = async (req,res) => {
    try {
        const announcements = await prisma.post.findMany({
            where: {type: 'Announcement'}
        });
        res.json({success: true, data:announcements})
    } catch (error) {
        console.error('error fetching announcements: ', error);
    }
};

exports.getPromotions = async (req,res) => {
    try {
       const promotions = await prisma.post.findMany({
        where: {type: 'Promotion'}
       });
       res.json({success: true, data: promotions})
    } catch (error) {
        console.error('error fetching promotions: ', error);
    }
};

exports.getAllGoals = async (req,res) => {
    try {
        const goals = await prisma.goal.findMany();
        res.json({success: true, data: goals})
        
    } catch (error) {
        console.error('failed fetching goals: ', error)
    }
};

exports.getMyGoals = async (req,res) => {
    try {
        const userId = req.userId
        if(!userId) {
            return res.status(401).json({ success: false, message: 'Unauthenticated' });
        }
        const goals = await prisma.goal.findMany({
            where: {userId: parseInt(userId)},
            orderBy: {updated_at: 'desc'}
        })

        res.json({success: true, data: goals})
    } catch (error) {
        console.error('failed fetching User goals', error);
        return res.status(500).json({ success: false, message: 'Error fetching goals' });
    }
}

exports.createGoal = async (req,res) => {
    try {
        const userId = req.userId

        if(!userId) {
            return res.status(401).json({ success: false, message: 'Unauthenticated' });
        }

        const {
            title,
            description,
            status,
            category
        } = req.body;

        if(!title) {
            return res.status(500).json({error: 'title is required'});
        }

        const goal = await prisma.goal.create({
            data: {
                title,
                description,
                status,
                category,
                userId: parseInt(userId),
            }
        })

        return res.status(201).json({ success: true, data: goal });
    } catch (error) {
       console.error('error creating goal: ', error);
       return res.status(500).json({ success: false, message: 'Error creating goal' });
    }
};

exports.updateGoal = async (req,res) => {
    try {
        const goalID = parseInt(req.params.goalID);
        const userId = req.userId;
        if (!goalID) return res.status(400).json({ success: false, message: 'Missing goal ID' });
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

        const {
            title,
            description,
            status,
            category
        } = req.body;

        // console.log('Params ID:', id);
        // console.log('Request body:', req.body);

        const data = {}; //only update what new data is passed
        if (title) data.title = title;
        if (description) data.description = description;
        if (status) data.status = status;
        if (category) data.category = category;
        
        const result = await prisma.goal.update({
            where: {id: goalID, userId: parseInt(userId)},
            data
        })

        if (result.count === 0) {
            return res.status(404).json({ success: false, message: 'Goal not found or not owned by user' });
        }

        const updatedGoal = await prisma.goal.findUnique({ 
            where: { id: goalID } 
        });
        return res.json({ success: true, data: updatedGoal });
        
    } catch (error) {
        console.error('failed to update goal: ', error);
        res.status(500).json({ success: false, message: 'Error updating goal', error });
    }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goalID = parseInt(req.params.goalID);
    const userId = req.userId

    if (!goalID) return res.status(400).json({ success: false, message: 'Missing goal ID' });
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

    // Optional: enforce user ownership if your schema has userId
    const deletedGoal = await prisma.goal.deleteMany({
      where: {
        id: goalID,
        userId: parseInt(userId) // comment this out if not enforcing ownership
      }
    });

    if (deletedGoal.count === 0) {
      return res.status(404).json({ success: false, message: `No goal found with ID ${goalID}` });
    }

    res.json({ success: true, message: `Successfully deleted goal with ID: ${goalID}` });

  } catch (error) {
    console.error('failed to delete goal: ', error);
    res.status(500).json({ success: false, message: 'Error deleting goal', error });
  }
};

exports.getUserDashbaord = async (req,res) => {

    try {
        const userId = req.user.id; // from auth middleware which decodes JWT
        if(!userId) {
            return res.status(401).json({success: false})
        }

        const activeGoals = await prisma.goal.findMany({
            where: {userId, status: {not: 'completed'} },
            orderBy: {updated_at: 'desc'},
            take: 3
        })

        const latestPost = await prisma.post.findFirst({
            orderBy: {created_at: 'desc'}
        })

        res.json({activeGoals, latestPost});
    } catch (error) {
        console.error('error fetching User Dashboard:', error);
        res.status(500).json({success:false, message: 'Failed to load Dashboard', error: error.message})
    }
};

exports.resetPassword = async (req,res) => {
    try {
        const userId = req.userId;
        if(!userId) {
            return res.status(401).json({ success: false, message: 'Unauthenticated' });
        }

        const { newPassword , currentPassword } = req.body;
        if(!newPassword || !currentPassword) {
            return res.status(400).json({ success: false, message: 'Missing passwords' });
        }

        //get user from JWT 
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });
        if(!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if(!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { password: hashedPassword }
        });

        res.json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        console.error('error resetting password: ', error);
        res.status(500).json({ success: false, message: 'Error resetting password' });
    }
};
