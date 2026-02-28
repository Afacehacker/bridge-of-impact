require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

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
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(ao => origin.includes(ao))) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(helmet());
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log(`>>> ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
    });
} else {
    // Basic Route for development
    app.get('/', (req, res) => {
        res.json({ message: 'Bridge of Impact Initiative API is running...' });
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
