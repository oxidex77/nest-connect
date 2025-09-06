const express = require('express');
const slugify = require('slugify');
const auth = require('../middleware/auth');
const Property = require('../models/Property');
const mongoose = require('mongoose');

const router = express.Router();

// --- GET All Properties for the Authenticated Broker ---
router.get('/my', auth, async (req, res, next) => {
  try {
    const properties = await Property.find({ tenantId: req.user.tenantId })
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    next(error);
  }
});

// --- ADD a New Property ---
router.post('/', auth, async (req, res, next) => {
  try {
    const propertyData = { ...req.body, tenantId: req.user.tenantId };

    // --- Generate a unique URL slug from the title ---
    if (propertyData.title) {
      const baseSlug = slugify(propertyData.title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      // Ensure the slug is unique within the scope of this tenant
      while (await Property.findOne({ slug, tenantId: req.user.tenantId })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      propertyData.slug = slug;
    }

    const property = new Property(propertyData);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    // Handle validation errors gracefully
    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: "Validation Error", details: error.errors });
    }
    next(error);
  }
});

// --- UPDATE an Existing Property ---
router.patch('/:propertyId', auth, async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    
    const property = await Property.findOne({
      _id: propertyId,
      tenantId: req.user.tenantId // Ensures user can only edit their own property
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Update fields from request body
    Object.assign(property, req.body);
    await property.save();
    
    res.json(property);
  } catch (error) {
    next(error);
  }
});

// --- DELETE a Property ---
router.delete('/:propertyId', auth, async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const result = await Property.findOneAndDelete({
      _id: propertyId,
      tenantId: req.user.tenantId // Ensures user can only delete their own property
    });

    if (!result) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    res.status(200).json({ message: 'Property deleted successfully.' });
  } catch (error) {
    next(error);
  }
});


module.exports = router;