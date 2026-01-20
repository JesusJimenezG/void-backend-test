import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "../types";

// Use strict undefined check: empty string "" is valid for relative paths in production
// This prevents falling back to localhost when VITE_API_URL is explicitly set to ""
const BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : "http://localhost:4000";

// In production with VITE_API_URL="", this becomes "/api" (relative path)
// In development, this becomes "http://localhost:4000/api"
const API_BASE_URL = `${BASE_URL}/api`;

interface UseFetchOptions {
  immediate?: boolean;
}

export function useFetch<T>(
  url: string | null,
  options: UseFetchOptions = { immediate: true },
): ApiResponse<T> & { refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options.immediate && url) {
      fetchData();
    }
  }, [fetchData, options.immediate, url]);

  return { data, error, loading, refetch: fetchData };
}

export default useFetch;
