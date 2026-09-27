import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import { User } from '../types/auth';
import { PaymentStatus } from '../types/payment';

export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  userList: (limit: number = 10, page: number = 1) =>
    [...adminKeys.users(), { limit, page }] as const,
  orders: () => [...adminKeys.all, 'orders'] as const,
  orderList: (limit: number = 10, page: number = 1, status?: PaymentStatus) =>
    [...adminKeys.orders(), { limit, page, status }] as const,
};

export function useGetAdminUsers(limit: number = 10, page: number = 1) {
  return useQuery({
    queryKey: adminKeys.userList(limit, page),
    queryFn: () => adminService.getUsers(limit, page),
  });
}

export function useGetAdminOrders(
  limit: number = 10,
  page: number = 1,
  status?: PaymentStatus,
) {
  return useQuery({
    queryKey: adminKeys.orderList(limit, page, status),
    queryFn: () => adminService.getOrders(limit, page, status),
  });
}

function useInvalidateAdminOrders() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: adminKeys.orders() });
}

export function useUpdateOrderStatus() {
  const invalidateOrders = useInvalidateAdminOrders();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentStatus }) =>
      adminService.updateOrderStatus({ status }, id),
    onSuccess: invalidateOrders,
  });
}

export function useCreateManualOrder() {
  const invalidateOrders = useInvalidateAdminOrders();
  const invalidateUsers = useInvalidateAdminUsers();

  return useMutation({
    mutationFn: (payload: { userId: string; packageId: string }) =>
      adminService.createManualOrder(payload),
    onSuccess: () => {
      invalidateOrders();
      invalidateUsers();
    },
  });
}

function useInvalidateAdminUsers() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: adminKeys.users() });
}

export function useUpdateUser() {
  const invalidateUsers = useInvalidateAdminUsers();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<User, 'id' | 'email' | 'emailVerified'>>;
    }) => adminService.updateUser(payload, id),
    onSuccess: invalidateUsers,
  });
}

export function useIncrementCredits() {
  const invalidateUsers = useInvalidateAdminUsers();

  return useMutation({
    mutationFn: ({ id, credits }: { id: string; credits: number }) =>
      adminService.incrementCredits({ credits }, id),
    onSuccess: invalidateUsers,
  });
}

export function useChangeRole() {
  const invalidateUsers = useInvalidateAdminUsers();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: User['role'] }) =>
      adminService.changeRole({ role }, id),
    onSuccess: invalidateUsers,
  });
}
