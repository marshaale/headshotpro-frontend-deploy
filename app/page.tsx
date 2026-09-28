import { Suspense } from 'react';
import { getCurrentUserServer } from '@/lib/util';

async function UserContent() {
  const user = await getCurrentUserServer();

  return (
    <div>
      <h1>Dashboard</h1>

      {user ? (
        <div>
          <p>Welcome, {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>No user found.</p>
      )}
    </div>
  );
}

function Loading() {
  return <p>Loading user...</p>;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <UserContent />
    </Suspense>
  );
}
