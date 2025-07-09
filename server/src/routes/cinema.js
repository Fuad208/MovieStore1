// server/src/routes/cinema.js
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Cinema = require('../models/cinema');
const userModeling = require('../utils/userModeling');
const logger = require('../utils/logger');

const router = new express.Router();

// Rate limiting
const createCinemaLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many cinema creation attempts, please try again later.' }
});

const uploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many upload attempts, please try again later.' }
});

// Validation middleware
const validateCinemaCreate = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cinema name must be between 2 and 100 characters'),
  body('ticketPrice')
    .isFloat({ min: 0.01, max: 1000 })
    .withMessage('Ticket price must be between 0.01 and 1000'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('seats')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Seats must be between 1 and 1000'),
  body('seatsAvailable')
    .isInt({ min: 0 })
    .withMessage('Available seats must be non-negative')
    .custom((value, { req }) => {
      if (value > req.body.seats) {
        throw new Error('Available seats cannot exceed total seats');
      }
      return true;
    })
];

const validateCinemaUpdate = [
  param('id').isMongoId().withMessage('Invalid cinema ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cinema name must be between 2 and 100 characters'),
  body('ticketPrice')
    .optional()
    .isFloat({ min: 0.01, max: 1000 })
    .withMessage('Ticket price must be between 0.01 and 1000'),
  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('seats')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Seats must be between 1 and 1000'),
  body('seatsAvailable')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available seats must be non-negative')
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isIn(['name', 'city', 'ticketPrice', 'createdAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Create a cinema
router.post('/cinemas', 
  createCinemaLimit,
  auth.enhance, 
  validateCinemaCreate,
  handleValidationErrors,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const cinema = new Cinema(req.body);
      await cinema.save({ session });
      
      await session.commitTransaction();
      logger.info(`Cinema created: ${cinema._id} by user: ${req.user._id}`);
      
      res.status(201).json({
        success: true,
        data: cinema,
        message: 'Cinema created successfully'
      });
    } catch (error) {
      await session.abortTransaction();
      logger.error(`Cinema creation failed: ${error.message}`, { 
        userId: req.user._id, 
        body: req.body 
      });
      
      if (error.code === 11000) {
        return res.status(409).json({ 
          error: 'Cinema with this name already exists in this city' 
        });
      }
      
      res.status(400).json({ error: error.message });
    } finally {
      session.endSession();
    }
  }
);

// Upload cinema image
router.post('/cinemas/photo/:id', 
  uploadLimit,
  param('id').isMongoId().withMessage('Invalid cinema ID'),
  handleValidationErrors,
  upload('cinemas').single('file'), 
  async (req, res, next) => {
    const url = `${req.protocol}://${req.get('host')}`;
    const { file } = req;
    const cinemaId = req.params.id;

    try {
      if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
        });
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          error: 'File size too large. Maximum size is 5MB.'
        });
      }

      const cinema = await Cinema.findById(cinemaId);
      if (!cinema) {
        return res.status(404).json({ error: 'Cinema not found' });
      }

      const oldImage = cinema.image;
      cinema.image = `${url}/${file.path}`;
      await cinema.save();

      logger.info(`Cinema image updated: ${cinema._id}`);

      res.json({
        success: true,
        data: { cinema, file },
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      logger.error(`Cinema image upload failed: ${error.message}`, { 
        cinemaId, 
        file: file?.filename 
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get all cinemas with pagination and filtering
router.get('/cinemas', 
  validatePagination,
  handleValidationErrors,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter = {};
      if (req.query.city) {
        filter.city = new RegExp(req.query.city, 'i');
      }
      if (req.query.minPrice) {
        filter.ticketPrice = { $gte: parseFloat(req.query.minPrice) };
      }
      if (req.query.maxPrice) {
        filter.ticketPrice = { ...filter.ticketPrice, $lte: parseFloat(req.query.maxPrice) };
      }

      const [cinemas, total] = await Promise.all([
        Cinema.find(filter)
          .sort({ [sortBy]: sortOrder })
          .skip(skip)
          .limit(limit)
          .lean(),
        Cinema.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: cinemas,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      });
    } catch (error) {
      logger.error(`Get cinemas failed: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get cinema by ID
router.get('/cinemas/:id', 
  param('id').isMongoId().withMessage('Invalid cinema ID'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const cinema = await Cinema.findById(req.params.id).lean();
      if (!cinema) {
        return res.status(404).json({ error: 'Cinema not found' });
      }
      
      res.json({
        success: true,
        data: cinema
      });
    } catch (error) {
      logger.error(`Get cinema failed: ${error.message}`, { cinemaId: req.params.id });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Update cinema
router.patch('/cinemas/:id', 
  auth.enhance, 
  validateCinemaUpdate,
  handleValidationErrors,
  async (req, res) => {
    const allowedUpdates = ['name', 'ticketPrice', 'city', 'seats', 'seatsAvailable'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ 
        error: 'Invalid updates!',
        allowedFields: allowedUpdates 
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cinema = await Cinema.findById(req.params.id).session(session);
      if (!cinema) {
        await session.abortTransaction();
        return res.status(404).json({ error: 'Cinema not found' });
      }

      updates.forEach(update => (cinema[update] = req.body[update]));
      await cinema.save({ session });

      await session.commitTransaction();
      logger.info(`Cinema updated: ${cinema._id} by user: ${req.user._id}`);

      res.json({
        success: true,
        data: cinema,
        message: 'Cinema updated successfully'
      });
    } catch (error) {
      await session.abortTransaction();
      logger.error(`Cinema update failed: ${error.message}`, { 
        cinemaId: req.params.id, 
        userId: req.user._id 
      });
      
      if (error.code === 11000) {
        return res.status(409).json({ 
          error: 'Cinema with this name already exists in this city' 
        });
      }
      
      res.status(400).json({ error: error.message });
    } finally {
      session.endSession();
    }
  }
);

// Delete cinema
router.delete('/cinemas/:id', 
  auth.enhance,
  param('id').isMongoId().withMessage('Invalid cinema ID'),
  handleValidationErrors,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cinema = await Cinema.findByIdAndDelete(req.params.id).session(session);
      if (!cinema) {
        await session.abortTransaction();
        return res.status(404).json({ error: 'Cinema not found' });
      }

      // Here you might want to check if there are any active reservations
      // and handle them appropriately

      await session.commitTransaction();
      logger.info(`Cinema deleted: ${req.params.id} by user: ${req.user._id}`);

      res.json({
        success: true,
        data: cinema,
        message: 'Cinema deleted successfully'
      });
    } catch (error) {
      await session.abortTransaction();
      logger.error(`Cinema deletion failed: ${error.message}`, { 
        cinemaId: req.params.id, 
        userId: req.user._id 
      });
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      session.endSession();
    }
  }
);

// Get cinemas modeled for user
router.get('/cinemas/usermodeling/:username', 
  param('username').isAlphanumeric().withMessage('Invalid username'),
  handleValidationErrors,
  async (req, res) => {
    const { username } = req.params;

    try {
      const cinemas = await Cinema.find({}).lean();
      const cinemasUserModeled = await userModeling.cinemaUserModeling(cinemas, username);
      
      res.json({
        success: true,
        data: cinemasUserModeled,
        message: 'User-modeled cinemas retrieved successfully'
      });
    } catch (error) {
      logger.error(`User modeling failed: ${error.message}`, { username });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;