const paymentService = require('../services/payment.service');

const createEscrowPayment = async (req, res) => {
  try {
    const { projectId, amount } = req.body;
    const payment = await paymentService.createEscrowPayment({
      projectId,
      clientId: req.user.id,
      amount,
    });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const releaseEscrowPayment = async (req, res) => {
  try {
    const { studentId } = req.body;
    const payment = await paymentService.releaseEscrowPayment(req.params.id, studentId);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const refundPayment = async (req, res) => {
  try {
    const payment = await paymentService.refundPayment(req.params.id);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getPaymentsByProject = async (req, res) => {
  try {
    const payments = await paymentService.getPaymentsByProject(req.params.projectId);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { createEscrowPayment, releaseEscrowPayment, refundPayment, getPaymentsByProject };
