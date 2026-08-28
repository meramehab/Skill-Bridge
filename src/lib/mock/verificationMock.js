/**
 * @file verificationMock.js
 * @description Mock student ID card OCR extraction and university verification.
 */
import { simulateNetworkDelay } from "../../utils/asyncUtils";

/**
 * Simulates uploading student ID image and running AI OCR
 * @param {File|Blob} file
 */
export async function mockUploadStudentId(file) {
  await simulateNetworkDelay(1200); // OCR processing time

  // Validate format and size in mock
  if (file && file.size > 5 * 1024 * 1024) {
    throw new Error("حجم الملف يتجاوز الحد الأقصى المسموح به (5 ميجابايت).");
  }

  return {
    success: true,
    data: {
      extractedName: "أحمد محمود علي إبراهيم",
      extractedUniversity: "جامعة القاهرة",
      extractedFaculty: "كلية الهندسة",
      studentIdNumber: "202209142",
      academicYear: "الفرقة الثالثة",
      confidenceScore: 0.94,
      previewUrl: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=500"
    }
  };
}

export async function mockConfirmVerification(verificationData) {
  await simulateNetworkDelay(500);
  return {
    success: true,
    message: "تم حفظ بيانات التوثيق الجامعي بنجاح وجارٍ مراجعتها."
  };
}
