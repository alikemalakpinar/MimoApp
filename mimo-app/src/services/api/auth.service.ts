// mimo-app/src/services/api/auth.service.ts
import apiClient, { tokenManager, handleApiError } from './client';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'PATIENT' | 'THERAPIST';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'PATIENT' | 'THERAPIST' | 'ADMIN';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      const { accessToken, refreshToken } = response.data;
      
      // Save tokens
      await tokenManager.setTokens(accessToken, refreshToken);
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      const { accessToken, refreshToken } = response.data;
      
      // Save tokens
      await tokenManager.setTokens(accessToken, refreshToken);
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/auth/verify-email', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await tokenManager.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      return response.data.user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async refreshTokens(): Promise<AuthResponse> {
    try {
      const refreshToken = await tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<AuthResponse>('/auth/refresh', {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      await tokenManager.setTokens(accessToken, newRefreshToken);

      return response.data;
    } catch (error) {
      await tokenManager.clearTokens();
      throw new Error(handleApiError(error));
    }
  }
}

export default new AuthService();