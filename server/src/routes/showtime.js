// server/src/routes/showtime.js
const express = require('express');
const auth = require('../middlewares/auth');
const Showtime = require('../models/showtime');

const router = new express.Router();

// Create a showtime
router.post('/showtimes', auth.enhance, async (req, res) => {
  try {
    const showtime = new Showtime(req.body);
    await showtime.save();
    res.status(201).send(showtime);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Get all showtimes
router.get('/showtimes', async (req, res) => {
  try {
    const showtimes = await Showtime.find({});
    res.send(showtimes);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Get showtime by id
router.get('/showtimes/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const showtime = await Showtime.findById(_id);
    if (!showtime) {
      return res.status(404).send({ error: 'Showtime not found' });
    }
    res.send(showtime);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Update showtime by id
router.patch('/showtimes/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['startAt', 'startDate', 'endDate', 'movieId', 'cinemaIds'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const showtime = await Showtime.findById(_id);
    if (!showtime) {
      return res.status(404).send({ error: 'Showtime not found' });
    }

    updates.forEach((update) => (showtime[update] = req.body[update]));
    await showtime.save();
    res.send(showtime);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Delete showtime by id
router.delete('/showtimes/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const showtime = await Showtime.findByIdAndDelete(_id);
    if (!showtime) {
      return res.status(404).send({ error: 'Showtime not found' });
    }
    res.send(showtime);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;