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

// 0. IMMEDIATE HEALTHCHECK (Before anything else)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'alive', boot_stage: 'initial' });
});

// START LISTENING IMMEDIATELY
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('------------------------------------------------');
    console.log(`🚀 INITIAL BOOT: Listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log('------------------------------------------------');
});

// 1. Diagnostics
app.get('/diag', (req, res) => res.json({
    status: 'ok',
    version: '1.0.9',
    env: process.env.NODE_ENV,
    uptime: process.uptime(),
    port: PORT
}));

// 2. Middleware & CORS
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 3. Ensure uploads directory
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
    app.get('/*', (req, res) => {
        if (!req.url.startsWith('/api')) {
            res.sendFile(path.resolve(clientDistPath, 'index.html'));
        }
    });
}

// 7. Error Handling
app.use('/api/*', (req, res) => res.status(404).json({ error: 'API route not found' }));
app.use(require('./middleware/errorMiddleware'));

process.on('uncaughtException', (err) => {
    console.error('>>> CRITICAL EXCEPTION:', err);
});

module.exports = app;

