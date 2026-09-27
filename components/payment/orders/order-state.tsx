export function OrderErrorState() {
  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
      <h2 className="font-semibold text-destructive">Failed to load orders</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Something went wrong while fetching your orders.
      </p>
    </div>
  );
}

export function OrderEmptyState() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Here you can view your past orders and their details.
        </p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">You don't have any orders yet.</p>
      </div>
    </div>
  );
}
