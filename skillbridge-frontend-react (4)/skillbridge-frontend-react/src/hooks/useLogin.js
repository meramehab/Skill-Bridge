/**
 * @file useLogin.js
 * @description Hook managing student login form state, real-time & on-submit validation,
 * authentication errors, remember-me persistence, and unverified student redirects.
 */
import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { validateLoginForm, validateAuthField } from "../utils/validation/authValidators";

export function useLogin(onSuccessRedirect = () => {}) {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [requiresVerificationRedirect, setRequiresVerificationRedirect] = useState(false);

  // Field change handler
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    setServerError(null);

    // Clear error dynamically if field is already touched
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const fieldError = validateAuthField(name, fieldValue);
      return { ...prev, [name]: fieldError };
    });
  }, []);

  // On-blur validation handler for real-time user feedback
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const fieldError = validateAuthField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    },
    []
  );

  // Form submission handler
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      // Mark all fields touched
      setTouched({ email: true, password: true });

      const { isValid, errors: validationErrors } = validateLoginForm(formData);
      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      setServerError(null);
      setRequiresVerificationRedirect(false);

      try {
        const response = await login(formData);
        if (onSuccessRedirect) {
          onSuccessRedirect(response);
        }
      } catch (err) {
        // Special case: Account exists but student ID card needs verification
        if (err.code === "ACCOUNT_NOT_VERIFIED" || err.status === 403) {
          setRequiresVerificationRedirect(true);
          setServerError(err.message || "الحساب غير موثق جامعيًا بعد.");
        } else {
          setServerError(err.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, login, onSuccessRedirect]
  );

  // Forgot password placeholder handler
  const handleForgotPassword = useCallback(() => {
    // TODO: Connect with forgot password modal or separate route (/auth/forgot-password)
    alert("سيتم إرسال رابط استعادة كلمة المرور إلى بريدك الجامعي المسجل.");
  }, []);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    serverError,
    requiresVerificationRedirect,
    handleChange,
    handleBlur,
    handleSubmit,
    handleForgotPassword
  };
}

export default useLogin;
