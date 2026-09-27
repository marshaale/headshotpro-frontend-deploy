export * from './server-auth';

export function getUserDashboardPath(role: string): string {
  if (role.toLowerCase().trim() === 'admin') {
    return '/dashboard/admin';
  }
  return '/dashboard/user';
}

export function parseSetCookie(setCookie: string) {
  return setCookie.split(/,\s*(?=[^;=]+=[^;]+)/).map((cookie) => {
    const parts = cookie.split(';').map((part) => part.trim());

    const [key, ...valueParts] = parts[0].split('=');

    const result: {
      key: string;
      value: string;
      attributes: Record<string, any>;
    } = {
      key: key.trim(),
      value: valueParts.join('=').trim(),
      attributes: {},
    };

    for (const part of parts.slice(1)) {
      const [attrKey, ...attrValueParts] = part.split('=');

      const key = attrKey.trim();
      const value = attrValueParts.join('=').trim();

      result.attributes[key] = value || true;
    }

    return result;
  });
}
