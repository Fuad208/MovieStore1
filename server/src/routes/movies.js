// server/src/routes/movies.js
const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Movie = require('../models/movie');
const Cinema = require('../models/cinema');
const userModeling = require('../utils/userModeling');

const router = new express.Router();

// Create a movie
router.post('/movies', auth.enhance, async (req, res) => {
  try {
    // Get all cinemas from database
    const allCinemas = await Cinema.find({}, '_id');
    const cinemaIds = allCinemas.map(c => c._id);

    // Merge movie data with all cinemaIds
    const movieData = { ...req.body, cinemaIds };
    const movie = new Movie(movieData);

    await movie.save();
    res.status(201).send(movie);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Upload movie photo
router.post('/movies/photo/:id', auth.enhance, upload('movies').single('file'), async (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const { file } = req;
  const movieId = req.params.id;

  try {
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    movie.image = `${url}/${file.path}`;
    await movie.save();
    
    res.send({ movie, file });
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: e.message });
  }
});

// Get all movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Get movie by id
router.get('/movies/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const movie = await Movie.findById(_id);
    if (!movie) {
      return res.status(404).send({ error: 'Movie not found' });
    }
    res.send(movie);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Update movie by id
router.patch('/movies/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'title',
    'image',
    'language',
    'genre',
    'director',
    'cast',
    'description',
    'duration',
    'releaseDate',
    'endDate',
    'cinemaIds'
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const movie = await Movie.findById(_id);
    if (!movie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    updates.forEach((update) => (movie[update] = req.body[update]));
    await movie.save();
    res.send(movie);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Delete movie by id
router.delete('/movies/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const movie = await Movie.findByIdAndDelete(_id);
    if (!movie) {
      return res.status(404).send({ error: 'Movie not found' });
    }
    res.send(movie);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Movies User modeling (Get Movies Suggestions)
router.get('/movies/usermodeling/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const moviesUserModeled = await userModeling.moviesUserModeling(username);
    res.send(moviesUserModeled);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
