import { useAuthStore } from '../store/auth';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

const useApi = () => {
  const { token } = useAuthStore();

  const request = async (url: string, options: FetchOptions = {}) => {
    const { timeout = 10000, ...fetchOptions } = options;

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...fetchOptions.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `API Error: ${res.status}`);
      }

      return res.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return {
    get: (url: string, options?: FetchOptions) =>
      request(url, { ...options, method: 'GET' }),
    post: (url: string, data: any, options?: FetchOptions) =>
      request(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      }),
    patch: (url: string, data: any, options?: FetchOptions) =>
      request(url, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (url: string, options?: FetchOptions) =>
      request(url, { ...options, method: 'DELETE' }),
  };
};

export default useApi;
