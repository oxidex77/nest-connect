const slugify = require('slugify');

// Generate unique slug
const generateUniqueSlug = async (text, Model, field = 'slug') => {
  const baseSlug = slugify(text, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  
  while (await Model.findOne({ [field]: slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// Format price for display
const formatPrice = (price, priceType = 'total') => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  }
  return `₹${price.toLocaleString()}`;
};

// Validate phone number (Indian format)
const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Validate email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random string
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = {
  generateUniqueSlug,
  formatPrice,
  validatePhone,
  validateEmail,
  generateRandomString
};