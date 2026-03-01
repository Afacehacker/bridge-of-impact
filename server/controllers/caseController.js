const Case = require('../models/Case');

// @desc    Get all cases
// @route   GET /api/cases
// @access  Public
exports.getCases = async (req, res, next) => {
    try {
        const cases = await Case.find({ status: 'active' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: cases.length, data: cases });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single case
// @route   GET /api/cases/:id
// @access  Public
exports.getCase = async (req, res, next) => {
    try {
        const fundraisingCase = await Case.findById(req.params.id);
        if (!fundraisingCase) {
            return res.status(404).json({ success: false, error: 'Case not found' });
        }
        res.status(200).json({ success: true, data: fundraisingCase });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new case
// @route   POST /api/cases
// @access  Private/Admin
exports.createCase = async (req, res, next) => {
    try {
        console.log('--- Case Creation Start ---');
        console.log('Headers:', req.headers['content-type']);
        console.log('Body:', req.body);
        console.log('File:', req.file);

        console.log('Body Keys:', Object.keys(req.body));
        Object.keys(req.body).forEach(key => {
            console.log(`${key}: ${req.body[key]}`);
        });

        const { title, location, description, targetAmount, beneficiaryName, category } = req.body;

        let image = req.body.image;
        if (req.file) {
            image = req.file.path; // Cloudinary URL
        }

        if (!image) {
            console.log('Validation Error: Image is missing');
        }

        const fundraisingCase = await Case.create({
            title,
            location,
            description,
            image,
            targetAmount: Number(targetAmount),
            beneficiaryName,
            category: category || 'Medical'
        });

        console.log('Case Created Successfully');
        res.status(201).json({ success: true, data: fundraisingCase });
    } catch (err) {
        console.error('Detailed Create error:', err);
        next(err);
    }
};

// @desc    Update case
// @route   PUT /api/cases/:id
// @access  Private/Admin
exports.updateCase = async (req, res, next) => {
    try {
        console.log('Update Request Body:', req.body);
        console.log('Update Request File:', req.file);

        let fundraisingCase = await Case.findById(req.params.id);
        if (!fundraisingCase) {
            return res.status(404).json({ success: false, error: 'Case not found' });
        }

        if (req.file) {
            req.body.image = req.file.path; // Cloudinary URL
        }

        fundraisingCase = await Case.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: fundraisingCase });
    } catch (err) {
        console.error('Update Case Error:', err);
        next(err);
    }
};

// @desc    Delete case
// @route   DELETE /api/cases/:id
// @access  Private/Admin
exports.deleteCase = async (req, res, next) => {
    try {
        const fundraisingCase = await Case.findById(req.params.id);
        if (!fundraisingCase) {
            return res.status(404).json({ success: false, error: 'Case not found' });
        }
        await fundraisingCase.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
