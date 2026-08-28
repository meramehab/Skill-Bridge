/**
 * @file profileValidators.js
 * @description Form validators for student profile editing.
 */

/**
 * Validate single profile field
 * @param {string} field
 * @param {any} value
 * @returns {string|null}
 */
export function validateProfileField(field, value) {
  switch (field) {
    case "name":
      if (!value || !value.toString().trim()) {
        return "الاسم مطلوب.";
      }
      if (value.trim().length < 3) {
        return "الاسم يجب ألا يقل عن 3 أحرف.";
      }
      return null;

    case "bio":
      if (value && value.length > 300) {
        return "النبذة التعريفية يجب ألا تتجاوز 300 حرف.";
      }
      return null;

    case "faculty":
      if (!value || !value.toString().trim()) {
        return "الكلية والتخصص مطلوبان.";
      }
      return null;

    default:
      return null;
  }
}

/**
 * Validate full profile edit form
 * @param {Object} values
 */
export function validateProfileForm(values = {}) {
  const errors = {};

  const nameErr = validateProfileField("name", values.name);
  if (nameErr) errors.name = nameErr;

  const bioErr = validateProfileField("bio", values.bio);
  if (bioErr) errors.bio = bioErr;

  const facErr = validateProfileField("faculty", values.faculty);
  if (facErr) errors.faculty = facErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
