import { ReceiptEuroIcon } from 'lucide-react';
import OrderStatus from './order-status';
import { IOrder } from '@/lib/types/payment';

function OrderDisplay({ order }: { order: IOrder }) {
  const packageName =
    typeof order.package === 'object' && order.package?.name
      ? order.package.name
      : 'Credit Package';

  const formattedDate = new Date(order.createdAt).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
      {/* Order info */}
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          <ReceiptEuroIcon />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold">{packageName}</h3>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>{formattedDate}</span>
            <span className="hidden sm:inline">•</span>
            <span className="capitalize">{order.platform}</span>
            {order.transactionId && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="truncate">ID: {order.transactionId}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Amount + status */}
      <div className="flex shrink-0 items-center justify-between gap-6 sm:justify-end">
        <div className="text-right">
          <p className="font-semibold">${order.amount.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            {order.credits} credits
          </p>
        </div>

        <OrderStatus status={order.status} />
      </div>
    </div>
  );
}

export default OrderDisplay;
