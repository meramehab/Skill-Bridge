export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const isRequired = (value) => {
  return value !== undefined && value !== null && String(value).trim().length > 0;
};

export const validateRegisterForm = ({ fullName, email, password }) => {
  const errors = {};
  if (!isRequired(fullName)) errors.fullName = 'الاسم مطلوب';
  if (!isValidEmail(email)) errors.email = 'الإيميل غير صحيح';
  if (!isValidPassword(password)) errors.password = 'الباسورد لازم يكون 6 أحرف على الأقل';
  return errors;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!isValidEmail(email)) errors.email = 'الإيميل غير صحيح';
  if (!isRequired(password)) errors.password = 'الباسورد مطلوب';
  return errors;
};
