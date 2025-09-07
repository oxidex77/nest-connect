const express = require('express');
const auth = require('../middleware/auth');
const Requirement = require('../models/Requirement');
const mongoose = require('mongoose');

const router = express.Router();

// --- GET All Requirements for the Authenticated Broker ---
router.get('/my', auth, async (req, res, next) => {
  try {
    const requirements = await Requirement.find({ tenantId: req.user.tenantId })
      .sort({ urgency: 1, createdAt: -1 }); // Sort by urgency, then newest
    res.json(requirements);
  } catch (error) {
    next(error);
  }
});

// --- ADD a New Requirement ---
router.post('/', auth, async (req, res, next) => {
  try {
    const requirementData = { ...req.body, tenantId: req.user.tenantId };
    const requirement = new Requirement(requirementData);
    await requirement.save();
    res.status(201).json(requirement);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: "Validation Error", details: error.errors });
    }
    next(error);
  }
});

// --- UPDATE an Existing Requirement ---
router.patch('/:requirementId', auth, async (req, res, next) => {
  try {
    const { requirementId } = req.params;
    const requirement = await Requirement.findOne({
      _id: requirementId,
      tenantId: req.user.tenantId
    });
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found.' });
    }
    Object.assign(requirement, req.body);
    await requirement.save();
    res.json(requirement);
  } catch (error) {
    next(error);
  }
});

// --- DELETE a Requirement ---
router.delete('/:requirementId', auth, async (req, res, next) => {
  try {
    const { requirementId } = req.params;
    const result = await Requirement.findOneAndDelete({
      _id: requirementId,
      tenantId: req.user.tenantId
    });
    if (!result) {
      return res.status(404).json({ message: 'Requirement not found.' });
    }
    res.status(200).json({ message: 'Requirement deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;