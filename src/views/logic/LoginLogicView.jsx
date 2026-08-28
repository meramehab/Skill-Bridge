/**
 * @file LoginLogicView.jsx
 * @description Logic wiring for Login page connecting useLogin with black-box UI components.
 */
import React from "react";
import { useLogin } from "../../hooks/useLogin";

export function LoginLogicView({
  Button = (p) => <button {...p} />,
  Card = (p) => <div {...p} />,
  Input = (p) => <input {...p} />
}) {
  const {
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
  } = useLogin((user) => {
    // Navigate on successful login
    window.location.href = "/marketplace";
  });

  return (
    <Card id="login-container">
      <h2>تسجيل الدخول إلى SkillBridge</h2>

      {/* Unverified Account Alert */}
      {requiresVerificationRedirect && (
        <div id="unverified-account-alert">
          <p>{serverError}</p>
          <Button
            id="btn-goto-verification"
            onClick={() => {
              window.location.href = "/register?step=2";
            }}
          >
            استكمال رفع الكارنيه الجامعي
          </Button>
        </div>
      )}

      {/* General Server Error */}
      {serverError && !requiresVerificationRedirect && (
        <div id="server-error-alert" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} id="login-form">
        {/* Email Field */}
        <div id="field-email-group">
          <label htmlFor="email">البريد الجامعي أو الشخصي</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="student@eng.cu.edu.eg"
            disabled={isSubmitting}
          />
          {touched.email && errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div id="field-password-group">
          <label htmlFor="password">كلمة المرور</label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          {touched.password && errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div id="login-options-row">
          <label htmlFor="rememberMe">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            تذكرني
          </label>

          <button
            id="btn-forgot-password"
            type="button"
            onClick={handleForgotPassword}
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        {/* Submit Button */}
        <Button
          id="btn-login-submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جارٍ تسجيل الدخول..." : "دخول"}
        </Button>
      </form>
    </Card>
  );
}

export default LoginLogicView;
