/**
 * @file payment.service.js
 * @description Service for Escrow payment creation, confirmation, and release.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import { simulateNetworkDelay } from "../utils/asyncUtils";

export const paymentService = {
  async createPayment(projectId, amount) {
    if (USE_MOCK?.marketplace ?? true) {
      await simulateNetworkDelay(500);
      return { success: true, paymentId: `pay-${Date.now()}`, projectId, amount, status: "held_in_escrow" };
    }
    const { data } = await apiClient.post("/payment/create", { projectId, amount });
    return data;
  },

  async confirmPayment(paymentId) {
    if (USE_MOCK?.marketplace ?? true) {
      await simulateNetworkDelay(400);
      return { success: true, paymentId, status: "confirmed" };
    }
    const { data } = await apiClient.post(`/payment/confirm/${paymentId}`);
    return data;
  },

  async getPaymentStatus(paymentId) {
    if (USE_MOCK?.marketplace ?? true) {
      await simulateNetworkDelay(300);
      return { paymentId, status: "completed" };
    }
    const { data } = await apiClient.get(`/payment/status/${paymentId}`);
    return data;
  },

  async releasePayment(projectId) {
    if (USE_MOCK?.marketplace ?? true) {
      await simulateNetworkDelay(400);
      return { success: true, projectId, status: "released" };
    }
    const { data } = await apiClient.post(`/payment/release/${projectId}`);
    return data;
  },

  async getTransactionHistory() {
    if (USE_MOCK?.marketplace ?? true) {
      await simulateNetworkDelay(300);
      return [];
    }
    const { data } = await apiClient.get("/payment/history");
    return data;
  }
};

export default paymentService;