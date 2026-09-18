/**
 * @file projectValidators.js
 * @description Validation rules for proposals and bid submissions.
 */

/**
 * Validate single proposal field (on-blur support)
 * @param {string} field
 * @param {any} value
 * @returns {string|null}
 */
export function validateProposalField(field, value) {
  switch (field) {
    case "coverLetter":
      if (!value || !value.toString().trim()) {
        return "نص العرض مطلوب.";
      }
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 10) {
        return "نص العرض قصير جداً. يرجى كتابة 10 كلمات على الأقل لتوضيح خطتك وخبرتك.";
      }
      return null;

    case "bidAmount":
      if (value === undefined || value === null || value === "") {
        return "الميزانية المقترحة مطلوبة.";
      }
      const numBid = Number(value);
      if (isNaN(numBid) || numBid <= 0) {
        return "يرجى إدخال مبلغ صحيح أكبر من الصفر.";
      }
      return null;

    case "estimatedDays":
      if (value === undefined || value === null || value === "") {
        return "مدة التنفيذ المتوقعة مطلوبة.";
      }
      const numDays = Number(value);
      if (isNaN(numDays) || numDays < 1) {
        return "مدة التنفيذ يجب أن تكون يوم واحد على الأقل.";
      }
      return null;

    default:
      return null;
  }
}

/**
 * Validate Full Proposal Submission Form
 * @param {Object} values
 */
export function validateProposalForm(values = {}) {
  const errors = {};

  const coverError = validateProposalField("coverLetter", values.coverLetter);
  if (coverError) errors.coverLetter = coverError;

  const bidError = validateProposalField("bidAmount", values.bidAmount);
  if (bidError) errors.bidAmount = bidError;

  const daysError = validateProposalField("estimatedDays", values.estimatedDays);
  if (daysError) errors.estimatedDays = daysError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
