const express = require('express');
const router = express.Router();
const { getCases, getCase, createCase, updateCase, deleteCase } = require('../controllers/caseController');
const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getCases)
    .post(upload.single('image'), protect, createCase);

router.route('/:id')
    .get(getCase)
    .put(upload.single('image'), protect, updateCase)
    .delete(protect, deleteCase);

module.exports = router;
