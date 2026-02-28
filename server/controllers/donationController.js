const Donation = require('../models/Donation');
const Case = require('../models/Case');
const paystack = require('../utils/paystack')(process.env.PAYSTACK_SECRET_KEY);

// @desc    Initialize donation
// @route   POST /api/donations/initialize
// @access  Public
exports.initializeDonation = async (req, res, next) => {
    try {
        const { amount, email, caseId, name } = req.body;

        if (!amount || !email || !caseId) {
            return res.status(400).json({ success: false, error: 'Please provide all required fields' });
        }

        const fundraisingCase = await Case.findById(caseId);
        if (!fundraisingCase) {
            return res.status(404).json({ success: false, error: 'Case not found' });
        }

        // Initialize Paystack transaction
        // Paystack expects amount in kobo
        const paystackData = await paystack.initializeTransaction({
            amount: amount * 100,
            email,
            metadata: {
                caseId,
                donorName: name || 'Anonymous'
            }
        });

        // Create pending donation record
        await Donation.create({
            case: caseId,
            donorName: name || 'Anonymous',
            donorEmail: email,
            amount: amount,
            paymentReference: paystackData.data.reference,
            status: 'pending'
        });

        res.status(200).json({
            success: true,
            data: paystackData.data
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify donation (Webhook or Client Callback)
// @route   GET /api/donations/verify/:reference
// @access  Public
exports.verifyDonation = async (req, res, next) => {
    try {
        const { reference } = req.params;
        const verification = await paystack.verifyTransaction(reference);

        if (verification.data.status === 'success') {
            const donation = await Donation.findOne({ paymentReference: reference });

            if (donation && donation.status !== 'success') {
                donation.status = 'success';
                donation.paidAt = new Date();
                await donation.save();

                // Update case raised amount
                const fundraisingCase = await Case.findById(donation.case);
                if (fundraisingCase) {
                    fundraisingCase.amountRaised += donation.amount;
                    if (fundraisingCase.amountRaised >= fundraisingCase.targetAmount) {
                        fundraisingCase.status = 'completed';
                    }
                    await fundraisingCase.save();
                }
            }

            return res.status(200).json({ success: true, message: 'Donation verified' });
        } else {
            return res.status(400).json({ success: false, message: 'Donation not successful' });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Paystack Webhook
// @route   POST /api/donations/webhook
// @access  Public
exports.paystackWebhook = async (req, res, next) => {
    try {
        // In production, verify the Paystack signature (x-paystack-signature)
        const event = req.body;

        if (event.event === 'charge.success') {
            const reference = event.data.reference;
            const donation = await Donation.findOne({ paymentReference: reference });

            if (donation && donation.status !== 'success') {
                donation.status = 'success';
                donation.paidAt = new Date();
                await donation.save();

                const fundraisingCase = await Case.findById(donation.case);
                if (fundraisingCase) {
                    fundraisingCase.amountRaised += donation.amount;
                    if (fundraisingCase.amountRaised >= fundraisingCase.targetAmount) {
                        fundraisingCase.status = 'completed';
                    }
                    await fundraisingCase.save();
                }
            }
        }

        res.status(200).send('Webhook Received');
    } catch (err) {
        next(err);
    }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations
// @access  Private/Admin
exports.getDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find().populate('case', 'title beneficiaryName').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: donations.length, data: donations });
    } catch (err) {
        next(err);
    }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/donations/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
    try {
        const totalAmount = await Donation.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalDonors = await Donation.distinct('donorEmail', { status: 'success' });
        const activeCases = await Case.countDocuments({ status: 'active' });
        const completedCases = await Case.countDocuments({ status: 'completed' });

        res.status(200).json({
            success: true,
            data: {
                totalRaised: totalAmount[0]?.total || 0,
                totalDonors: totalDonors.length,
                activeCases,
                completedCases
            }
        });
    } catch (err) {
        next(err);
    }
};
