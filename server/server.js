console.log('--- Server Booting ---');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Ensure uploads directory exists (Robust handling for read-only systems)
const uploadsDir = path.join(__dirname, 'uploads', 'cases');
try {
    if (!fs.existsSync(uploadsDir)) {
        console.log('Creating uploads directory:', uploadsDir);
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (err) {
    console.warn(`[Warning] Could not ensure uploads directory: ${err.message}. This is normal on read-only serverless environments like Vercel.`);
}

const app = express();
console.log('Express app initialized');

// 0. HEALTHCHECK (Absolute First Priority)
// This must be before any other middleware or routes to ensure healthchecks pass
app.get('/health', (req, res) => {
    console.log(`[Healthcheck] Received request. Server is alive.`);
    res.status(200).json({
        status: 'alive',
        version: '1.0.8',
        timestamp: new Date().toISOString()
    });
});

app.get('/diag', (req, res) => res.json({
    status: 'ok',
    version: '1.0.8',
    env: process.env.NODE_ENV,
    uptime: process.uptime(),
    port: process.env.PORT || 5000
}));

// 1. ABSOLUTE PRIORITY: CORS must be the first middleware to run after healthcheck
app.use(cors({
    origin: true,
    credentials: true
}));

// 2. Body Parsing (before routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 3. Diagnostics (v1.0.8) moved to top

// 4. API ROUTES (High Priority)
console.log('Registering API routes...');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));

// 4.1 Database Connection (Critical)
console.log('Connecting to database...');
(async () => {
    await connectDB();
})();

// 5. Static Files & Production logic
const clientDistPath = path.join(__dirname, '../client/dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath)) {
    console.log('Serving production static assets from:', clientDistPath);
    app.use(express.static(clientDistPath));
} else {
    console.log('Frontend serving disabled: Not in production OR client/dist not found.');
}

// 6. Generic Root Response
app.get('/', (req, res) => {
    res.json({
        message: 'Bridge of Impact Initiative API is running...',
        version: '1.0.7',
        status: 'online',
        deployment: 'Unified'
    });
});

// Serve frontend routing (must be AFTER API routes)
if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath)) {
    app.get('/*', (req, res) => {
        if (!req.url.startsWith('/api')) {
            res.sendFile(path.resolve(clientDistPath, 'index.html'));
        }
    });
}

// 7. Explicit 404 for API
app.use('/api/*', (req, res) => {
    console.log(`>>> [API 404] ${req.method} ${req.url}`);
    res.status(404).json({ success: false, error: `API route ${req.url} not found` });
});

// 8. Global 404 Handler
app.use((req, res) => {
    console.log(`>>> [Global 404] ${req.method} ${req.url}`);
    res.status(404).json({ message: "Not Found", path: req.url });
});

// 9. Error Middleware
app.use(require('./middleware/errorMiddleware'));

// 10. Process Error Handlers
process.on('uncaughtException', (err) => {
    console.error('>>> CRITICAL: UNCAUGHT EXCEPTION');
    console.error(err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('>>> CRITICAL: UNHANDLED REJECTION');
    console.error(reason);
});

// Start server
const PORT = process.env.PORT || 5000;

// On Railway/Render/Local, we should always listen
// On Vercel, it might trigger a warning but it's required for healthchecks on other platforms
const startServer = () => {
    try {
        app.listen(PORT, '0.0.0.0', () => {
            console.log('------------------------------------------------');
            console.log(`🚀 Server running on port ${PORT} (Version 1.0.8)`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
            console.log('------------------------------------------------');
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

if (require.main === module || process.env.RAILWAY_ENVIRONMENT || process.env.RENDER) {
    startServer();
}

// Export for Vercel
module.exports = app;

