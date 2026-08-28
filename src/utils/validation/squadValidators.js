/**
 * @file squadValidators.js
 * @description Validation rules for squad creation and joining.
 */

/**
 * Validate single squad field (on-blur support)
 * @param {string} field
 * @param {any} value
 * @returns {string|null}
 */
export function validateSquadField(field, value) {
  switch (field) {
    case "name":
      if (!value || !value.toString().trim()) {
        return "اسم الفريق مطلوب.";
      }
      if (value.trim().length < 3) {
        return "اسم الفريق يجب أن يتكون من 3 أحرف على الأقل.";
      }
      return null;

    case "description":
      if (!value || !value.toString().trim()) {
        return "وصف الفريق والهدف منه مطلوب.";
      }
      if (value.trim().length < 15) {
        return "يرجى كتابة وصف تفصيلي لا يقل عن 15 حرفاً.";
      }
      return null;

    case "maxMembers":
      const max = Number(value);
      if (isNaN(max) || max < 2 || max > 10) {
        return "الحد الأقصى للأعضاء يجب أن يتراوح بين 2 إلى 10 طلاب.";
      }
      return null;

    default:
      return null;
  }
}

/**
 * Validate full squad creation form
 * @param {Object} values
 */
export function validateSquadForm(values = {}) {
  const errors = {};

  const nameErr = validateSquadField("name", values.name);
  if (nameErr) errors.name = nameErr;

  const descErr = validateSquadField("description", values.description);
  if (descErr) errors.description = descErr;

  const maxErr = validateSquadField("maxMembers", values.maxMembers);
  if (maxErr) errors.maxMembers = maxErr;

  if (!values.neededSkills || !Array.isArray(values.neededSkills) || values.neededSkills.length === 0) {
    errors.neededSkills = "يرجى تحديد مهارة واحدة على الأقل يحتاجها الفريق.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
