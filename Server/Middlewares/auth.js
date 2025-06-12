/* 
TOKEN VERIFICATION LOGIC

WHY THIS MATTERS:

Reusability --> Use across multiple routes (admin/basic users)

Security Centralization --> Single place to update auth logic

Clean Code --> Removes auth logic from server.js
*/

const jwt = require('jsonwebtoken');

const authenticate = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ success: false, message: 'Invalid token' });

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      req.user = user;
      next();
    });
  };
};

module.exports = {
  authUser: authenticate(['user']),
  authAdmin: authenticate(['super']),
  authenticate // export the raw version for flexibility
};
