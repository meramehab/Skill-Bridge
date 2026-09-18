/**
 * @file useSubmitProposal.js
 * @description Hook managing proposal modal, AI auto-generation assistance,
 * form validation, low-match confirmation warning, and proposal submission.
 */
import { useState, useCallback } from "react";
import * as projectsService from "../services/projectsService";
import { validateProposalForm, validateProposalField } from "../utils/validation/projectValidators";

export function useSubmitProposal(projectId, onSuccess = () => {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLowMatchConfirmed, setIsLowMatchConfirmed] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    coverLetter: "",
    bidAmount: "",
    estimatedDays: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const openModal = useCallback(() => {
    setIsOpen(true);
    setSubmitError(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSubmitError(null);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError(null);

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const fieldError = validateProposalField(name, value);
      return { ...prev, [name]: fieldError };
    });
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateProposalField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  }, []);

  // AI Assistant: Generate tailored proposal
  const generateAiProposal = useCallback(async () => {
    setIsGeneratingAi(true);
    setSubmitError(null);

    try {
      const result = await projectsService.generateAiProposal(projectId);
      if (result) {
        setFormData((prev) => ({
          ...prev,
          coverLetter: result.generatedCoverLetter || prev.coverLetter,
          bidAmount: result.suggestedBid || prev.bidAmount,
          estimatedDays: result.suggestedDays || prev.estimatedDays
        }));
        setErrors({});
      }
    } catch (err) {
      setSubmitError("تعذر توليد العرض بواسطة الذكاء الاصطناعي، يرجى المحاولة يدوياً.");
    } finally {
      setIsGeneratingAi(false);
    }
  }, [projectId]);

  // Submit Proposal
  const handleSubmit = useCallback(
    async (isLowMatch = false) => {
      setTouched({ coverLetter: true, bidAmount: true, estimatedDays: true });

      const { isValid, errors: validationErrors } = validateProposalForm(formData);
      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      // If low match and user hasn't explicitly confirmed through warning modal
      if (isLowMatch && !isLowMatchConfirmed) {
        return { requiresConfirmation: true };
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const payload = {
          projectId,
          coverLetter: formData.coverLetter,
          bidAmount: Number(formData.bidAmount),
          estimatedDays: Number(formData.estimatedDays)
        };

        const result = await projectsService.submitProposal(payload);
        closeModal();
        if (onSuccess) onSuccess(result);
        return { success: true, result };
      } catch (err) {
        setSubmitError(err?.message || "حدث خطأ أثناء إرسال العرض.");
        return { success: false, error: err };
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isLowMatchConfirmed, projectId, closeModal, onSuccess]
  );

  return {
    isOpen,
    formData,
    errors,
    touched,
    isGeneratingAi,
    isSubmitting,
    submitError,
    isLowMatchConfirmed,
    setIsLowMatchConfirmed,
    openModal,
    closeModal,
    handleChange,
    handleBlur,
    generateAiProposal,
    handleSubmit
  };
}

export default useSubmitProposal;
