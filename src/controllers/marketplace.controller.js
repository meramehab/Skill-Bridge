const marketplaceService = require('../services/marketplace.service');

const searchMarketplace = async (req, res) => {
  try {
    const results = await marketplaceService.searchMarketplace(req.query);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addListing = async (req, res) => {
  try {
    const listing = await marketplaceService.addMarketplaceListing(req.user.id, req.body);
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await marketplaceService.updateMarketplaceListing(req.params.id, req.body);
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const removeListing = async (req, res) => {
  try {
    await marketplaceService.removeMarketplaceListing(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف الخدمة/المشروع' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { searchMarketplace, addListing, updateListing, removeListing };
