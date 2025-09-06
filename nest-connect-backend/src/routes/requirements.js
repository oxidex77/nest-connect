const express = require('express');
const auth = require('../middleware/auth');
const Requirement = require('../models/Requirement');

const router = express.Router();

// Get my requirements
router.get('/my', auth, async (req, res) => {
  try {
    const requirements = await Requirement.find({ tenantId: req.user.tenantId })
      .sort({ createdAt: -1 });
    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add requirement
router.post('/', auth, async (req, res) => {
  try {
    const requirementData = {
      ...req.body,
      tenantId: req.user.tenantId
    };
    
    const requirement = new Requirement(requirementData);
    await requirement.save();
    
    res.status(201).json(requirement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update requirement
router.patch('/:requirementId', auth, async (req, res) => {
  try {
    const { requirementId } = req.params;
    
    const requirement = await Requirement.findOne({
      _id: requirementId,
      tenantId: req.user.tenantId
    });
    
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    
    Object.assign(requirement, req.body);
    await requirement.save();
    
    res.json(requirement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete requirement
router.delete('/:requirementId', auth, async (req, res) => {
  try {
    const { requirementId } = req.params;
    
    const requirement = await Requirement.findOneAndDelete({
      _id: requirementId,
      tenantId: req.user.tenantId
    });
    
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    
    res.json({ message: 'Requirement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;