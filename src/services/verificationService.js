/**
 * @file verificationService.js
 * @status MOCK (Mock OCR processing initially, switches to Real OCR microservice)
 * @description Student identity card upload, OCR extraction, and university verification.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import { mockUploadStudentId, mockConfirmVerification } from "../lib/mock/verificationMock";

/**
 * Upload student ID card image and perform OCR parsing
 * @param {File|Blob} file
 */
export async function uploadStudentId(file) {
  if (USE_MOCK.verification) {
    return mockUploadStudentId(file);
  }

  const formData = new FormData();
  formData.append("studentCardImage", file);

  const { data } = await apiClient.post("/verification/upload-id", formData);
  return data;
}

/**
 * Confirm or edit OCR-extracted university data
 * @param {Object} verificationData
 */
export async function confirmStudentVerification(verificationData) {
  if (USE_MOCK.verification) {
    return mockConfirmVerification(verificationData);
  }

  const { data } = await apiClient.post("/verification/confirm", verificationData);
  return data;
}
