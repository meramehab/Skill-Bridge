/**
 * @file authService.js
 * @status REAL (Real backend endpoint ready from Day 1 - fallback flag supported)
 * @description Authentication services: Login, Register, Logout, Current User Profile.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient, tokenStorage } from "../lib/apiClient";
import { mockLogin, mockRegister, mockGetCurrentUser } from "../lib/mock/authMock";

/**
 * Log in student with email and password
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {boolean} [params.rememberMe=false]
 */
export async function login({ email, password, rememberMe = false }) {
  if (USE_MOCK.auth) {
    const res = await mockLogin({ email, password, rememberMe });
    tokenStorage.setToken(res.token);
    return res;
  }

  const { data } = await apiClient.post("/auth/login", {
    email,
    password,
    rememberMe
  });

  if (data?.token) {
    tokenStorage.setToken(data.token);
  }
  return data;
}

/**
 * Register student with university credentials
 * @param {Object} formData
 */
export async function register(formData) {
  if (USE_MOCK.auth) {
    const res = await mockRegister(formData);
    tokenStorage.setToken(res.token);
    return res;
  }

  const { data } = await apiClient.post("/auth/register", formData);
  if (data?.token) {
    tokenStorage.setToken(data.token);
  }
  return data;
}

/**
 * Fetch authenticated user profile
 */
export async function getCurrentUser() {
  if (USE_MOCK.auth) {
    return mockGetCurrentUser();
  }

  const { data } = await apiClient.get("/auth/me");
  return data;
}

/**
 * Logout current session
 */
export async function logout() {
  try {
    if (!USE_MOCK.auth) {
      await apiClient.post("/auth/logout", {});
    }
  } finally {
    tokenStorage.clearToken();
  }
  return { success: true };
}
