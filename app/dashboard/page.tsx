import { getCurrentUserServer, getUserDashboardPath } from '@/lib/util';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUserServer();
  const redirectPath = getUserDashboardPath(user?.role as string);
  redirect(redirectPath, 'replace');
}
