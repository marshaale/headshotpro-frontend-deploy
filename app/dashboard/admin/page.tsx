'use client';
import { useUser } from '@/lib/context/user-context';
import { useGetAdminUsers } from '@/lib/hooks';

export default function AdminDashboardPage() {
  const { data } = useGetAdminUsers();
  return <div>{data && <div>{JSON.stringify(data)}</div>}</div>;
}
