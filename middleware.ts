import { NextRequest, NextResponse } from 'next/server';
import { baseUrl } from './lib/api';
import { parseSetCookie } from './lib/util';

export async function middleware(req: NextRequest, res: NextResponse) {
  const { nextUrl } = req;

  // console.log('url', nextUrl);

  const dashboardPath = '/dashboard';
  const authPath = '/auth';

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const isAuthenticated = !!(accessToken || refreshToken);

  if (isAuthenticated) {
    // Authenticated redirect to dashboard
    if (nextUrl.pathname.startsWith(authPath)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (accessToken) {
      return NextResponse.next();
    }

    // refresh access token
    if (refreshToken) {
      try {
        const refreshTokneResponse = await fetch(
          `${baseUrl}/auth/refresh-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `refreshToken=${refreshToken}`,
            },
          },
        );
        // if response not fail
        if (refreshTokneResponse.ok) {
          const response = NextResponse.next();
          // console.log('Refresh token response');
          // console.log(refreshTokneResponse);
          // console.log('Set Cookies', setCookies);

          // Extract cookies and set
          const setCookies = refreshTokneResponse.headers.get('set-cookie');
          if (setCookies) {
            const cookiesArray = parseSetCookie(setCookies);
            for (const cookie of cookiesArray) {
              response.cookies.set({
                name: cookie.key,
                value: cookie.value,
                maxAge: Number(cookie.attributes['Max-Age']),
                path: cookie.attributes.Path,
                expires: cookie.attributes.Expires,
                httpOnly: cookie.attributes.HttpOnly,
                sameSite: cookie.attributes.SameSite.toLowerCase() as
                  | 'lax'
                  | 'strict'
                  | 'none',
                secure: process.env.NODE_ENV === 'production',
              });
            }
            return response;
          }
        } else {
          // if response fails delete refresh-token
          const response = NextResponse.next();
          response.cookies.delete('refreshToken');
          return response;
        }
      } catch (error) {
        console.error('Failed to refresh token', error);
      }
    }
  } else {
    // Not authenticated redirect to login
    if (nextUrl.pathname.startsWith(dashboardPath)) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
};
