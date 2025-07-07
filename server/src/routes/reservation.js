// server/src/routes/reservation.js
const express = require('express');
const auth = require('../middlewares/auth');
const Reservation = require('../models/reservation');
const userModeling = require('../utils/userModeling');
const generateQR = require('../utils/generateQRCode');

const router = new express.Router();

// Create a reservation
router.post('/reservations', auth.simple, async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    const QRCode = await generateQR(`https://razorpay.com`);

    await reservation.save();
    res.status(201).send({ reservation, QRCode });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Get all reservations
router.get('/reservations', auth.simple, async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.send(reservations);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Get reservation by id
router.get('/reservations/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id);
    if (!reservation) {
      return res.status(404).send({ error: 'Reservation not found' });
    }
    res.send(reservation);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Check-in reservation by id
router.patch('/reservations/checkin/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id);
    if (!reservation) {
      return res.status(404).send({ error: 'Reservation not found' });
    }
    
    reservation.checkin = true;
    await reservation.save();
    res.send(reservation);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Update reservation by id
router.patch('/reservations/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'date',
    'startAt',
    'seats',
    'ticketPrice',
    'total',
    'username',
    'phone',
    'checkin',
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const reservation = await Reservation.findById(_id);
    if (!reservation) {
      return res.status(404).send({ error: 'Reservation not found' });
    }

    updates.forEach((update) => (reservation[update] = req.body[update]));
    await reservation.save();
    res.send(reservation);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Delete reservation by id
router.delete('/reservations/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findByIdAndDelete(_id);
    if (!reservation) {
      return res.status(404).send({ error: 'Reservation not found' });
    }
    res.send(reservation);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// User modeling get suggested seats
router.get('/reservations/usermodeling/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const suggestedSeats = await userModeling.reservationSeatsUserModeling(username);
    res.send(suggestedSeats);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
