import axios from 'axios';
import Constants from 'expo-constants';
import { getToken } from './auth';

// Get API URL from app.json extra config or fallback to localhost
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for network requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically add the auth token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- AUTHENTICATION API CALLS ---

/**
 * Registers a new user and their tenant website.
 * @param {object} userData - { name, email, password, phone, preferredSubdomain }
 * @returns {Promise<object>} - The response data including token, user, and tenant info.
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} - The response data including token, user, and tenant info.
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};

/**
 * Checks if a subdomain is available in real-time.
 * @param {string} subdomain
 * @returns {Promise<object>} - { available: boolean }
 */
export const checkSubdomainAvailability = async (subdomain) => {
    try {
        const response = await api.get(`/public/check-subdomain/${subdomain}`);
        return response.data;
    } catch (error) {
        // If the API fails, assume it's not available to be safe
        return { available: false };
    }
};

/**
 * Uploads an image file as a base64 string and returns the URL.
 * @param {string} imageBase64 - The base64 encoded image string.
 * @returns {Promise<string>} - The public URL of the uploaded image.
 */
export const uploadImage = async (imageBase64) => {
    try {
        const response = await api.post('/upload', { imageBase64 });
        return response.data.url;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Image upload failed.');
    }
};

/**
 * Adds a new property listing.
 * @param {object} propertyData - The complete data for the new property.
 * @returns {Promise<object>} - The newly created property object.
 */
export const addProperty = async (propertyData) => {
    try {
        const response = await api.post('/properties', propertyData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to list property.');
    }
};

// --- We will add other API functions (properties, requirements) here later ---

export default api;