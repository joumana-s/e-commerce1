const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/:productId', reviewController.getReviews);
router.post('/:productId', authenticate, reviewController.createReview);

module.exports = router;
