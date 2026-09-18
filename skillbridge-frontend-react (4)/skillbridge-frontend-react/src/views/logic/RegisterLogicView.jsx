/**
 * @file RegisterLogicView.jsx
 * @description Modern Figma presentation layer for the Multi-step Registration Wizard connecting useRegisterWizard.
 * Features 3-step progress bar, OCR file upload, verification summary, and dark glassmorphic styling.
 */
import React from "react";
import { useRegisterWizard } from "../../hooks/useRegisterWizard";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { ProgressBarLogic as ProgressBar } from "../../components/contracts/ProgressBarLogic";
import { NavbarLogic as Navbar, LogoMark } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Lock,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export function RegisterLogicView({
  ButtonComponent = Button,
  CardComponent = Card,
  ProgressBarComponent = ProgressBar
}) {
  const {
    currentStep,
    formData,
    errors,
    touched,
    isUploadingId,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleFileSelect,
    goToNextStep,
    goToPreviousStep,
    handleFinalSubmit
  } = useRegisterWizard(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/profile";
    }
  });

  const stepProgress = Math.round((currentStep / 3) * 100);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-2xl relative z-10">
          <CardComponent id="register-wizard-container" variant="elevated" className="p-8 sm:p-10 border border-[#262c3d]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <LogoMark size={40} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-2">
                انضم إلى منصة SkillBridge
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                أنشئ حسابك الجامعي لفتح فرص العمل الحر والمسارات التعليمية المخصصة
              </p>
            </div>

            {/* Stepper Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-mono font-bold text-gray-400 mb-2">
                <span className={currentStep >= 1 ? "text-emerald-400" : ""}>1. البيانات الأساسية</span>
                <span className={currentStep >= 2 ? "text-emerald-400" : ""}>2. توثيق الكارنيه</span>
                <span className={currentStep >= 3 ? "text-emerald-400" : ""}>3. التأكيد النهائي</span>
              </div>
              <ProgressBarComponent value={stepProgress} color="emerald" size="sm" showPercentage={false} />
            </div>

            {/* General Submit Error Alert */}
            {submitError && (
              <div id="register-error-alert" role="alert" className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* ─── STEP 1: Basic & Academic Info ─── */}
            {currentStep === 1 && (
              <div id="register-step-1" className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-bold text-gray-300">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="أحمد محمود علي"
                        className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none transition"
                      />
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {touched.name && errors.name && <span className="text-[11px] text-red-400 block">{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-bold text-gray-300">
                      البريد الإلكتروني الجامعي
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
                        className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none transition"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {touched.email && errors.email && <span className="text-[11px] text-red-400 block">{errors.email}</span>}
                  </div>

                  {/* University */}
                  <div className="space-y-1.5">
                    <label htmlFor="university" className="block text-xs font-bold text-gray-300">
                      الجامعة
                    </label>
                    <div className="relative">
                      <input
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="جامعة القاهرة"
                        className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none transition"
                      />
                      <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {touched.university && errors.university && <span className="text-[11px] text-red-400 block">{errors.university}</span>}
                  </div>

                  {/* Faculty */}
                  <div className="space-y-1.5">
                    <label htmlFor="faculty" className="block text-xs font-bold text-gray-300">
                      الكلية والتخصص
                    </label>
                    <div className="relative">
                      <input
                        id="faculty"
                        name="faculty"
                        value={formData.faculty}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="كلية الهندسة - حاسبات"
                        className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none transition"
                      />
                      <BookOpen className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {touched.faculty && errors.faculty && <span className="text-[11px] text-red-400 block">{errors.faculty}</span>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
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
                        className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none transition"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {touched.password && errors.password && <span className="text-[11px] text-red-400 block">{errors.password}</span>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-300">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                        className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none transition"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <span className="text-[11px] text-red-400 block">{errors.confirmPassword}</span>
                    )}
                  </div>
                </div>

                <ButtonComponent
                  id="btn-next-step-1"
                  variant="primary"
                  size="md"
                  onClick={goToNextStep}
                  className="w-full mt-6"
                >
                  <span>التالي: رفع الكارنيه والتحقق الذكي</span>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </ButtonComponent>
              </div>
            )}

            {/* ─── STEP 2: Student ID Upload & OCR ─── */}
            {currentStep === 2 && (
              <div id="register-step-2" className="space-y-6 animate-fadeIn">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-1">التحقق من الهوية الجامعية (AI OCR)</h3>
                  <p className="text-xs text-gray-400">
                    ارفع صورة واضحة لوجه الكارنيه الجامعي لاستخراج بياناتك تلقائياً والتحقق من هويتك الأكاديمية
                  </p>
                </div>

                <div className="border-2 border-dashed border-[#2e3446] hover:border-emerald-500/60 rounded-3xl p-8 text-center transition bg-[#181b24]/40">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-semibold text-gray-200 mb-1">اسحب صورة الكارنيه هنا أو اضغط للاختيار</p>
                  <p className="text-xs text-gray-500 mb-4">يدعم JPG, PNG أو PDF (حد أقصى 5MB)</p>

                  <input
                    id="student-id-file-input"
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    disabled={isUploadingId}
                    className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 cursor-pointer"
                  />
                </div>

                {isUploadingId && (
                  <div id="ocr-loading-status" className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span>جارٍ قراءة بيانات الكارنيه واستخراج الاسم والرقم الجامعي بالذكاء الاصطناعي...</span>
                  </div>
                )}

                {errors.studentIdFile && (
                  <span className="text-xs text-red-400 block text-center">{errors.studentIdFile}</span>
                )}

                {/* OCR Extracted Preview */}
                {formData.ocrExtractedData && (
                  <div id="ocr-preview-box" className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تم استخراج البيانات بنجاح من الكارنيه:</span>
                    </div>
                    <p className="text-gray-300"><strong>الاسم المستخرج:</strong> {formData.ocrExtractedData.extractedName}</p>
                    <p className="text-gray-300"><strong>الجامعة:</strong> {formData.ocrExtractedData.extractedUniversity}</p>
                    <p className="text-gray-300"><strong>الكلية:</strong> {formData.ocrExtractedData.extractedFaculty}</p>
                    <p className="text-gray-300"><strong>رقم القيد الجامعي:</strong> {formData.ocrExtractedData.studentIdNumber}</p>
                  </div>
                )}

                <div id="step-nav-buttons" className="flex items-center gap-3 pt-2">
                  <ButtonComponent id="btn-prev-step-2" variant="secondary" size="md" onClick={goToPreviousStep} className="flex-1">
                    <ArrowRight className="w-4 h-4 ml-1" />
                    السابق
                  </ButtonComponent>
                  <ButtonComponent id="btn-next-step-2" variant="primary" size="md" onClick={goToNextStep} disabled={isUploadingId} className="flex-1">
                    <span>التالي: مراجعة البيانات</span>
                    <ArrowLeft className="w-4 h-4 mr-1" />
                  </ButtonComponent>
                </div>
              </div>
            )}

            {/* ─── STEP 3: Review & Final Submit ─── */}
            {currentStep === 3 && (
              <div id="register-step-3" className="space-y-6 animate-fadeIn">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-1">مراجعة البيانات وتأكيد التسجيل</h3>
                  <p className="text-xs text-gray-400">يرجى التأكد من صحة بياناتك قبل إنشاء الحساب والبدء</p>
                </div>

                <div id="summary-card" className="p-6 rounded-2xl bg-[#181b24] border border-[#2a2f3e] space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-[#222634] pb-2">
                    <span className="text-gray-400">الاسم:</span>
                    <span className="font-bold text-white">{formData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#222634] pb-2">
                    <span className="text-gray-400">البريد الإلكتروني:</span>
                    <span className="font-bold text-white font-mono">{formData.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#222634] pb-2">
                    <span className="text-gray-400">الجامعة:</span>
                    <span className="font-bold text-white">{formData.university}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#222634] pb-2">
                    <span className="text-gray-400">الكلية والتخصص:</span>
                    <span className="font-bold text-white">{formData.faculty}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-400">حالة التوثيق الجامعي:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      تم رفع الكارنيه والتحقق
                    </span>
                  </div>
                </div>

                <div id="step-nav-buttons" className="flex items-center gap-3 pt-2">
                  <ButtonComponent id="btn-prev-step-3" variant="secondary" size="md" onClick={goToPreviousStep} disabled={isSubmitting} className="flex-1">
                    تعديل البيانات
                  </ButtonComponent>
                  <ButtonComponent
                    id="btn-final-submit"
                    variant="primary"
                    size="md"
                    onClick={handleFinalSubmit}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "جارٍ إنشاء الحساب..." : "تأكيد وإنشاء الحساب"}
                  </ButtonComponent>
                </div>
              </div>
            )}

            {/* Footer switch */}
            <div className="text-center mt-8 pt-6 border-t border-[#222634] text-xs text-gray-400">
              <span>لديك حساب بالفعل؟ </span>
              <a href="/login" className="font-bold text-emerald-400 hover:underline">
                تسجيل الدخول
              </a>
            </div>
          </CardComponent>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RegisterLogicView;
