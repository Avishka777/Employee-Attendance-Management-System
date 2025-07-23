const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized to access this route'));
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, 'User no longer exists'));
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware to check if user is logged in
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Not authorized to access this route'));
    }
    next();
  };
};