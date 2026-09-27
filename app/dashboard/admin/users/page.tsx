'use client';

import { MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

import { CreateOrderDialog } from '@/components/admin/users/create-order';
import { EditUserDialog } from '@/components/admin/users/edit-user';
import { LoadingFallback } from '@/components/loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetAdminUsers } from '@/lib/hooks';
import { User } from '@/lib/types/auth';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [orderUser, setOrderUser] = useState<User | null>(null);
  const { data, isLoading, isFetching } = useGetAdminUsers(10, page);

  const users = data?.users;
  const pagination = data?.pagination;

  if (isLoading || isFetching) {
    return <LoadingFallback title="..." message="Fetching users....." />;
  }

  if (!users || users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
        <h1 className="font-medium text-foreground">No users found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no accounts to manage yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="font-medium text-foreground">
                    {user.username || 'Unnamed user'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  <Badge variant={'secondary'}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      user.isActive ? 'text-primary' : 'text-muted-foreground'
                    }
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </div>
                </TableCell>
                <TableCell>{user.credits}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">
                            Open actions for {user.email}
                          </span>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                        Edit user
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setOrderUser(user)}>
                        Create order
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
            {pagination.total} users
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
      <EditUserDialog
        user={selectedUser}
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
      />
      <CreateOrderDialog
        user={orderUser}
        open={orderUser !== null}
        onOpenChange={(open) => {
          if (!open) setOrderUser(null);
        }}
      />
    </div>
  );
}
