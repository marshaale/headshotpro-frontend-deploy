import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { UserContextProvider } from '@/lib/context/user-context';
import { getCurrentUserServer } from '@/lib/util/server-auth';
import { redirect } from 'next/navigation';

export default async function RootDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUserServer();

  if (!user) {
    return redirect('/auth/login', 'replace');
  }

  return (
    <UserContextProvider user={user}>
      <DashboardLayout>{children}</DashboardLayout>
    </UserContextProvider>
  );
}
