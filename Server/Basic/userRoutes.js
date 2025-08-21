const express = require('express');
const router = express.Router();
const {authUser} = require('../Middlewares/auth') //authenticate that user has token
const {
    getUsers, //fetch all enrolled users
    getUser, //fetch user by ID
    getMe, //fetch signed in user
    createUser, //create enrolled user
    deleteUser, //delete enrolled user
    createLead, //create lead from contact form
    updateUser, //update enrolled user information
    getPosts, //fetch posts from admin
    getAnnouncements, //fetch posts with 'announcement' type
    getPromotions, //fetch posts with 'promotion' type
    createGoal, //create goal from enrolled user
    getAllGoals, //fetch goals from enrooled users
    getMyGoals, //fetch goals from signedin user
    updateGoal, //update goal from enrolled user
    deleteGoal, //delete goal from enrolled user
    getUserDashbaord //user dashbaord data 
} = require('./userControllers');

router.route('/users').get(getUsers).post(createUser);

//if i removed the '/basic' then the user login fails due to missing ID
router.get('/basic/users/:id', getUser);
router.get('/users/me', authUser,getMe);
router.get('/users/me/dashboard', authUser, getUserDashbaord);
router.get('/users/goals', getAllGoals);


router.get('/posts', getPosts)
router.get('/posts/announcements', getAnnouncements);
router.get('/posts/promos', getPromotions);

router.post('/leads', createLead);


router.route('/users/me/goals').all(authUser).get(getMyGoals).post(createGoal);

router.route('/users/me/goals/:goalID').all(authUser).put(updateGoal).delete(deleteGoal);

router.route('/users/:id').put(updateUser).delete(deleteUser);


module.exports = router;