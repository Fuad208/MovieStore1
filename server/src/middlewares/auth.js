// server/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Simple authentication - for regular users
const simple = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    // Extract token from Bearer format
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'Access denied. Invalid token format.' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mySecret');
    
    // Find user with valid token
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      return res.status(401).send({ error: 'Invalid token. User not found.' });
    }

    // Check if user account is active (if you have this field)
    if (user.isActive === false) {
      return res.status(401).send({ error: 'Account is deactivated.' });
    }

    // Attach user and token to request object
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Invalid token.' });
    } else if (e.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired.' });
    } else {
      console.error('Authentication error:', e);
      return res.status(401).send({ error: 'Please authenticate.' });
    }
  }
};

// Enhanced authentication - for admin users only
const enhance = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    // Extract token from Bearer format
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'Access denied. Invalid token format.' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mySecret');
    
    // Find user with valid token
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      return res.status(401).send({ error: 'Invalid token. User not found.' });
    }

    // Check if user account is active (if you have this field)
    if (user.isActive === false) {
      return res.status(401).send({ error: 'Account is deactivated.' });
    }

    // Check if user has admin privileges
    if (user.role !== 'superadmin' && user.role !== 'admin') {
      return res.status(403).send({ error: 'Access denied. Admin privileges required.' });
    }

    // Attach user and token to request object
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Invalid token.' });
    } else if (e.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired.' });
    } else {
      console.error('Authentication error:', e);
      return res.status(401).send({ error: 'Please authenticate.' });
    }
  }
};

// Super admin authentication - for super admin only
const superAdmin = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    // Extract token from Bearer format
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'Access denied. Invalid token format.' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mySecret');
    
    // Find user with valid token
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      return res.status(401).send({ error: 'Invalid token. User not found.' });
    }

    // Check if user account is active (if you have this field)
    if (user.isActive === false) {
      return res.status(401).send({ error: 'Account is deactivated.' });
    }

    // Check if user has super admin privileges
    if (user.role !== 'superadmin') {
      return res.status(403).send({ error: 'Access denied. Super admin privileges required.' });
    }

    // Attach user and token to request object
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Invalid token.' });
    } else if (e.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired.' });
    } else {
      console.error('Authentication error:', e);
      return res.status(401).send({ error: 'Please authenticate.' });
    }
  }
};

// Optional authentication - for routes that work with or without auth
const optional = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    // If no auth header, continue without user
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      req.user = null;
      return next();
    }

    // Try to verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mySecret');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    req.token = token;
    req.user = user || null;
    next();
  } catch (e) {
    // If token is invalid, continue without user
    req.user = null;
    next();
  }
};

// Rate limiting middleware (optional)
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const clientId = req.ip + (req.user ? req.user._id : '');
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    const userRequests = requests.get(clientId) || [];
    const validRequests = userRequests.filter(time => time > windowStart);

    if (validRequests.length >= maxRequests) {
      return res.status(429).send({ 
        error: 'Too many requests. Please try again later.' 
      });
    }

    // Add current request
    validRequests.push(now);
    requests.set(clientId, validRequests);

    next();
  };
};

module.exports = { 
  simple, 
  enhance, 
  superAdmin, 
  optional,
  rateLimit 
};