import { cookies } from 'next/headers';
import { User } from '@/lib/types/auth';
import { baseUrl } from '@/lib/api';
import { cache } from 'react';

export const getCurrentUserServer = cache(
  async function (): Promise<User | null> {
    try {
      const cookieStore = await cookies();

      const accessToken = cookieStore.get('accessToken')?.value;
      // console.log('AccessToken', accessToken);

      if (!accessToken) {
        return null;
      }

      const response = await fetch(`${baseUrl}/auth/me`, {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        method: 'GET',
      });

      // console.log('Response', response);

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      // console.log('Data', data);

      return data.user;
    } catch (error) {
      // console.error('User fetch error:', error);
      return null;
    }
  },
);
