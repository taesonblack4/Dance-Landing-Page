/* 
TOKEN VERIFICATION LOGIC

WHY THIS MATTERS:

Reusability --> Use across multiple routes (admin/basic users)

Security Centralization --> Single place to update auth logic

Clean Code --> Removes auth logic from server.js
*/

const jwt = require('jsonwebtoken');

// Reusable authentication middleware
const authenticate = (req, res, next) => {
  // 1. Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer <token>

  // 2. No token → Deny access
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // 3. Verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // 4. Attach user data to request
    req.user = user;
    next();
  });
};

module.exports = { authenticate };