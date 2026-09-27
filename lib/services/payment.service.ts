import { api } from '@/lib/api';
import {
  ICreditPackage,
  IProcessPayment,
  IPaymentResponse,
  IOrder,
} from '@/lib/types/payment';

export const paymentService = {
  getCreditPackages: (): Promise<ICreditPackage[]> => {
    return api.get<ICreditPackage[]>('/payment/packages');
  },
  processPayment: (
    checkoutData: IProcessPayment,
  ): Promise<IPaymentResponse> => {
    return api.post<IPaymentResponse>('/payment/process', checkoutData);
  },
  getPaymentOrders: (): Promise<IOrder[]> => {
    return api.get<IOrder[]>('/payment/orders');
  },
  getOrderById: (id: string): Promise<IOrder> => {
    return api.get<IOrder>(`/payment/orders/${id}`);
  },
};
