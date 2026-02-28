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

// ABSOLUTELY FIRST: Diagnostic routes
app.get('/diag', (req, res) => res.json({ status: 'ok', version: '1.0.3', env: process.env.NODE_ENV }));
app.get('/health', (req, res) => res.json({ status: 'alive', version: '1.0.3' }));

// TEMP: Permissive CORS for debugging
app.use(cors({
    origin: true,
    credentials: true
}));

// CORS configuration (Keep for when we switch back)
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://bridge-of-impact.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
].filter(Boolean);

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

// Diagnostics already registered above. Moving on to routes...

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
            environment: process.env.NODE_ENV || 'production',
            status: 'online',
            mongodb: process.env.MONGO_URI || process.env.MONGODB_URI ? 'Connected' : 'Missing URI'
        });
    });
}

// 404 Handler for unmatched routes
app.use((req, res) => {
    console.log(`>>> [404] ${req.method} ${req.url}`);
    res.status(404).json({
        message: "API Route Not Found",
        path: req.url,
        tip: "Check your VITE_API_URL settings"
    });
});

// Error Middleware
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});
