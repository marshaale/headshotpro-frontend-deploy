'use client';

import { useGetHeadshots } from '@/lib/hooks/useHeadshot';

export default function UserDashboardPage() {
  const { data } = useGetHeadshots();
  return <div>{data && <div>{JSON.stringify(data, null, 2)}</div>}</div>;
}
