const express = require('express');
const router = express.Router();
const {
  searchMarketplace,
  addListing,
  updateListing,
  removeListing,
} = require('../controllers/marketplace.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', searchMarketplace);
router.post('/', protect, authorize('client', 'admin'), addListing);
router.put('/:id', protect, authorize('client', 'admin'), updateListing);
router.delete('/:id', protect, authorize('client', 'admin'), removeListing);

module.exports = router;
