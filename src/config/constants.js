import Constants from 'expo-constants';

// Get API URL from app.json extra config or fallback to localhost
export const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000/api';

export const MAIN_WEBSITE_URL = 'https://nest-connect.in';

// Image upload settings
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// App settings
export const APP_NAME = 'Nest Connect';
export const SUPPORT_EMAIL = 'support@nest-connect.in';
export const SUPPORT_PHONE = '+91-XXXXXXXXXX';

export default {
  API_BASE_URL,
  MAIN_WEBSITE_URL,
  MAX_IMAGE_SIZE,
  ALLOWED_IMAGE_TYPES,
  APP_NAME,
  SUPPORT_EMAIL,
  SUPPORT_PHONE
};