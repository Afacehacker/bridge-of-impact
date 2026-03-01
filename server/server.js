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
const VERSION = '1.3.6';

// 1. GLOBAL CORS
const allowedOrigins = [
    'https://bridge-of-impact.vercel.app',
    'https://bridge-of-impact-git-main-afacehackers-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// 2. MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false, // Important for serving images from Cloudinary/Local
}));

// 3. DIAGNOSTICS
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'BRIDGE OF IMPACT API - OPERATIONAL 🚀',
        version: VERSION
    });
});

app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', version: VERSION }));

// 4. API ROUTES
console.log('Registering routes...');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));

// 5. STATIC FILES (Frontend)
const clientDistPath = path.join(__dirname, '../client/dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
}

// 6. ERROR HANDLING
app.use(require('./middleware/errorMiddleware'));

// 7. 404 & SPA ROUTING
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath)) {
        return res.sendFile(path.resolve(clientDistPath, 'index.html'));
    }
    res.status(404).json({ message: "Not Found", path: req.originalUrl, version: VERSION });
});

// 8. DATABASE & START
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();
        console.log('✅ Database connected');

        app.listen(PORT, () => {
            console.log(`🚀 SERVER RUNNING ON PORT ${PORT} (v${VERSION})`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;

