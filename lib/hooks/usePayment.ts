import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentService } from '@/lib/services';
import { IPaymentResponse, IProcessPayment } from '../types/payment';
import { toast } from '@/components/ui/toast';

export function useGetCreditPackages() {
  return useQuery({
    queryKey: ['credit-packages'],
    queryFn: () => paymentService.getCreditPackages(),
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useProcessPayment() {
  return useMutation({
    mutationFn: (checkoutData: IProcessPayment) =>
      paymentService.processPayment(checkoutData),
    onSuccess: (data: IPaymentResponse) => {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.add({ title: data.message });
      }
    },
  });
}

export function useGetPaymentOrders() {
  return useQuery({
    queryKey: ['payment-orders'],
    queryFn: () => paymentService.getPaymentOrders(),
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useGetOrderById(id: string) {
  return useQuery({
    queryKey: ['payment-order', id],
    queryFn: () => paymentService.getOrderById(id),
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
