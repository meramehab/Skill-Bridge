/**
 * @file apiClient.js
 * @description Centralized HTTP client configured with JWT bearer authorization,
 * request/response interceptors, and automatic 401 unauthorization handling.
 */

// In-memory token storage (Not localStorage to prevent XSS exfiltration; works in tandem with httpOnly refresh cookies)
let memoryAccessToken = null;
let onUnauthorizedCallback = null;

export const tokenStorage = {
  getToken: () => memoryAccessToken,
  setToken: (token) => {
    memoryAccessToken = token;
  },
  clearToken: () => {
    memoryAccessToken = null;
  },
  setOnUnauthorized: (callback) => {
    onUnauthorizedCallback = callback;
  }
};

const BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
  "https://api.skillbridge.edu.eg/v1";

/**
 * Enhanced custom HTTP client with interceptors
 */
export const apiClient = {
  /**
   * Primary request dispatcher
   * @param {string} endpoint - Relative path (e.g., '/projects')
   * @param {Object} options - Fetch options
   */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers
    };

    // Inject Bearer token if present
    const token = tokenStorage.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        tokenStorage.clearToken();
        if (typeof onUnauthorizedCallback === "function") {
          onUnauthorizedCallback();
        } else if (typeof window !== "undefined") {
          // Fallback redirect
          window.location.href = "/login?sessionExpired=true";
        }
        throw new Error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.");
      }

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg =
          responseData?.message ||
          responseData?.error ||
          `حدث خطأ أثناء معالجة الطلب (${response.status})`;
        const error = new Error(errorMsg);
        error.status = response.status;
        error.data = responseData;
        throw error;
      }

      return { data: responseData, status: response.status };
    } catch (err) {
      if (err.name === "TypeError" && err.message === "Failed to fetch") {
        throw new Error("تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت.");
      }
      throw err;
    }
  },

  get(endpoint, { params, headers } = {}) {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          searchParams.append(key, val);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }
    return this.request(url, { method: "GET", headers });
  },

  post(endpoint, body, { headers } = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: body instanceof FormData ? { ...headers } : headers
    });
  },

  put(endpoint, body, { headers } = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: body instanceof FormData ? { ...headers } : headers
    });
  },

  patch(endpoint, body, { headers } = {}) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers
    });
  },

  delete(endpoint, { headers } = {}) {
    return this.request(endpoint, { method: "DELETE", headers });
  }
};

export default apiClient;
