import { api } from '../api';
import { IPagination } from '../types';
import { User } from '../types/auth';
import { IOrder, PaymentStatus } from '../types/payment';

export interface AdminUsersResponse {
  pagination: IPagination;
  users: User[];
}

export interface AdminOrdersResponse {
  pagination: IPagination;
  orders: IOrder[];
}

export const adminService = {
  getUsers: async (limit: number = 10, page: number = 1) =>
    api.get<AdminUsersResponse>(`/admin/users?page=${page}&limit=${limit}`),
  getOrders: async (
    limit: number = 10,
    page: number = 1,
    status?: PaymentStatus,
  ) =>
    api.get<AdminOrdersResponse>(
      `/admin/orders?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
    ),
  updateOrderStatus: async (payload: { status: PaymentStatus }, id: string) =>
    api.patch<IOrder>(`/admin/orders/${id}`, payload),
  createManualOrder: async (payload: { userId: string; packageId: string }) =>
    api.post('/admin/orders/manual/create', payload),
  updateUser: async (
    payload: Partial<Omit<User, 'id' | 'email' | 'emailVerified'>>,
    id: string,
  ) => api.patch(`/admin/users/${id}`, payload),
  incrementCredits: async (
    payload: Partial<Pick<User, 'credits'>>,
    id: string,
  ) => api.patch(`/admin/users/${id}`, payload),
  changeRole: async (payload: Partial<Pick<User, 'role'>>, id: string) =>
    api.patch(`/admin/users/${id}`, payload),
};
