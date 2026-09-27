import { authService } from '@/lib/services';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  LoginInputValues,
  RegisterInputValues,
  ResendInputValues,
} from '../validations';

export const authKeys = {
  all: ['auth'],
  currentUser: () => [...authKeys.all, 'current-user'],
};

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterInputValues) => authService.register(data),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (data: ResendInputValues) =>
      authService.resendVerification(data),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginInputValues) => authService.login(data),
  });
}

export function useGetCurrentUser(options?: { onErrorRedirect: boolean }) {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
    retry: false,
    throwOnError: (error: any) => {
      if (options && options.onErrorRedirect && typeof window !== 'undefined') {
        window.location.replace('/auth/login');
      }
      return false;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
}
