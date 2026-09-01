const universityService = require('../services/university.service');

const submitVerification = async (req, res) => {
  try {
    const verification = await universityService.submitVerification(req.user.id, req.body);
    res.status(201).json({ success: true, data: verification });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const reviewVerification = async (req, res) => {
  try {
    const verification = await universityService.reviewVerification(
      req.params.id,
      req.user.id,
      req.body
    );
    res.status(200).json({ success: true, data: verification });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getPendingVerifications = async (req, res) => {
  try {
    const verifications = await universityService.getPendingVerifications();
    res.status(200).json({ success: true, data: verifications });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { submitVerification, reviewVerification, getPendingVerifications };
