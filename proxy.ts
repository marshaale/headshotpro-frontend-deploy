import { NextRequest, NextResponse } from 'next/server';
import { baseUrl } from './lib/api';
import { parseSetCookie } from './lib/util';

const DASHBOARD_PATH = '/dashboard';
const AUTH_PATH = '/auth';
const LOGIN_PATH = '/auth/login';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  /*
   * User has a valid access token.
   */
  if (accessToken) {
    if (pathname.startsWith(AUTH_PATH)) {
      return NextResponse.redirect(
        new URL(DASHBOARD_PATH, req.url),
      );
    }

    return NextResponse.next();
  }

  /*
   * No access token, but we have a refresh token.
   * Try to obtain a new access token.
   */
  if (refreshToken) {
    try {
      const refreshResponse = await fetch(
        `${baseUrl}/auth/refresh-token`,
        {
          method: 'POST',
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
          cache: 'no-store',
        },
      );

      if (refreshResponse.ok) {
        const response = NextResponse.next();

        const setCookieHeader =
          refreshResponse.headers.get('set-cookie');

        if (setCookieHeader) {
          const cookies = parseSetCookie(setCookieHeader);

          for (const cookie of cookies) {
            response.cookies.set({
              name: cookie.key,
              value: cookie.value,
              ...(cookie.attributes['Max-Age'] && {
                maxAge: Number(cookie.attributes['Max-Age']),
              }),
              ...(cookie.attributes.Path && {
                path: cookie.attributes.Path,
              }),
              domain: cookie.attributes.domain || '.sotechho.com',
              ...(cookie.attributes.Expires && {
                expires: new Date(cookie.attributes.Expires),
              }),
              ...(cookie.attributes.HttpOnly !== undefined && {
                httpOnly: cookie.attributes.HttpOnly,
              }),
              ...(cookie.attributes.SameSite && {
                sameSite:
                  cookie.attributes.SameSite.toLowerCase() as
                    | 'lax'
                    | 'strict'
                    | 'none',
              }),
              secure: process.env.NODE_ENV === 'production',
            });
          }
        }

        /*
         * If the user was trying to access /auth,
         * send them to the dashboard after successful refresh.
         */
        if (pathname.startsWith(AUTH_PATH)) {
          return NextResponse.redirect(
            new URL(DASHBOARD_PATH, req.url),
          );
        }

        return response;
      }

      /*
       * Refresh token is invalid/expired.
       */
      const response = pathname.startsWith(DASHBOARD_PATH)
        ? NextResponse.redirect(new URL(LOGIN_PATH, req.url))
        : NextResponse.next();

      // response.cookies.delete('accessToken');
      // response.cookies.delete('refreshToken');

      return response;
    } catch (error) {
      console.error('Failed to refresh access token:', error);

      /*
       * Don't expose protected routes when refresh fails.
       */
      if (pathname.startsWith(DASHBOARD_PATH)) {
        const response = NextResponse.redirect(
          new URL(LOGIN_PATH, req.url),
        );

        // response.cookies.delete('accessToken');
        // response.cookies.delete('refreshToken');

        return response;
      }

      return NextResponse.next();
    }
  }

  /*
   * No access token and no refresh token.
   */
  if (pathname.startsWith(DASHBOARD_PATH)) {
    return NextResponse.redirect(
      new URL(LOGIN_PATH, req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
};
