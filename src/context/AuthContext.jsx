/**
 * @file AuthContext.jsx
 * @description Global Authentication & User Context providing session state,
 * credentials management, token storage, and the freelancing unlock gate check.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import * as authService from "../services/authService";
import { tokenStorage } from "../lib/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-logout hook from apiClient interceptor
  const handleUnauthorized = useCallback(() => {
    setUser(null);
    tokenStorage.clearToken();
  }, []);

  useEffect(() => {
    tokenStorage.setOnUnauthorized(handleUnauthorized);

    // Initial check for existing session on page load
    async function initAuth() {
      try {
        const response = await authService.getCurrentUser();
        if (response?.user) {
          setUser(response.user);
        }
      } catch (err) {
        // Not logged in or guest
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, [handleUnauthorized]);

  const login = useCallback(async ({ email, password, rememberMe = false }) => {
    setError(null);
    try {
      const result = await authService.login({ email, password, rememberMe });
      if (result?.user) {
        setUser(result.user);
      }
      return result;
    } catch (err) {
      setError(err?.message || "فشل تسجيل الدخول");
      throw err;
    }
  }, []);

  const register = useCallback(async (formData) => {
    setError(null);
    try {
      const result = await authService.register(formData);
      if (result?.user) {
        setUser(result.user);
      }
      return result;
    } catch (err) {
      setError(err?.message || "فشل إنشاء الحساب");
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      tokenStorage.clearToken();
    }
  }, []);

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getCurrentUser();
      if (res?.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.warn("Error refreshing user:", err);
    }
  }, []);

  // Freelancing unlock gate calculation: careerReadinessScore >= 70 OR isFreelancingUnlocked flag
  const isFreelancingUnlocked = useMemo(() => {
    if (!user) return false;
    return Boolean(user.isFreelancingUnlocked || (user.careerReadinessScore && user.careerReadinessScore >= 70));
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      isFreelancingUnlocked,
      login,
      register,
      logout,
      updateUser,
      refreshUser
    }),
    [user, isLoading, error, isFreelancingUnlocked, login, register, logout, updateUser, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to consume AuthContext safely
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
