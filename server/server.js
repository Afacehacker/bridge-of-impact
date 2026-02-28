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

// 1. ABSOLUTE PRIORITY: CORS must be the first middleware to run
app.use(cors({
    origin: true,
    credentials: true
}));

// 2. Body Parsing (before routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 3. Diagnostics (v1.0.7)
app.get('/diag', (req, res) => res.json({
    status: 'ok',
    version: '1.0.7',
    env: process.env.NODE_ENV,
    uptime: process.uptime()
}));
app.get('/health', (req, res) => res.json({ status: 'alive', version: '1.0.7' }));

// 4. API ROUTES (High Priority)
console.log('Registering API routes...');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));

// 4.1 Database Connection (Critical)
console.log('Connecting to database...');
connectDB();

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

// Start server if run directly
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (Version 1.0.7)`);
    });
}

// Export for Vercel
module.exports = app;

