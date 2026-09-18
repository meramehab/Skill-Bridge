/**
 * @file LoginLogicView.jsx
 * @description Modern Figma presentation layer for the Login page connecting useLogin.
 * Features dark glassmorphic container, floating labels, verification alerts, and responsive layout.
 */
import React from "react";
import { useLogin } from "../../hooks/useLogin";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { NavbarLogic as Navbar, LogoMark } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  Mail,
  Lock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export function LoginLogicView({
  ButtonComponent = Button,
  CardComponent = Card,
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
    if (typeof window !== "undefined") {
      window.location.href = "/marketplace";
    }
  });

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <CardComponent id="login-container" variant="elevated" className="p-8 sm:p-10 border border-[#262c3d]">
            {/* Header / Brand */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <LogoMark size={44} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-2">
                تسجيل الدخول إلى SkillBridge
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                مرحباً بعودتك! ادخل بياناتك لمتابعة مشاريعك ومسارك التعليمي
              </p>
            </div>

            {/* Unverified Account Alert */}
            {requiresVerificationRedirect && (
              <div id="unverified-account-alert" className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">{serverError}</p>
                </div>
                <ButtonComponent
                  id="btn-goto-verification"
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = "/register?step=2";
                    }
                  }}
                >
                  استكمال رفع الكارنيه الجامعي
                </ButtonComponent>
              </div>
            )}

            {/* General Server Error */}
            {serverError && !requiresVerificationRedirect && (
              <div id="server-error-alert" role="alert" className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} id="login-form" className="space-y-5">
              {/* Email Field */}
              <div id="field-email-group" className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold text-gray-300">
                  البريد الجامعي أو الشخصي
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="student@eng.cu.edu.eg"
                    disabled={isSubmitting}
                    className={`w-full bg-[#181b24] border text-sm rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none transition ${
                      touched.email && errors.email
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-[#2a2f3e] focus:border-emerald-500"
                    }`}
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {touched.email && errors.email && (
                  <span className="error-message text-[11px] font-medium text-red-400 block mt-1">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div id="field-password-group" className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-gray-300">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className={`w-full bg-[#181b24] border text-sm rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none transition ${
                      touched.password && errors.password
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-[#2a2f3e] focus:border-emerald-500"
                    }`}
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {touched.password && errors.password && (
                  <span className="error-message text-[11px] font-medium text-red-400 block mt-1">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div id="login-options-row" className="flex items-center justify-between text-xs pt-1">
                <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300 select-none">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-4 h-4 rounded border-[#2a2f3e] bg-[#181b24] text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>تذكرني</span>
                </label>

                <button
                  id="btn-forgot-password"
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {/* Submit Button */}
              <ButtonComponent
                id="btn-login-submit"
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
              </ButtonComponent>
            </form>

            {/* Bottom Link */}
            <div className="text-center mt-8 pt-6 border-t border-[#222634] text-xs text-gray-400">
              <span>ليس لديك حساب بعد؟ </span>
              <a href="/register" className="font-bold text-emerald-400 hover:underline">
                إنشاء حساب طالب جديد
              </a>
            </div>
          </CardComponent>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginLogicView;
