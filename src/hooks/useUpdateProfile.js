/**
 * @file useUpdateProfile.js
 * @description Hook managing profile editing form, real-time validation, avatar upload, and portfolio management.
 */
import { useState, useCallback } from "react";
import * as profileService from "../services/profileService";
import { useAuth } from "../context/AuthContext";
import { validateProfileForm, validateProfileField } from "../utils/validation/profileValidators";

export function useUpdateProfile(initialProfile = {}, onSaveSuccess = () => {}) {
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: initialProfile.name || "",
    bio: initialProfile.bio || "",
    faculty: initialProfile.faculty || "",
    portfolio: initialProfile.portfolio || []
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveError(null);

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const fieldError = validateProfileField(name, value);
      return { ...prev, [name]: fieldError };
    });
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateProfileField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  }, []);

  // Save text info
  const handleSave = useCallback(async () => {
    setTouched({ name: true, bio: true, faculty: true });
    const { isValid, errors: validationErrors } = validateProfileForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await profileService.updateProfile(initialProfile.id, formData);
      updateUser(result?.user || formData);
      if (onSaveSuccess) onSaveSuccess(result);
      return result;
    } catch (err) {
      setSaveError(err?.message || "فشل حفظ التعديلات.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [formData, initialProfile.id, updateUser, onSaveSuccess]);

  // Upload avatar image
  const handleUploadAvatar = useCallback(
    async (file) => {
      if (!file) return;
      setIsUploadingAvatar(true);
      setSaveError(null);

      try {
        const res = await profileService.uploadAvatar(initialProfile.id, file);
        if (res?.avatarUrl) {
          updateUser({ avatar: res.avatarUrl });
        }
        return res;
      } catch (err) {
        setSaveError("تعذر رفع الصورة الشخصية.");
        throw err;
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [initialProfile.id, updateUser]
  );

  // Toggle portfolio project visibility
  const togglePortfolioVisibility = useCallback((projectId) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((item) =>
        item.id === projectId ? { ...item, isVisible: !item.isVisible } : item
      )
    }));
  }, []);

  return {
    formData,
    errors,
    touched,
    isSaving,
    isUploadingAvatar,
    saveError,
    handleChange,
    handleBlur,
    handleSave,
    handleUploadAvatar,
    togglePortfolioVisibility
  };
}

export default useUpdateProfile;
