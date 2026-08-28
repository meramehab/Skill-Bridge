/**
 * @file RegisterLogicView.jsx
 * @description Logic wiring for Multi-step Registration Wizard connecting useRegisterWizard with UI components.
 */
import React from "react";
import { useRegisterWizard } from "../../hooks/useRegisterWizard";

export function RegisterLogicView({
  Button = (p) => <button {...p} />,
  Card = (p) => <div {...p} />,
  Input = (p) => <input {...p} />,
  ProgressBar = (p) => <div {...p} />
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
    window.location.href = "/profile";
  });

  const stepProgress = Math.round((currentStep / 3) * 100);

  return (
    <Card id="register-wizard-container">
      <h2>إنشاء حساب طالب جديد</h2>
      <ProgressBar value={stepProgress} label={`الخطوة ${currentStep} من 3`} />

      {submitError && (
        <div id="register-error-alert" role="alert">
          {submitError}
        </div>
      )}

      {/* STEP 1: Basic & Academic Info */}
      {currentStep === 1 && (
        <div id="register-step-1">
          <h3>1. البيانات الأساسية والجامعية</h3>

          <div>
            <label htmlFor="name">الاسم الثلاثي أو الرباعي</label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="أحمد محمود علي"
            />
            {touched.name && errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div>
            <label htmlFor="email">البريد الإلكتروني الجامعي</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="student@eng.cu.edu.eg"
            />
            {touched.email && errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div>
            <label htmlFor="university">الجامعة</label>
            <Input
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="جامعة القاهرة"
            />
            {touched.university && errors.university && <span className="error">{errors.university}</span>}
          </div>

          <div>
            <label htmlFor="faculty">الكلية والتخصص</label>
            <Input
              id="faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="كلية الهندسة - قسم حاسبات"
            />
            {touched.faculty && errors.faculty && <span className="error">{errors.faculty}</span>}
          </div>

          <div>
            <label htmlFor="password">كلمة المرور</label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div>
            <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          <Button id="btn-next-step-1" onClick={goToNextStep}>
            التالي: رفع الكارنيه الجامعي
          </Button>
        </div>
      )}

      {/* STEP 2: Student ID Upload & OCR */}
      {currentStep === 2 && (
        <div id="register-step-2">
          <h3>2. التحقق من الهوية الجامعية (AI OCR)</h3>
          <p>ارفع صورة واضحة لوجه الكارنيه الجامعي لاستخراج بياناتك تلقائياً.</p>

          <input
            id="student-id-file-input"
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            disabled={isUploadingId}
          />

          {isUploadingId && <p id="ocr-loading-status">جارٍ قراءة بيانات الكارنيه بالذكاء الاصطناعي...</p>}
          {errors.studentIdFile && <span className="error">{errors.studentIdFile}</span>}

          {/* OCR Extracted Preview */}
          {formData.ocrExtractedData && (
            <div id="ocr-preview-box">
              <h4>البيانات المستخرجة من الكارنيه:</h4>
              <p>الاسم: {formData.ocrExtractedData.extractedName}</p>
              <p>الجامعة: {formData.ocrExtractedData.extractedUniversity}</p>
              <p>الكلية: {formData.ocrExtractedData.extractedFaculty}</p>
              <p>رقم القيد: {formData.ocrExtractedData.studentIdNumber}</p>
            </div>
          )}

          <div id="step-nav-buttons">
            <Button id="btn-prev-step-2" onClick={goToPreviousStep}>السابق</Button>
            <Button id="btn-next-step-2" onClick={goToNextStep} disabled={isUploadingId}>
              التالي: مراجعة البيانات
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Final Submit */}
      {currentStep === 3 && (
        <div id="register-step-3">
          <h3>3. مراجعة البيانات وتأكيد التسجيل</h3>

          <div id="summary-card">
            <p><strong>الاسم:</strong> {formData.name}</p>
            <p><strong>البريد:</strong> {formData.email}</p>
            <p><strong>الجامعة:</strong> {formData.university}</p>
            <p><strong>الكلية:</strong> {formData.faculty}</p>
            <p><strong>الكارنيه:</strong> تم الرفع والتحقق</p>
          </div>

          <div id="step-nav-buttons">
            <Button id="btn-prev-step-3" onClick={goToPreviousStep} disabled={isSubmitting}>
              تعديل
            </Button>
            <Button id="btn-final-submit" onClick={handleFinalSubmit} disabled={isSubmitting}>
              {isSubmitting ? "جارٍ إنشاء الحساب..." : "تأكيد وإنشاء الحساب"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default RegisterLogicView;
