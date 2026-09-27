import { IOrder } from '@/lib/types/payment';

function OrderStatus({ status }: { status: IOrder['status'] }) {
  const statusStyles: Record<string, string> = {
    paid: 'bg-green-500/10 text-green-600',
    completed: 'bg-green-500/10 text-green-600',
    pending: 'bg-yellow-500/10 text-yellow-600',
    failed: 'bg-red-500/10 text-red-600',
    cancelled: 'bg-gray-500/10 text-gray-600',
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        statusStyles[String(status).toLowerCase()] ??
        'bg-muted text-muted-foreground'
      }`}
    >
      {String(status)}
    </span>
  );
}

export default OrderStatus;
