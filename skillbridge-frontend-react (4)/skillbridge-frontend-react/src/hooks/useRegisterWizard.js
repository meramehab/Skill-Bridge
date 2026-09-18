/**
 * @file useRegisterWizard.js
 * @description Multi-step registration hook managing wizard state, per-step validation,
 * student ID card upload & OCR preview, and final account creation.
 */
import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import * as verificationService from "../services/verificationService";
import {
  validateRegisterStep1,
  validateRegisterStep2,
  validateAuthField
} from "../utils/validation/authValidators";

export function useRegisterWizard(onSuccessRedirect = () => {}) {
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1); // 1: Info, 2: Student ID Card & OCR, 3: Review & Submit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    faculty: "",
    studentIdFile: null,
    ocrExtractedData: null
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isUploadingId, setIsUploadingId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Field change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError(null);

    // Dynamic error clearing
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const fieldError = validateAuthField(name, value, { ...formData, [name]: value });
      return { ...prev, [name]: fieldError };
    });
  }, [formData]);

  // On-blur validation handler
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const fieldError = validateAuthField(name, value, formData);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    },
    [formData]
  );

  // Handle student ID card file selection & trigger OCR
  const handleFileSelect = useCallback(async (file) => {
    setSubmitError(null);
    const { isValid, errors: fileErrors } = validateRegisterStep2(file);

    if (!isValid) {
      setErrors((prev) => ({ ...prev, studentIdFile: fileErrors.studentIdFile }));
      return;
    }

    setFormData((prev) => ({ ...prev, studentIdFile: file }));
    setErrors((prev) => ({ ...prev, studentIdFile: null }));
    setIsUploadingId(true);

    try {
      const ocrResult = await verificationService.uploadStudentId(file);
      if (ocrResult?.data) {
        setFormData((prev) => ({
          ...prev,
          ocrExtractedData: ocrResult.data,
          // Pre-fill extracted fields if empty
          university: prev.university || ocrResult.data.extractedUniversity,
          faculty: prev.faculty || ocrResult.data.extractedFaculty
        }));
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        studentIdFile: err.message || "تعذر قراءة بيانات الكارنيه، يمكنك إدخال البيانات يدوياً."
      }));
    } finally {
      setIsUploadingId(false);
    }
  }, []);

  // Move to Next Step with validation gate
  const goToNextStep = useCallback(() => {
    if (currentStep === 1) {
      const { isValid, errors: step1Errors } = validateRegisterStep1(formData);
      if (!isValid) {
        setErrors(step1Errors);
        setTouched({
          name: true,
          email: true,
          password: true,
          confirmPassword: true,
          university: true,
          faculty: true
        });
        return;
      }
      setErrors({});
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const { isValid, errors: step2Errors } = validateRegisterStep2(formData.studentIdFile);
      if (!isValid) {
        setErrors(step2Errors);
        return;
      }
      setErrors({});
      setCurrentStep(3);
    }
  }, [currentStep, formData]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  // Final Registration Submit
  const handleFinalSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        university: formData.university,
        faculty: formData.faculty,
        studentIdNumber: formData.ocrExtractedData?.studentIdNumber || null
      };

      const result = await register(payload);
      if (onSuccessRedirect) {
        onSuccessRedirect(result);
      }
    } catch (err) {
      setSubmitError(err?.message || "حدث خطأ أثناء إتمام التسجيل، يرجى المحاولة لاحقاً.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, register, onSuccessRedirect]);

  return {
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
  };
}

export default useRegisterWizard;
