const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { fullName, email, password, university } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
    }

    const { user, token } = await authService.registerUser({ fullName, email, password, university });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
    }

    const { user, token } = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };
