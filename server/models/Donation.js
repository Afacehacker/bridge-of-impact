const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    donorName: {
        type: String,
        default: 'Anonymous'
    },
    donorEmail: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentReference: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    paidAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', donationSchema);
