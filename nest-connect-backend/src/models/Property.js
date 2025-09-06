const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, trim: true },
  
  purpose: { type: String, enum: ['sale', 'rent', 'lease'], required: true },
  propertyType: { type: String, required: true }, // e.g., 'Apartment', 'Villa', 'Commercial Shop'
  
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String },
    gmapsLink: { type: String }
  },

  price: {
    value: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    priceType: { type: String, enum: ['lumpsum', 'per_month', 'per_sqft'], default: 'lumpsum' }
  },

  features: {
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    areaSqft: { type: Number, required: true },
    parking: { type: Number, default: 0 },
    furnishing: { type: String, enum: ['unfurnished', 'semi-furnished', 'furnished'] },
    facing: { type: String } // e.g., 'East', 'North-West'
  },
  
  media: [{
    url: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  }],

  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  analytics: {
    viewCount: { type: Number, default: 0 }
  }

}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);