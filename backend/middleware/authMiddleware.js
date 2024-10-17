const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const authMiddleware = async (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1]; // 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await User.findById(decoded.userId); // Ensure your token includes `userId`
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach full user object to the request for use in other routes
    req.user = user;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired, please log in again' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }

    // General error handler
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
