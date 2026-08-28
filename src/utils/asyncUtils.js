/**
 * @file asyncUtils.js
 * @description Helper functions for asynchronous operations, responses evaluation, and debouncing.
 */

/**
 * Checks whether a successful response payload is semantically empty.
 * @param {any} data
 * @returns {boolean}
 */
export function isEmptyResponse(data) {
  if (data === null || data === undefined) return true;
  if (typeof data === "string") return data.trim().length === 0;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === "object") {
    // If it's a paginated wrapper like { items: [], total: 0 }
    if (Array.isArray(data.items) && data.items.length === 0) return true;
    if (Array.isArray(data.data) && data.data.length === 0) return true;
    return Object.keys(data).length === 0;
  }
  return false;
}

/**
 * Simulates real-world network latency for mock calls.
 * @param {number} [ms=500] - Base delay in milliseconds
 * @param {number} [variance=200] - Random jitter
 * @returns {Promise<void>}
 */
export function simulateNetworkDelay(ms = 500, variance = 200) {
  const jitter = Math.floor(Math.random() * variance);
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
}

/**
 * Standard debounce implementation for inputs and filters.
 * @param {Function} func - Callback function
 * @param {number} wait - Wait duration in ms
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Clamps a number between min and max bounds.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min = 0, max = 100) {
  return Math.min(Math.max(Number(val) || 0, min), max);
}
