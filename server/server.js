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
const VERSION = '1.3.5';

// 1. GLOBAL CORS & HEADERS (MUST BE FIRST)
const allowedOrigins = [
    'https://bridge-of-impact.vercel.app',
    'https://bridge-of-impact-git-main-afacehackers-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manual Header Fallback (Guaranteed CORS for every route)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        console.log(`>>> [CORS DEBUG] Request from Origin: ${origin}`);
    }

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// 2. ROOT & HEALTHCHECK (TOP LEVEL)
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'BRIDGE OF IMPACT API - OPERATIONAL 🚀',
        version: VERSION,
        environment: process.env.NODE_ENV
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', version: VERSION });
});

// 3. MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ensure uploads directory exists and serve it statically
const uploadsDir = path.join(__dirname, 'uploads');
const casesDir = path.join(uploadsDir, 'cases');

try {
    if (!fs.existsSync(casesDir)) {
        fs.mkdirSync(casesDir, { recursive: true });
        console.log('>>> [FS] Created uploads/cases directory');
    }
} catch (e) {
    console.warn('[Warning] Uploads dir creation skip:', e.message);
}

// SERVE UPLOADS FOLDER WITH EXPLICIT CORS (FOR PERMANENT ACCESS)
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
}, express.static(uploadsDir));

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
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath)) {
        return res.sendFile(path.resolve(clientDistPath, 'index.html'));
    }
    res.status(404).json({
        message: "Not Found",
        path: req.originalUrl,
        hint: "Are you missing the /api prefix?",
        version: VERSION
    });
});

// 8. START LISTENING (AT THE BOTTOM)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('------------------------------------------------');
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT} (v${VERSION})`);
    console.log('------------------------------------------------');
});

process.on('uncaughtException', (err) => {
    console.error('>>> CRITICAL EXCEPTION:', err);
});

module.exports = app;

