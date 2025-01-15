const adminMiddleware = (req, res, next) => {
  console.log('Admin Middleware - User object:', req.user);
  if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();

  };
  
  module.exports = adminMiddleware;