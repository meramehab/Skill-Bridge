import { api } from './api'

export const paymentService = {
  async createPayment(projectId, amount) {
    const response = await api.post('/payment/create', { projectId, amount })
    return response.data
  },

  async confirmPayment(paymentId) {
    const response = await api.post(`/payment/confirm/${paymentId}`)
    return response.data
  },

  async getPaymentStatus(paymentId) {
    const response = await api.get(`/payment/status/${paymentId}`)
    return response.data
  },

  async releasePayment(projectId) {
    const response = await api.post(`/payment/release/${projectId}`)
    return response.data
  },

  async getTransactionHistory() {
    const response = await api.get('/payment/history')
    return response.data
  },
}