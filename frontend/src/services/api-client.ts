import { API_BASE_URL } from '@/constants/API_ENDPOINTS';

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Custom application API error with status code and error details.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Standard HTTP client wrapper providing unified error handling and timeout.
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 8000, headers, ...restOptions } = options;
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        // Fallback if not JSON
      }
      throw new ApiError(
        response.status,
        errorData?.message || `HTTP error ${response.status}`,
        errorData,
      );
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout connecting to backend API');
    }
    throw error;
  }
}
