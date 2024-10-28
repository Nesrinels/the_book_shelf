const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract and validate Authorization header
    const authHeader = req.header('Authorization');
    
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Request headers:', {
        auth: authHeader,
        origin: req.headers.origin,
        path: req.path
      });
    }

    if (!authHeader) {
      console.log('[Auth] Missing Authorization header');
      return res.status(401).json({
        status: 'error',
        message: 'No authorization header found',
        code: 'NO_AUTH_HEADER'
      });
    }

    // 2. Extract and validate token format
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      console.log('[Auth] Invalid token format:', { bearer, hasToken: !!token });
      return res.status(401).json({
        status: 'error',
        message: 'Invalid authorization format',
        code: 'INVALID_AUTH_FORMAT'
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'] // Specify allowed algorithms for verification
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Token decoded successfully:', {
        userId: decoded.userId,
        iat: new Date(decoded.iat * 1000).toISOString(),
        exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'no expiration'
      });
    }

    if (!decoded.userId) {
      console.log('[Auth] Missing userId in token payload');
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token payload',
        code: 'INVALID_TOKEN_PAYLOAD'
      });
    }

    // 4. Fetch and validate user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('[Auth] User not found:', decoded.userId);
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // 5. Check if user account is active
    if (!user.isActive) {
      console.log('[Auth] Inactive user attempted access:', decoded.userId);
      return res.status(403).json({
        status: 'error',
        message: 'Account is inactive',
        code: 'INACTIVE_ACCOUNT'
      });
    }

    // 6. Attach user and token to request object
    req.user = user;
    req.token = token;

    // 7. Proceed to the next middleware or route handler
    next();

  } catch (error) {
    console.error('[Auth] Error:', {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    // Handle any other unexpected authentication errors
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error',
      code: 'AUTH_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = authMiddleware;