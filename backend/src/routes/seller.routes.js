const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');

// Route to save seller details to Firebase
router.post('/', sellerController.saveSeller);

// Route to get seller details from Firebase
router.get('/:email', sellerController.getSeller);

module.exports = router;
