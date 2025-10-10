// base URL from environment variable
const baseurl = import.meta.env.VITE_API_HOST

// group routes logically by resource

export const AUTH_ROUTES = {
    adminLogin: `${baseurl}/auth/admin/login`, // POST admin login
    userLogin: `${baseurl}/auth/user/login`, // POST user login
}

export const ADMIN_ROUTES = {
    allAdmins: `${baseurl}/admin/users`, // GET all admins / POST create admin
    userById: (id) => `${baseurl}/admin/users/${id}`, // DELETE admin by ID
    dashboard: `${baseurl}/admin/dashboard`, // GET admin dashboard data
    allLeads: `${baseurl}/admin/leads`, // GET all leads
    leadById: (id) => `${baseurl}/admin/leads/${id}`, // PUT/DELETE lead by ID
    allPosts: `${baseurl}/admin/posts`, // GET all posts / POST create post
    postById: (id) => `${baseurl}/admin/posts/${id}`, // GET/PUT/DELETE post by ID
}

export const USER_ROUTES = {
    all: `${baseurl}/basic/users`, // GET all users / POST create user
    me: `${baseurl}/basic/users/me`, // GET/PUT/DELETE signed-in user
    myDashboard: `${baseurl}/basic/users/me/dashboard`, // GET signed-in user dashboard data
    userById: (id) => `${baseurl}/basic/users/${id}`, // GET user by ID passed through param
    registerById: (id) => `${baseurl}/basic/users/register/${id}`, // PUT user registration by ID without token
}
//fix routes
export const GOAL_ROUTES = {
    all: `${baseurl}/basic/users/goals`, // GET all goals 
    myGoals: `${baseurl}/basic/users/me/goals`, // GET/POST signed-in user's goals
    goalById: (goalID) => `${baseurl}/basic/users/me/goals/${goalID}`, // PUT/DELETE goal by ID
}
//fix routes
export const POST_ROUTES = {
    all: `${baseurl}/basic/posts`, // GET all posts,
    announcements: `${baseurl}/basic/posts/announcements`, // GET announcement posts
    promotions: `${baseurl}/basic/posts/promos`, // GET promotion posts
}
//fix route
export const LEAD_ROUTES = {
    create: `${baseurl}/basic/leads`, // POST create lead from contact form
}