const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const authMiddleware = async (req, res, next) => {
  try {
    req.isAuthenticated = false;
    // 1. Check for session-based authentication first
    if (req.session && req.session.userId) {
      const sessionUser = await User.findById(req.session.userId)
        .select('+cart')
        .lean();
      
      if (sessionUser) {
        req.user = sessionUser;
        req.authMethod = 'session';
        handleAuthenticatedRequest(req);
        req.isAuthenticated = true;
        return next();
      }
    }

    // 2. Extract and validate Authorization header for JWT authentication
    const authHeader = req.header('Authorization');
    
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Request headers:', {
        auth: authHeader,
        origin: req.headers.origin,
        path: req.path,
        sessionId: req.session?.id
      });
    }

    // Allow requests without Authorization header to proceed as unauthenticated
    if (!authHeader) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // 3. Extract and validate token format
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Token decoded successfully:', {
        userId: decoded.userId,
        iat: new Date(decoded.iat * 1000).toISOString(),
        exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'no expiration'
      });
    }

    // Special handling for admin role
    if (decoded.role === 'admin') {
      req.user = {
        _id: decoded.userId,
        role: 'admin'
      };
      req.token = token;
      req.authMethod = 'jwt';
      handleAuthenticatedRequest(req);
      return next();
    }


    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // 5. Fetch and validate user from database
    const user = await User.findById(decoded.userId)
      .select('+cart')
      .lean();
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 6. Setup authenticated request
    req.user = user;
    req.token = token;
    req.authMethod = 'jwt';
    handleAuthenticatedRequest(req);
    
    // 7. Proceed to the next middleware or route handler
    next();

  } catch (error) {
    console.error('[Auth] Error:', {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    // Handle JWT errors silently and proceed as unauthenticated
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
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

// Helper function to setup authenticated request
function handleAuthenticatedRequest(req) {
  req.isAuthenticated = true;
  
  // Initialize cart if accessing cart endpoints
  if (req.path.includes('/api/cart')) {
    if (!req.user.cart) {
      req.user.cart = [];
    }
    console.log('[Auth] Cart access:', {
      userId: req.user._id,
      cartItems: req.user.cart.length,
      endpoint: req.path,
      authMethod: req.authMethod
    });
  }

  // Add response success helper
  req.sendSuccess = (data) => {
    return res.status(200).json({
      status: 'success',
      data,
      code: 'SUCCESS'
    });
  };
}

module.exports = authMiddleware;