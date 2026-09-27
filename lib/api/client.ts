import axios from 'axios';
import type { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';

const devUrl =
  process.env.NEXT_PUBLIC_DEV_BASE_URL || 'http://localhost:8000/api/v1';
const prodUrl = process.env.NEXT_PUBLIC_PROD_BASE_URL;

export const baseUrl =
  process.env.NODE_ENV === 'development' ? devUrl : prodUrl;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
  }
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const REFRESH_FAILED_KEY = 'REFRESH_FAILED_KEY';

function hasRefreshFailed() {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(REFRESH_FAILED_KEY) === 'true';
}

function setRefreshFailed() {
  if (typeof window === 'undefined') return;
  return sessionStorage.setItem(REFRESH_FAILED_KEY, 'true');
}

function resetAuthState() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(REFRESH_FAILED_KEY);
}

if (typeof window !== 'undefined') {
  resetAuthState();
}

axiosInstance.interceptors.response.use(
  // success response
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },

  // error response
  async (error: AxiosError<ApiResponse>) => {
    // throw directly non 401 errors
    if (error.response?.status !== 401) {
      throw error;
    }

    const originalRequest = error.config as any;
    const isRefreshEndpoint = originalRequest?.url?.includes(
      '/auth/refresh-token',
    );

    const isLoginEndpoint = originalRequest?.url?.includes('/auth/login');
    const isRegisterEndpoint = originalRequest?.url?.includes('/auth/register');

    console.log({
      isRefreshEndpoint,
      failed: hasRefreshFailed(),
      retry: originalRequest._retry,
      originalRequest,
    });

    if (isLoginEndpoint || isRegisterEndpoint) {
      return Promise.reject(error);
    }

    // check the endpoint or if already falied or is in retry
    if (isRefreshEndpoint || hasRefreshFailed() || originalRequest._retry) {
      return Promise.reject(new ApiError('Session expired. Login again', 401));
    }

    originalRequest._retry = true;

    try {
      // send refresh token request
      await axiosInstance.post('/auth/refresh-token');
      return axiosInstance(originalRequest);
    } catch (error) {
      console.log('Refreshing failed');
      setRefreshFailed();
      return Promise.reject(error);
    }
  },
);

export const api = {
  get: <T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance
      .get<ApiResponse<T>>(endpoint, config)
      .then((res) => res.data.data as T),

  post: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance
      .post<ApiResponse<T>>(endpoint, body, config)
      .then((res) => res.data.data as T),
  put: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance
      .put<ApiResponse<T>>(endpoint, body, config)
      .then((res) => res.data.data as T),
  patch: <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance
      .patch<ApiResponse<T>>(endpoint, body, config)
      .then((res) => res.data.data as T),
  delete: <T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    axiosInstance
      .delete<ApiResponse<T>>(endpoint, config)
      .then((res) => res.data.data as T),
};
