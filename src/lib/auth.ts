import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const ADMIN_COOKIE_NAME = 'altopadrao_admin_session';

export async function getAdminSessionUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!session) return null;
    const parsed = JSON.parse(Buffer.from(session, 'base64').toString('utf-8'));
    if (!parsed || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function requireAdminAuth() {
  const user = await getAdminSessionUser();
  if (!user) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { error: 'Não autorizado. Faça login na área administrativa.' },
        { status: 401 }
      ),
    };
  }
  return { authorized: true as const, user };
}
