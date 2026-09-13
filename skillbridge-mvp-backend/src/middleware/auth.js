const jwt = require('jsonwebtoken');

// ميدل وير للتأكد إن المستخدم عامل تسجيل دخول (JWT صحيح)
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'مفيش توكن، لازم تسجل دخول' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'توكن غير صالح أو منتهي' });
  }
};

// ميدل وير للتحقق من الصلاحيات (Roles) - بيتستخدم بعد protect
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'مفيش صلاحية للوصول لده' });
    }
    next();
  };
};

module.exports = { protect, authorize };
