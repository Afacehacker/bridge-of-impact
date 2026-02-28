console.log('--- Server Booting ---');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
const VERSION = '1.3.1';

// 1. ROOT & HEALTH (MUST BE TOP)
app.get('/', (req, res) => {
    console.log('>>> [HIT] Root Path (/) accessed successfully');
    res.status(200).json({
        message: 'Bridge of Impact Initiative API is Online 🚀',
        version: VERSION,
        status: 'ready'
    });
});

app.get('/health', (req, res) => {
    console.log('>>> [HIT] Health Path (/health) accessed successfully');
    res.status(200).json({ status: 'alive', boot_stage: 'active', version: VERSION });
});

// 2. CORS CONFIGURATION (STRICT)
const allowedOrigins = [
    'https://bridge-of-impact.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manual Header Fallback (Guaranteed CORS)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// 3. START LISTENING
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('------------------------------------------------');
    console.log(`🚀 INITIAL BOOT: Listening on port ${PORT} (v${VERSION})`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log('------------------------------------------------');
});

// 4. API ROUTES & MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ensure uploads directory
const uploadsDir = path.join(__dirname, 'uploads', 'cases');
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (e) {
    console.warn('[Warning] Uploads dir skip:', e.message);
}

// 4. API ROUTES
console.log('Registering routes...');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));

// 5. Database (Asynchronous)
console.log('Connecting to database...');
connectDB().then(() => {
    console.log('✅ Background Database Connection Successful');
}).catch(err => {
    console.error('❌ Background Database Connection Failed:', err.message);
});

// 6. Static Files
const clientDistPath = path.join(__dirname, '../client/dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath)) {
    console.log('Serving production static assets...');
    app.use(express.static(clientDistPath));
}

// 7. Global Catch-all & Error Handling
app.use(require('./middleware/errorMiddleware'));

// The absolute final handler (Unified 404 & SPA Routing)
app.use((req, res) => {
    // 1. If it's an API request, return JSON 404
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }

    // 2. If it's a frontend request in production, serve index.html
    if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath)) {
        return res.sendFile(path.resolve(clientDistPath, 'index.html'));
    }

    // 3. Otherwise, generic 404
    res.status(404).json({ message: "Route not found", path: req.originalUrl });
});

process.on('uncaughtException', (err) => {
    console.error('>>> CRITICAL EXCEPTION:', err);
});

module.exports = app;

