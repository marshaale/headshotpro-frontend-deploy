import { api } from '@/lib/api';
import type { User } from '@/lib/types/auth';
import {
  LoginInputValues,
  RegisterInputValues,
  ResendInputValues,
} from '../validations';

export const authService = {
  register: async (data: RegisterInputValues): Promise<{ user: User }> => {
    return api.post<{ user: User }>('/auth/register', data);
  },
  verifyEmail: async (token: string): Promise<void> => {
    return api.get(`/auth/verify-email?token=${token}`);
  },
  login: async (data: LoginInputValues): Promise<{ user: User }> => {
    return api.post<{ user: User }>('/auth/login', data);
  },
  resendVerification: async (data: ResendInputValues): Promise<void> => {
    return api.post('/auth/resend-verification', data);
  },
  getCurrentUser: async (): Promise<{ user: User }> => {
    return api.get('/auth/me');
  },
  logout: async (): Promise<void> => {
    return api.post('/auth/logout');
  },
};
