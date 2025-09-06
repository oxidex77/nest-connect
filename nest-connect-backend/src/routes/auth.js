const express = require('express');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// --- User Registration ---
// Creates a User and a corresponding Tenant in a single transaction
router.post('/register', async (req, res, next) => {
  const { name, email, password, phone, preferredSubdomain } = req.body;

  // Basic validation
  if (!name || !email || !password || !preferredSubdomain) {
    return res.status(400).json({ message: 'Please provide name, email, password, and a preferred website name.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    // 2. Generate a unique, URL-safe subdomain
    const baseSubdomain = slugify(preferredSubdomain || name, { lower: true, strict: true });
    let subdomain = baseSubdomain;
    let counter = 1;
    while (await Tenant.findOne({ subdomain }).session(session)) {
      subdomain = `${baseSubdomain}-${counter}`;
      counter++;
    }

    // 3. Create the Tenant
    const tenant = new Tenant({
      subdomain,
      displayName: name,
      contact: { email, phone }
    });
    await tenant.save({ session });

    // 4. Create the User, linking to the new Tenant
    const user = new User({
      name,
      email,
      password,
      phone,
      tenantId: tenant._id
    });
    await user.save({ session });
    
    // 5. Commit the transaction
    await session.commitTransaction();

    // 6. Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, tenantId: tenant._id },
      process.env.JWT_SECRET,
      { expiresIn: '14d' } // Token valid for 14 days
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      tenant: { id: tenant._id, subdomain: tenant.subdomain, displayName: tenant.displayName }
    });

  } catch (error) {
    await session.abortTransaction();
    next(error); // Pass error to global handler
  } finally {
    session.endSession();
  }
});

// --- User Login ---
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email }).populate('tenantId', 'subdomain displayName');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId._id },
      process.env.JWT_SECRET,
      { expiresIn: '14d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      tenant: { id: user.tenantId._id, subdomain: user.tenantId.subdomain, displayName: user.tenantId.displayName }
    });

  } catch (error) {
    next(error);
  }
});

// --- Get Current Authenticated User ---
router.get('/me', auth, async (req, res) => {
  // The 'auth' middleware already attaches the user to the request object.
  res.json({
    user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    },
    tenant: req.user.tenantId
  });
});

module.exports = router;