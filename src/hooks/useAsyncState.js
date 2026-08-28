/**
 * @file useAsyncState.js
 * @description Universal state-machine custom hook for managing asynchronous operations,
 * explicitly resolving 'idle' | 'loading' | 'success' | 'error' | 'empty' statuses.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { isEmptyResponse } from "../utils/asyncUtils";

/**
 * @template T
 * @param {() => Promise<T>} asyncFetcherFn - The asynchronous function returning a Promise
 * @param {Array<any>} [deps=[]] - Dependency list to trigger refetch
 * @param {Object} [options={}] - Optional configurations
 * @param {boolean} [options.immediate=true] - Execute fetch on mount / deps change
 * @param {T|null} [options.initialData=null] - Initial data value
 * @param {(data: T) => boolean} [options.customIsEmpty] - Optional custom predicate for empty state
 */
export function useAsyncState(asyncFetcherFn, deps = [], options = {}) {
  const { immediate = true, initialData = null, customIsEmpty } = options;

  const [status, setStatus] = useState(immediate ? "loading" : "idle");
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);

  // Keep reference to latest fetcher function
  const fetcherRef = useRef(asyncFetcherFn);
  fetcherRef.current = asyncFetcherFn;

  // Track active execution to prevent race conditions & state updates after unmount
  const executionCountRef = useRef(0);

  const execute = useCallback(
    async (...args) => {
      const currentExecution = ++executionCountRef.current;
      setStatus("loading");
      setError(null);

      try {
        const result = await fetcherRef.current(...args);

        // Check if a newer request was dispatched
        if (currentExecution !== executionCountRef.current) {
          return;
        }

        const isResultEmpty = customIsEmpty ? customIsEmpty(result) : isEmptyResponse(result);

        setData(result);
        setStatus(isResultEmpty ? "empty" : "success");
        return result;
      } catch (err) {
        if (currentExecution !== executionCountRef.current) {
          return;
        }

        const errorMessage =
          err?.message ||
          (typeof err === "string" ? err : "حدث خطأ غير متوقع أثناء معالجة الطلب.");
        setError(errorMessage);
        setStatus("error");
        throw err;
      }
    },
    [customIsEmpty]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, immediate]);

  return {
    status,
    data,
    error,
    refetch: execute,
    setData,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    isEmpty: status === "empty"
  };
}

export default useAsyncState;
