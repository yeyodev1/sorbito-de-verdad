import httpBase from './httpBase';
import type { User, ApiResponse } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthData {
  user: User;
  token: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthData>> {
    const { data } = await httpBase.post('/auth/login', payload);
    if (data.data?.token) {
      localStorage.setItem('access_token', data.data.token);
      localStorage.setItem('user_id', data.data.user._id);
    }
    return data;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthData>> {
    const { data } = await httpBase.post('/auth/register', payload);
    if (data.data?.token) {
      localStorage.setItem('access_token', data.data.token);
      localStorage.setItem('user_id', data.data.user._id);
    }
    return data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const { data } = await httpBase.get('/auth/me');
    return data;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const { data } = await httpBase.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<AuthData>> {
    const { data } = await httpBase.post('/auth/reset-password', { token, password });
    if (data.data?.token) {
      localStorage.setItem('access_token', data.data.token);
      localStorage.setItem('user_id', data.data.user._id);
    }
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const { data } = await httpBase.post('/auth/change-password', { currentPassword, newPassword });
    return data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
  },
};
