import { cookies } from 'next/headers';
import { cache } from 'react';

import { User } from '@/lib/types/auth';
import { baseUrl } from '@/lib/api';

export const getCurrentUserServer = cache(async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      console.log('No access token found');
      return null;
    }

    const response = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });

    console.log('Auth/me status:', response.status);

    if (!response.ok) {
      console.log('Auth/me failed:', await response.text());
      return null;
    }

    const result = await response.json();

    console.log('Auth/me result:', result);

    return result.data?.user ?? null;
  } catch (error) {
    console.error('getCurrentUserServer error:', error);
    return null;
  }
});
