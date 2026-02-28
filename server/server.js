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
const VERSION = '1.2.0';

// START LISTENING IMMEDIATELY
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('------------------------------------------------');
    console.log(`🚀 INITIAL BOOT: Listening on port ${PORT} (v${VERSION})`);
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

// MODIFIED for Manual Account Payment - New route for manual payment details
app.post('/api/donations/manual-payment-details', async (req, res) => {
    const { caseId, amount, name, email } = req.body;

    if (!caseId || !amount) {
        return res.status(400).json({ success: false, message: 'Case ID and amount are required.' });
    }

    const manualAccount = {
        accountNumber: '8025329616',
        bankName: 'OPAY',
        accountName: 'Bridge of Impact Initiative',
        totalToPay: amount
    };

    // Create pending donation record for manual tracking
    // Assuming Donation model is available via require('./models/Donation') or similar
    // For this example, we'll mock it or assume it's imported if needed.
    // If Donation model is not globally available, it needs to be imported here.
    // const Donation = require('./models/Donation'); // Example import

    // Placeholder for actual Donation creation logic
    // This part requires the Donation model to be defined and imported.
    // For now, we'll simulate the response.
    const donation = {
        _id: new Date().getTime(), // Mock ID
        case: caseId,
        donorName: name || 'Anonymous',
        donorEmail: email,
        amount: amount,
        paymentReference: `MANUAL-${Date.now()}`,
        status: 'pending'
    };

    // In a real application, you would save this to your database:
    // const donation = await Donation.create({
    //     case: caseId,
    //     donorName: name || 'Anonymous',
    //     donorEmail: email,
    //     amount: amount,
    //     paymentReference: `MANUAL-${Date.now()}`,
    //     status: 'pending'
    // });

    res.status(200).json({
        success: true,
        isManual: true,
        data: manualAccount,
        donationId: donation._id
    });
});

// 3. Ensure uploads directory
const uploadsDir = path.join(__dirname, 'uploads', 'cases');
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (e) {
    console.warn('[Warning] Uploads dir skip:', e.message);
}

// 4. ROOT & HEALTHCHECK (Moved to guaranteed location)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Bridge of Impact Initiative API is Online 🚀',
        version: VERSION,
        status: 'ready'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'alive', boot_stage: 'initial', version: VERSION });
});

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

