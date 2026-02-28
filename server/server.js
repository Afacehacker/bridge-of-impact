console.log('--- Server Booting ---');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'cases');
if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory:', uploadsDir);
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
console.log('Express app initialized (Env:', process.env.NODE_ENV, ')');

// CORS configuration - MUST be before other middleware
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://bridge-of-impact.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        console.log('--- CORS Check ---');
        console.log('Request Origin:', origin);
        console.log('Allowed Origins:', allowedOrigins);

        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(ao => origin.includes(ao))) {
            console.log('CORS Result: ALLOWED');
            callback(null, true);
        } else {
            console.log('CORS Result: BLOCKED');
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(helmet());
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log(`>>> ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    next();
});

// Global health check for production
app.get('/health', (req, res) => {
    res.json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        version: '1.0.1'
    });
});

// Routes
console.log('Registering routes...');
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));

// Connect to Database AFTER routes registration
console.log('Connecting to database...');
connectDB();

// Serve static assets in production (Only if files exist locally)
const clientDistPath = path.join(__dirname, '../client/dist');

if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath)) {
    console.log('Serving production static assets from client/dist');
    app.use(express.static(clientDistPath));
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(clientDistPath, 'index.html'));
    });
} else {
    // Basic Route for development or split-hosting
    app.get('/', (req, res) => {
        res.json({
            message: 'Bridge of Impact Initiative API is running...',
            environment: process.env.NODE_ENV || 'development',
            status: 'online',
            mongodb: process.env.MONGO_URI || process.env.MONGODB_URI ? 'Connected' : 'Missing URI'
        });
    });
}

// 404 Handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});

// Error Middleware
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
