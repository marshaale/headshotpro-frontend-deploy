import { IOrder } from '@/lib/types/payment';
import OrderDisplay from './order';

export function OrdersList({ orders }: { orders: IOrder[] }) {
  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <OrderDisplay key={order._id} order={order} />
      ))}
    </div>
  );
}
