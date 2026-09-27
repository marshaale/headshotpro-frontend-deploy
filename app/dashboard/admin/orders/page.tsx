'use client';

import { useState } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { LoadingFallback } from '@/components/loading';
import { UpdateOrderStatusDialog } from '@/components/admin/orders/update-order-status';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetAdminOrders } from '@/lib/hooks';
import { IOrder, PaymentStatus } from '@/lib/types/payment';

const PAGE_SIZE = 10;

function getUserLabel(user: IOrder['user']) {
  if (!user) return 'Unknown user';
  if (typeof user === 'string') return user;
  return user.email || user.username || user._id || 'Unknown user';
}

function getPackageName(order: IOrder) {
  return typeof order.package === 'object' && order.package?.name
    ? order.package.name
    : 'Credit Package';
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const { data, isLoading, isFetching } = useGetAdminOrders(
    PAGE_SIZE,
    page,
    statusFilter,
  );
  const orders = data?.orders;
  const pagination = data?.pagination;

  function handleStatusFilter(value: string | null) {
    setStatusFilter(
      value === 'ALL' || !value ? undefined : (value as PaymentStatus),
    );
    setPage(1);
  }

  if (isLoading || isFetching) {
    return <LoadingFallback title="..." message="Fetching orders....." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Review payments and update their status.
          </p>
        </div>
        <Select
          value={statusFilter ?? 'ALL'}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger
            className="w-full sm:w-44"
            aria-label="Filter orders by status"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {Object.values(PaymentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <h2 className="font-medium text-foreground">No orders found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            There are no orders matching this filter.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Order</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div className="max-w-40 truncate font-medium text-foreground">
                        {getPackageName(order)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-44 truncate">
                        {getUserLabel(order.user)}
                      </div>
                      {order.transactionId && (
                        <div className="max-w-44 truncate text-xs text-muted-foreground">
                          {order.transactionId}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">
                      {order.platform}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${order.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.credits} credits
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize text-foreground">
                        {order.status.toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontalIcon />
                              <span className="sr-only">
                                Open actions for order {order._id}
                              </span>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedOrder(order)}
                          >
                            Update status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages} ·{' '}
                {pagination.total} orders
              </p>
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?page=${page - 1}`}
                      aria-disabled={page <= 1}
                      className={
                        page <= 1 ? 'pointer-events-none opacity-50' : undefined
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        if (page > 1) setPage((currentPage) => currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, index) => index + 1,
                  )
                    .slice(0, 3)
                    .map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href={`?page=${pageNumber}`}
                          isActive={pageNumber === page}
                          onClick={(event) => {
                            event.preventDefault();
                            setPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  {pagination.totalPages > 4 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {pagination.totalPages > 3 && (
                    <PaginationItem>
                      <PaginationLink
                        href={`?page=${pagination.totalPages}`}
                        isActive={pagination.totalPages === page}
                        onClick={(event) => {
                          event.preventDefault();
                          setPage(pagination.totalPages);
                        }}
                      >
                        {pagination.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href={`?page=${page + 1}`}
                      aria-disabled={page >= pagination.totalPages}
                      className={
                        page >= pagination.totalPages
                          ? 'pointer-events-none opacity-50'
                          : undefined
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        if (page < pagination.totalPages) {
                          setPage((currentPage) => currentPage + 1);
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <UpdateOrderStatusDialog
        order={selectedOrder}
        open={selectedOrder !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
      />
    </div>
  );
}
