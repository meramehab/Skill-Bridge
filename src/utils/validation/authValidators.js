/**
 * @file authValidators.js
 * @description Form validation routines for Login and Multi-step Registration with Arabic errors.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UNIVERSITY_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.edu(\.[a-z]{2,3})?$/i;

/**
 * Validate single auth field (useful for on-blur validation)
 * @param {string} field
 * @param {any} value
 * @param {Object} [allValues={}]
 * @returns {string|null} Error message or null
 */
export function validateAuthField(field, value, allValues = {}) {
  switch (field) {
    case "email":
      if (!value || !value.toString().trim()) {
        return "البريد الإلكتروني مطلوب.";
      }
      if (!EMAIL_REGEX.test(value.trim())) {
        return "صيغة البريد الإلكتروني غير صحيحة.";
      }
      return null;

    case "universityEmail":
      if (!value || !value.toString().trim()) {
        return "البريد الجامعي مطلوب للتوثيق.";
      }
      if (!EMAIL_REGEX.test(value.trim())) {
        return "صيغة البريد الإلكتروني غير صحيحة.";
      }
      if (!UNIVERSITY_EMAIL_REGEX.test(value.trim()) && !value.includes(".edu")) {
        return "يُفضل استخدام بريد جامعي ينتهي بـ edu (مثال: student@eng.cu.edu.eg).";
      }
      return null;

    case "password":
      if (!value || !value.toString().trim()) {
        return "كلمة المرور مطلوبة.";
      }
      if (value.length < 6) {
        return "كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام.";
      }
      return null;

    case "confirmPassword":
      if (!value || !value.toString().trim()) {
        return "تأكيد كلمة المرور مطلوب.";
      }
      if (allValues.password && value !== allValues.password) {
        return "كلمتا المرور غير متطابقتين.";
      }
      return null;

    case "name":
      if (!value || !value.toString().trim()) {
        return "الاسم بالكامل مطلوب.";
      }
      if (value.trim().length < 3) {
        return "الاسم يجب ألا يقل عن 3 أحرف.";
      }
      return null;

    case "university":
      if (!value || !value.toString().trim()) {
        return "يرجى اختيار الجامعة.";
      }
      return null;

    case "faculty":
      if (!value || !value.toString().trim()) {
        return "يرجى إدخال اسم الكلية والتخصص.";
      }
      return null;

    default:
      return null;
  }
}

/**
 * Validate Login Form on Submit
 * @param {Object} values
 */
export function validateLoginForm(values = {}) {
  const errors = {};

  const emailError = validateAuthField("email", values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validateAuthField("password", values.password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate Registration Step 1 (Personal & Academic Info)
 * @param {Object} values
 */
export function validateRegisterStep1(values = {}) {
  const errors = {};

  const nameError = validateAuthField("name", values.name);
  if (nameError) errors.name = nameError;

  const emailError = validateAuthField("email", values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validateAuthField("password", values.password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validateAuthField("confirmPassword", values.confirmPassword, values);
  if (confirmError) errors.confirmPassword = confirmError;

  const uniError = validateAuthField("university", values.university);
  if (uniError) errors.university = uniError;

  const facError = validateAuthField("faculty", values.faculty);
  if (facError) errors.faculty = facError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate Registration Step 2 (Student ID Upload)
 * @param {File|null} file
 */
export function validateRegisterStep2(file) {
  const errors = {};

  if (!file) {
    errors.studentIdFile = "يرجى رفع صورة الكارنيه الجامعي للمتابعة.";
  } else {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      errors.studentIdFile = "الصيغة غير مدعومة. يرجى رفع ملف بصيغة JPG أو PNG أو PDF.";
    } else if (file.size > 5 * 1024 * 1024) {
      errors.studentIdFile = "حجم الملف كبير جداً. الحد الأقصى المسموح هو 5 ميجابايت.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
