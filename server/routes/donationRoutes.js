const express = require('express');
const router = express.Router();
const {
    initializeDonation,
    verifyDonation,
    paystackWebhook,
    getDonations,
    getStats
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/initialize', initializeDonation);
router.get('/verify/:reference', verifyDonation);
router.post('/webhook', paystackWebhook);
router.get('/', protect, getDonations);
router.get('/stats', protect, getStats);

module.exports = router;
