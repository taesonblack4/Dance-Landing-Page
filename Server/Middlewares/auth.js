/* 
TOKEN VERIFICATION LOGIC

WHY THIS MATTERS:

Reusability --> Use across multiple routes (admin/basic users)

Security Centralization --> Single place to update auth logic

Clean Code --> Removes auth logic from server.js
*/

const jwt = require('jsonwebtoken');

const authenticate = (allowedRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    try {
      const user = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });

      console.log("Authenticated user:", user);

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
  };
};

module.exports = {
  authUser: authenticate(['user']),
  authAdmin: authenticate(['super']),
  authenticate // export the raw version for flexibility
};
