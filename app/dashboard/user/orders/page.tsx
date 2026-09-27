'use client';

import { LoadingFallback } from '@/components/loading';
import {
  OrderEmptyState,
  OrderErrorState,
  OrdersList,
} from '@/components/payment';
import { useGetPaymentOrders } from '@/lib/hooks/usePayment';

function OrdersPage() {
  const { data: orders, isLoading, error } = useGetPaymentOrders();

  if (isLoading) {
    return (
      <LoadingFallback
        title="Loading Orders"
        className="min-h-[300px]"
        message="Please wait while we fetch your orders."
      />
    );
  }

  if (error) {
    return <OrderErrorState />;
  }

  if (!orders || orders.length === 0) {
    return <OrderEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Here you can view your past orders and their details.
        </p>
      </div>
      <OrdersList orders={orders} />
    </div>
  );
}

export default OrdersPage;
