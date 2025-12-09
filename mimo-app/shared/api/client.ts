// shared/api/client.ts - Enhanced API client with interceptors
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Token storage keys
const TOKEN_KEY = 'ora_auth_token';
const REFRESH_TOKEN_KEY = 'ora_refresh_token';

// Create axios instance
export const api: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data;
          await setTokens(token, newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - Clear tokens and redirect to login
        await clearTokens();
        // Note: Navigation should be handled by the app
      }
    }

    // Transform error for better handling
    const apiError = transformError(error);
    return Promise.reject(apiError);
  }
);

// Error transformation
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

const transformError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Server responded with error
    const data = error.response.data as Record<string, unknown>;
    return {
      status: error.response.status,
      message: (data?.message as string) || getDefaultErrorMessage(error.response.status),
      code: data?.code as string,
      details: data?.details as Record<string, unknown>,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.',
      code: 'NETWORK_ERROR',
    };
  } else {
    // Request setup error
    return {
      status: 0,
      message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      code: 'REQUEST_ERROR',
    };
  }
};

const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Geçersiz istek. Lütfen bilgilerinizi kontrol edin.';
    case 401:
      return 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.';
    case 403:
      return 'Bu işlem için yetkiniz bulunmuyor.';
    case 404:
      return 'Aradığınız içerik bulunamadı.';
    case 422:
      return 'Girdiğiniz bilgiler geçersiz.';
    case 429:
      return 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.';
    case 500:
      return 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
    case 503:
      return 'Servis geçici olarak kullanılamıyor.';
    default:
      return 'Bir hata oluştu. Lütfen tekrar deneyin.';
  }
};

// Token management
export const setTokens = async (token: string, refreshToken?: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const clearTokens = async (): Promise<void> => {
  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
};

// API helper functions
export const apiGet = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  const response = await api.get<T>(url, { params });
  return response.data;
};

export const apiPost = async <T>(url: string, data?: Record<string, unknown>): Promise<T> => {
  const response = await api.post<T>(url, data);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: Record<string, unknown>): Promise<T> => {
  const response = await api.put<T>(url, data);
  return response.data;
};

export const apiPatch = async <T>(url: string, data?: Record<string, unknown>): Promise<T> => {
  const response = await api.patch<T>(url, data);
  return response.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url);
  return response.data;
};

// Upload helper with progress
export const apiUpload = async <T>(
  url: string,
  file: FormData,
  onProgress?: (progress: number) => void
): Promise<T> => {
  const response = await api.post<T>(url, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
  return response.data;
};

export default api;
