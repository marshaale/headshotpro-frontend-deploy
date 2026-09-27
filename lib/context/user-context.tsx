'use client';

import { User } from '@/lib/types/auth';
import { createContext, useContext } from 'react';

interface UserContext {
  user: User | null;
}

const userContext = createContext<UserContext | undefined>(undefined);

export function UserContextProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return (
    <userContext.Provider value={{ user }}>{children}</userContext.Provider>
  );
}

export function useUser() {
  const context = useContext(userContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
}
