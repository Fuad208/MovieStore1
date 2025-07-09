// server/src/routes/movies.js
const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Movie = require('../models/movie');
const Cinema = require('../models/cinema');
const userModeling = require('../utils/userModeling');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

const router = new express.Router();

// Validation middleware
const validateMovie = [
  body('title').isLength({ min: 1, max: 200 }).trim().escape(),
  body('language').isLength({ min: 1, max: 50 }).trim().escape(),
  body('genre').isArray().withMessage('Genre must be an array'),
  body('genre.*').isLength({ min: 1, max: 50 }).trim().escape(),
  body('director').isLength({ min: 1, max: 100 }).trim().escape(),
  body('cast').isArray().withMessage('Cast must be an array'),
  body('cast.*').isLength({ min: 1, max: 100 }).trim().escape(),
  body('description').isLength({ min: 10, max: 1000 }).trim().escape(),
  body('duration').isInt({ min: 1, max: 600 }).withMessage('Duration must be between 1-600 minutes'),
  body('releaseDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
];

const validateMovieUpdate = [
  body('title').optional().isLength({ min: 1, max: 200 }).trim().escape(),
  body('language').optional().isLength({ min: 1, max: 50 }).trim().escape(),
  body('genre').optional().isArray(),
  body('genre.*').optional().isLength({ min: 1, max: 50 }).trim().escape(),
  body('director').optional().isLength({ min: 1, max: 100 }).trim().escape(),
  body('cast').optional().isArray(),
  body('cast.*').optional().isLength({ min: 1, max: 100 }).trim().escape(),
  body('description').optional().isLength({ min: 10, max: 1000 }).trim().escape(),
  body('duration').optional().isInt({ min: 1, max: 600 }),
  body('releaseDate').optional().isISO8601().toDate(),
  body('endDate').optional().isISO8601().toDate(),
];

// Create a movie
router.post('/movies', 
  auth.enhance, 
  validateMovie,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      // Validate date logic
      if (new Date(req.body.releaseDate) >= new Date(req.body.endDate)) {
        return res.status(400).json({
          error: 'Release date must be before end date'
        });
      }

      // Get all cinemas with better error handling
      const allCinemas = await Cinema.find({}, '_id').lean();
      if (!allCinemas || allCinemas.length === 0) {
        return res.status(400).json({
          error: 'No cinemas available. Please add cinemas first.'
        });
      }

      const cinemaIds = allCinemas.map(c => c._id);
      const movieData = { ...req.body, cinemaIds };
      
      const movie = new Movie(movieData);
      await movie.save();

      // Clear movies cache
      await cache.del('movies:all');
      
      logger.info('Movie created successfully', {
        movieId: movie._id,
        title: movie.title,
        userId: req.user.id
      });

      res.status(201).json({
        success: true,
        movie
      });
    } catch (error) {
      logger.error('Movie creation failed', {
        error: error.message,
        userId: req.user?.id
      });
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Validation error',
          details: Object.values(error.errors).map(e => e.message)
        });
      }
      
      res.status(500).json({ 
        error: 'Internal server error while creating movie' 
      });
    }
  }
);

// Upload movie photo with better validation
router.post('/movies/photo/:id', 
  auth.enhance, 
  param('id').isMongoId().withMessage('Invalid movie ID'),
  upload('movies').single('file'), 
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { file } = req;
      const movieId = req.params.id;

      if (!file) {
        return res.status(400).json({
          error: 'Please upload a valid image file'
        });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
        });
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          error: 'File too large. Maximum size is 5MB.'
        });
      }

      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ 
          error: 'Movie not found' 
        });
      }

      const url = `${req.protocol}://${req.get('host')}`;
      movie.image = `${url}/${file.path}`;
      await movie.save();

      // Clear related caches
      await cache.del(`movie:${movieId}`);
      await cache.del('movies:all');
      
      logger.info('Movie photo uploaded successfully', {
        movieId,
        fileName: file.filename,
        userId: req.user.id
      });
      
      res.json({
        success: true,
        message: 'Photo uploaded successfully',
        movie,
        file: {
          filename: file.filename,
          path: file.path,
          size: file.size
        }
      });
    } catch (error) {
      logger.error('Movie photo upload failed', {
        error: error.message,
        movieId: req.params.id,
        userId: req.user?.id
      });
      
      res.status(500).json({ 
        error: 'Internal server error while uploading photo' 
      });
    }
  }
);

// Get all movies with pagination and caching
router.get('/movies', 
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('genre').optional().isString().trim(),
  query('search').optional().isString().trim(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const skip = (page - 1) * limit;
      const genre = req.query.genre;
      const search = req.query.search;

      // Build cache key
      const cacheKey = `movies:${page}:${limit}:${genre || 'all'}:${search || 'none'}`;
      
      // Try to get from cache first
      const cachedMovies = await cache.get(cacheKey);
      if (cachedMovies) {
        return res.json(cachedMovies);
      }

      // Build query
      let query = {};
      if (genre) {
        query.genre = { $in: [genre] };
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { director: { $regex: search, $options: 'i' } },
          { cast: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      // Execute query with pagination
      const [movies, total] = await Promise.all([
        Movie.find(query)
          .select('-__v')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Movie.countDocuments(query)
      ]);

      const result = {
        movies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };

      // Cache the result for 5 minutes
      await cache.set(cacheKey, result, 300);

      res.json(result);
    } catch (error) {
      logger.error('Get movies failed', {
        error: error.message,
        query: req.query
      });
      
      res.status(500).json({ 
        error: 'Internal server error while fetching movies' 
      });
    }
  }
);

// Get movie by id with caching
router.get('/movies/:id', 
  param('id').isMongoId().withMessage('Invalid movie ID'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const movieId = req.params.id;
      const cacheKey = `movie:${movieId}`;

      // Try cache first
      const cachedMovie = await cache.get(cacheKey);
      if (cachedMovie) {
        return res.json(cachedMovie);
      }

      const movie = await Movie.findById(movieId).select('-__v').lean();
      if (!movie) {
        return res.status(404).json({ 
          error: 'Movie not found' 
        });
      }

      // Cache for 10 minutes
      await cache.set(cacheKey, movie, 600);

      res.json(movie);
    } catch (error) {
      logger.error('Get movie by ID failed', {
        error: error.message,
        movieId: req.params.id
      });
      
      res.status(500).json({ 
        error: 'Internal server error while fetching movie' 
      });
    }
  }
);

// Update movie by id
router.patch('/movies/:id', 
  auth.enhance, 
  param('id').isMongoId().withMessage('Invalid movie ID'),
  validateMovieUpdate,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const movieId = req.params.id;
      const updates = Object.keys(req.body);
      const allowedUpdates = [
        'title', 'image', 'language', 'genre', 'director', 
        'cast', 'description', 'duration', 'releaseDate', 'endDate', 'cinemaIds'
      ];
      
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));
      if (!isValidOperation) {
        return res.status(400).json({ 
          error: 'Invalid updates detected',
          allowedFields: allowedUpdates
        });
      }

      // Validate date logic if dates are being updated
      if (req.body.releaseDate && req.body.endDate) {
        if (new Date(req.body.releaseDate) >= new Date(req.body.endDate)) {
          return res.status(400).json({
            error: 'Release date must be before end date'
          });
        }
      }

      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ 
          error: 'Movie not found' 
        });
      }

      // Apply updates
      updates.forEach(update => {
        movie[update] = req.body[update];
      });

      await movie.save();

      // Clear related caches
      await Promise.all([
        cache.del(`movie:${movieId}`),
        cache.del('movies:all'),
        cache.delPattern('movies:*') // Clear all movie list caches
      ]);

      logger.info('Movie updated successfully', {
        movieId,
        updates,
        userId: req.user.id
      });

      res.json({
        success: true,
        movie
      });
    } catch (error) {
      logger.error('Movie update failed', {
        error: error.message,
        movieId: req.params.id,
        userId: req.user?.id
      });
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Validation error',
          details: Object.values(error.errors).map(e => e.message)
        });
      }
      
      res.status(500).json({ 
        error: 'Internal server error while updating movie' 
      });
    }
  }
);

// Delete movie by id
router.delete('/movies/:id', 
  auth.enhance, 
  param('id').isMongoId().withMessage('Invalid movie ID'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const movieId = req.params.id;
      const movie = await Movie.findByIdAndDelete(movieId);
      
      if (!movie) {
        return res.status(404).json({ 
          error: 'Movie not found' 
        });
      }

      // Clear related caches
      await Promise.all([
        cache.del(`movie:${movieId}`),
        cache.delPattern('movies:*')
      ]);

      logger.info('Movie deleted successfully', {
        movieId,
        title: movie.title,
        userId: req.user.id
      });

      res.json({
        success: true,
        message: 'Movie deleted successfully',
        movie
      });
    } catch (error) {
      logger.error('Movie deletion failed', {
        error: error.message,
        movieId: req.params.id,
        userId: req.user?.id
      });
      
      res.status(500).json({ 
        error: 'Internal server error while deleting movie' 
      });
    }
  }
);

// Movies User modeling (Get Movies Suggestions)
router.get('/movies/usermodeling/:username', 
  param('username').isLength({ min: 1, max: 50 }).trim().escape(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { username } = req.params;
      const cacheKey = `usermodeling:movies:${username}`;

      // Try cache first
      const cachedSuggestions = await cache.get(cacheKey);
      if (cachedSuggestions) {
        return res.json(cachedSuggestions);
      }

      const moviesUserModeled = await userModeling.moviesUserModeling(username);
      
      // Cache for 30 minutes
      await cache.set(cacheKey, moviesUserModeled, 1800);

      res.json(moviesUserModeled);
    } catch (error) {
      logger.error('User modeling failed', {
        error: error.message,
        username: req.params.username
      });
      
      res.status(500).json({ 
        error: 'Internal server error while getting movie suggestions' 
      });
    }
  }
);

module.exports = router;