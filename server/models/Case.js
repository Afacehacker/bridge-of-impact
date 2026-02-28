const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Please add a location (Nigerian City/State)']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Please add a target amount']
    },
    amountRaised: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    beneficiaryName: {
        type: String,
        required: [true, 'Please add beneficiary name']
    },
    category: {
        type: String,
        enum: ['Medical', 'Crisis Relief', 'Education', 'Social Welfare'],
        default: 'Medical'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Case', caseSchema);
