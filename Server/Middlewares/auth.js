/* 
TOKEN VERIFICATION LOGIC

WHY THIS MATTERS:

Reusability --> Use across multiple routes (admin/basic users)

Security Centralization --> Single place to update auth logic

Clean Code --> Removes auth logic from server.js
*/

/**
 *
 * - Verifies JWT token
 * - Normalizes common id claim names (userId, id, sub, uid) into:
 *     req.userRaw  -> full decoded token (unchanged)
 *     req.user     -> decoded token (copy) with guaranteed numeric .id and .userId when present/parsable
 *     req.userId   -> numeric id (or undefined)
 *
 * - Keeps existing role-based allowlist functionality
 *
 * Usage:
 *   const { authUser, authAdmin, authenticate } = require('./middlewares/auth');
 *   router.get('/users/me', authUser, getMe);
 */

const jwt = require('jsonwebtoken');

/**
 * Try to extract a numeric id from a decoded token object.
 * Accept common claim names (userId, id, sub, uid). Return undefined if none parsable.
 *
 * This helper is intentionally tolerant of numeric strings (e.g. "123") and numeric values.
 */


function extractNumericIdFromToken(decoded) {
  if (!decoded || typeof decoded !== 'object') return undefined;

  const candidates = ['userId', 'id', 'sub', 'uid'];
  for (const key of candidates) {
    const val = decoded[key];
    if (val === undefined || val === null) continue;
    // Accept numbers and numeric strings
    const num = Number(val);
    if (!Number.isNaN(num) && Number.isFinite(num)) return num;
  }
  return undefined;
}

/**
 * Main factory
 * allowedRoles: array of allowed role strings (e.g. ['user'], ['super'])
 *
 * Notes on behavior:
 * - If allowedRoles is provided and non-empty, the decoded token must contain a role that matches.
 * - The middleware attaches:
 *     req.userRaw -> original decoded token (useful for debugging / advanced)
 *     req.user    -> copy of decoded token, with .id and .userId populated (if numeric id found)
 *     req.userId  -> numeric id (if present) OR undefined
 *   This gives controllers a simple contract: use req.userId to get the numeric id.
 */
const authenticate = (allowedRoles = []) => {
  return async (req, res, next) => {
    //console.log('auth header:', req.headers.authorization ? '[present]' : '[missing]');

    try {
      // read authorization header in a tolerant way
      const authHeader = req.headers?.authorization || '';
      // allow either "Bearer <token>" or just "<token>"
      const parts = authHeader.split(' ').filter(Boolean);
      const token = parts.length === 0 ? undefined : (parts.length === 1 ? parts[0] : parts[1]);

      if (!token) {
        // No token provided; 401 (unauthenticated)
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      // verify token (this throws on invalid/expired token)
      // using synchronous jwt.verify is fine here; wrapping in try/catch below handles errors.
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // keep raw decoded token for debugging/advanced usage
      req.userRaw = decoded;

      // normalize id: extract numeric id from common claim names
      const numericId = extractNumericIdFromToken(decoded);

      // copy decoded into req.user but ensure id and userId properties reflect numeric id if found
      // this keeps the original decoded object available via req.userRaw while giving controllers a normalized object
      req.user = { ...decoded };

      if (numericId !== undefined) {
        // set both for compatibility with different code expectations
        req.userId = numericId;
        req.user.id = numericId;
        req.user.userId = numericId;
      } else {
        // if no numeric id found, still set req.userId (explicitly undefined)
        req.userId = undefined;
        // do not coerce non-numeric ids (string UUIDs) — controllers who support UUIDs can read req.userRaw
      }

      // optional helper method for convenience (non-enumerable-ish style not required)
      req.user.getId = () => req.userId;

      // Role-based access control: if allowedRoles provided, check decoded.role
      if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        const role = decoded?.role;
        if (!role || !allowedRoles.includes(role)) {
          // 403 Forbidden — authenticated but not authorized for this route
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
      }

      // All good — proceed to next middleware/controller
      next();
    } catch (err) {
      // token verify failed or other error
      // log minimal info — don't print tokens or sensitive payloads
      console.error('Auth middleware error:', err.message || err);
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
  };
};

// convenience exports — keep names you already use in routes
module.exports = {
  authUser: authenticate(['user']),
  authAdmin: authenticate(['super']),
  authenticate
};
