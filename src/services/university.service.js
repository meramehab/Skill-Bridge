const UniversityVerification = require('../models/UniversityVerification');
const User = require('../models/User');

// التحقق عبر الإيميل الجامعي - نتأكد إن الدومين بيخص جامعة (قائمة بسيطة قابلة للتوسيع)
const UNIVERSITY_EMAIL_DOMAINS = ['.edu', '.edu.eg', 'edu.eg'];

const isUniversityEmail = (email) => {
  return UNIVERSITY_EMAIL_DOMAINS.some((domain) => email.toLowerCase().endsWith(domain));
};

const submitVerification = async (userId, data) => {
  const { method, universityEmail, studentCardImageUrl, universityName } = data;

  const verification = await UniversityVerification.create({
    user: userId,
    method,
    universityEmail: universityEmail || null,
    studentCardImageUrl: studentCardImageUrl || null,
    universityName: universityName || null,
  });

  // لو التحقق عن طريق إيميل جامعي، ممكن نوافق أوتوماتيك MVP لو الدومين مطابق
  if (method === 'university_email' && universityEmail && isUniversityEmail(universityEmail)) {
    verification.status = 'approved';
    await verification.save();

    await User.findByIdAndUpdate(userId, {
      isUniversityVerified: true,
      universityEmail,
      university: universityName || undefined,
    });
  }

  return verification;
};

const reviewVerification = async (verificationId, adminId, { status, rejectionReason }) => {
  const verification = await UniversityVerification.findById(verificationId);
  if (!verification) {
    const error = new Error('طلب التحقق مش موجود');
    error.statusCode = 404;
    throw error;
  }

  verification.status = status;
  verification.reviewedBy = adminId;
  if (status === 'rejected') verification.rejectionReason = rejectionReason || '';
  await verification.save();

  if (status === 'approved') {
    await User.findByIdAndUpdate(verification.user, { isUniversityVerified: true });
  }

  return verification;
};

const getPendingVerifications = async () => {
  return UniversityVerification.find({ status: 'pending' }).populate('user', 'fullName email');
};

module.exports = { submitVerification, reviewVerification, getPendingVerifications };
