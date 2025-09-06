const express = require('express');
const slugify = require('slugify');
const Tenant = require('../models/Tenant');
const Property = require('../models/Property'); // <-- Import Property model
const Requirement = require('../models/Requirement'); // <-- Import Requirement model

const router = express.Router();

// --- Check if a subdomain is available ---
router.get('/check-subdomain/:subdomain', async (req, res, next) => {
  try {
    const { subdomain } = req.params;
    const cleanSubdomain = slugify(subdomain, { lower: true, strict: true });

    if (subdomain !== cleanSubdomain) {
      return res.status(400).json({ available: false, message: 'Invalid characters in subdomain.' });
    }

    const tenant = await Tenant.findOne({ subdomain: cleanSubdomain });
    res.json({ available: !tenant });
  } catch (error) {
    next(error);
  }
});

// --- Get ALL Public Data for a Tenant Website ---
// This single endpoint powers an entire broker website.
router.get('/tenant/:subdomain', async (req, res, next) => {
    try {
        const { subdomain } = req.params;
        const tenant = await Tenant.findOne({ subdomain });

        if (!tenant || tenant.status !== 'active') {
            return res.status(404).json({ message: 'Broker website not found or is inactive.' });
        }

        // Fetch all published properties for this tenant
        const properties = await Property.find({
            tenantId: tenant._id,
            isPublished: true
        }).sort({ isFeatured: -1, createdAt: -1 }); // Show featured first

        // Fetch all active requirements for this tenant
        const requirements = await Requirement.find({
            tenantId: tenant._id,
            status: 'active'
        }).sort({ urgency: 1, createdAt: -1 }); // Show high urgency first

        // Combine all data into a single payload for the website
        res.json({
            tenant,
            properties,
            requirements
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;