require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/utils/db');

// --- Route Imports ---
const authRoutes = require('./src/routes/auth');
const tenantRoutes = require('./src/routes/tenants');
const propertyRoutes = require('./src/routes/properties');
const requirementRoutes = require('./src/routes/requirements');
const publicRoutes = require('./src/routes/public');
const uploadRoutes = require('./src/routes/upload');

const app = express();

// --- Connect to MongoDB ---
connectDB();

// --- CRITICAL CORS CONFIGURATION (THE FINAL FIX) ---
// This explicitly tells your backend who is allowed to talk to it.
const allowedOrigins = [
    'http://localhost:5173',                 // For your local web development
    'https://nest-connect-webpage.vercel.app', // YOUR VERCEL FRONTEND URL
    // In the future, when you have domain access, you'll add these:
    // 'https://nestconnect.in',
    // 'https://*.nestconnect.in'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or tools like Postman)
    if (!origin) return callback(null, true);
    
    // Check if the incoming origin is on our guest list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS')); // If not, reject the request
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// --- END OF CORS CONFIGURATION ---


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);

// --- Health Check Route ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Nest Connect API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// --- 404 Not Found Handler ---
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- Global Error Handler ---
app.use((error, req, res, next) => {
  console.error('SERVER ERROR:', error);
  res.status(500).json({
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});