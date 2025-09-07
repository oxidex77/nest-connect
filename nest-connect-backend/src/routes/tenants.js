const express = require('express');
const slugify = require('slugify');
const auth = require('../middleware/auth');
const Tenant = require('../models/Tenant');

const router = express.Router();

// --- Get my full tenant details (Authenticated) ---
router.get('/me', auth, async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant profile not found.' });
    }
    res.json(tenant);
  } catch (error) {
    next(error);
  }
});


// --- Update my tenant's subdomain (Authenticated) ---
router.patch('/me/subdomain', auth, async (req, res, next) => {
  try {
    const { newSubdomain } = req.body;
    if (!newSubdomain) {
      return res.status(400).json({ message: 'New subdomain is required.' });
    }

    const cleanSubdomain = slugify(newSubdomain, { lower: true, strict: true });

    if (newSubdomain !== cleanSubdomain) {
        return res.status(400).json({ message: 'Invalid characters. Use only letters, numbers, and hyphens.' });
    }

    // Check if the new subdomain is already taken by someone else
    const existingTenant = await Tenant.findOne({
      subdomain: cleanSubdomain,
      _id: { $ne: req.user.tenantId } // Check all tenants EXCEPT the current one
    });

    if (existingTenant) {
      return res.status(409).json({ message: 'This website name is already taken. Please choose another.' });
    }

    // Update the subdomain
    const updatedTenant = await Tenant.findByIdAndUpdate(
      req.user.tenantId,
      { subdomain: cleanSubdomain },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Website name updated successfully!',
      tenant: updatedTenant
    });

  } catch (error) {
    next(error);
  }
});

router.get('/me/dashboard-stats', auth, async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;

        // Run database queries in parallel for better performance
        const [propertyCount, requirementCount] = await Promise.all([
            Property.countDocuments({ tenantId: tenantId }),
            Requirement.countDocuments({ tenantId: tenantId, status: 'active' })
        ]);

        // In the future, you can add more complex stats like site visits, etc.
        const stats = {
            totalProperties: propertyCount,
            activeRequirements: requirementCount,
            siteVisitsToday: 0, // Placeholder for now
            scheduledVisits: 0, // Placeholder for now
        };

        res.json(stats);
    } catch (error) {
        next(error);
    }
});


module.exports = router;