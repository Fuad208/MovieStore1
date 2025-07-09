// server/src/routes/users.js
const express = require('express');
const upload = require('../utils/multer');
const User = require('../models/user');
const auth = require('../middlewares/auth');

const router = new express.Router();

// Create a user
router.post('/users', async (req, res) => {
  try {
    const { role } = req.body;
    if (role) {
      return res.status(400).send({ error: 'You cannot set role property.' });
    }
    
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Upload user photo
router.post('/users/photo/:id', upload('users').single('file'), async (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const { file } = req;
  const userId = req.params.id;

  try {
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    user.imageurl = `${url}/${file.path}`;
    await user.save();
    res.send({ user, file });
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: e.message });
  }
});

// Login User
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.username, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({
      error: { message: 'You have entered an invalid username or password' },
    });
  }
});

// Google Login
router.post('/users/login/google', async (req, res) => {
  try {
    const { email, googleId, name } = req.body;
    const nameArray = name.split(' ');

    let user = await User.findOne({ google: googleId });
    
    if (!user) {
      user = new User({
        name,
        username: nameArray.join('') + googleId,
        email,
        google: googleId,
      });
      await user.save();
    }

    const token = await user.generateAuthToken();
    res.status(user.isNew ? 201 : 200).send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Logout user
router.post('/users/logout', auth.simple, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: 'Logout successful' });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Logout all devices
router.post('/users/logoutAll', auth.enhance, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: 'Logout from all devices successful' });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Get all users (superadmin only)
router.get('/users', auth.enhance, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).send({
        error: 'Only superadmin can view all users!',
      });
    }
    
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Get current user info
router.get('/users/me', auth.simple, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Get user by id (superadmin only)
router.get('/users/:id', auth.enhance, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).send({
        error: 'Only superadmin can view specific users!',
      });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Update current user
router.patch('/users/me', auth.simple, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'phone', 'username', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    const { user } = req;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Admin update user by id
router.patch('/users/:id', auth.enhance, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).send({
        error: 'Only superadmin can update users!',
      });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'phone', 'username', 'email', 'password', 'role'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Delete user by id (superadmin only)
router.delete('/users/:id', auth.enhance, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).send({
        error: 'Only superadmin can delete users!',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send({ message: 'User deleted successfully' });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Delete current user (superadmin only)
router.delete('/users/me', auth.simple, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).send({
        error: 'You cannot delete yourself unless you are superadmin!',
      });
    }

    await req.user.remove();
    res.send({ message: 'Account deleted successfully' });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;