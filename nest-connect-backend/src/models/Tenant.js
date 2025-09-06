const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // Simple validation for subdomain format
    match: [/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/, 'Invalid subdomain format']
  },
  displayName: { type: String, required: true, trim: true },
  status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },
  
  // Customization for the tenant's website
  theme: {
    palette: { type: String, enum: ['modern', 'luxe', 'bold'], default: 'modern' },
    font: { type: String, default: 'Inter' }
  },
  
  hero: {
    headline: { type: String, default: 'Your Trusted Real Estate Partner' },
    tagline: { type: String, default: 'Find your dream property with us' },
    backgroundImageUrl: { type: String, default: '' }
  },
  
  profile: {
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    experience: { type: String, default: '' },
    specializations: [String]
  },
  
  contact: {
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  
}, { timestamps: true });

// Create an index on the subdomain for fast lookups, which is critical for performance.
tenantSchema.index({ subdomain: 1 });

module.exports = mongoose.model('Tenant', tenantSchema);