const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Middleware to verify the token and check the user's role.
 * @param {Array} allowedRoles - List of roles that are allowed to access the route.
 */
const authToken = (allowedRoles = []) => {
  return (req, res, next) => {
    // Extract token from 'Authorization' header
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    // Check if the token format is correct (Bearer <token>)
    if (!token.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Token must be prefixed with "Bearer "' });
    }

    try {
      // Extract the actual token value
      const actualToken = token.split(' ')[1]; // Remove "Bearer" prefix

      // Verify and decode the token
      const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

      // Attach user data to the request object
      req.user = decoded;
      console.log(decoded);  // Debug: Output decoded token to see its structure

      // Check if the user's role is allowed to access the route
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access Denied. You do not have the required role.' });
      }

      next(); // Continue to the next middleware or route handler
    } catch (err) {
      console.error('Token verification failed:', err.message);
      res.status(400).json({ message: 'Invalid or expired token.' });
    }
  };
};

module.exports = authToken;
