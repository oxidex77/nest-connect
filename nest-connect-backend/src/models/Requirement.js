const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  clientName: { type: String, required: true, trim: true },
  clientContact: { type: String, required: true, trim: true },

  purpose: { type: String, enum: ['buy', 'rent'], required: true },
  propertyTypes: [{ type: String, required: true }], // e.g., ['Apartment', 'Villa']

  budget: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },

  preferredLocations: [{
    city: { type: String, required: true },
    areas: [String]
  }],

  preferences: {
    minBedrooms: { type: Number },
    minBathrooms: { type: Number },
    minAreaSqft: { type: Number }
  },

  urgency: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  description: { type: String, trim: true },
  status: { type: String, enum: ['active', 'matched', 'closed'], default: 'active' }

}, { timestamps: true });

module.exports = mongoose.model('Requirement', requirementSchema);