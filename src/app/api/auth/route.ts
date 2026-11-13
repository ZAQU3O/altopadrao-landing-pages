import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'altopadrao_admin_session';

const VALID_USERS = [
  {
    email: 'admin@altopadraoreservas.com',
    password: 'altopadrao2026',
    name: 'Diretoria AltoPadrão',
    role: 'Administrador Geral',
  },
  {
    email: 'corretor@altopadraoreservas.com',
    password: '123456',
    name: 'Plantão AltoPadrão',
    role: 'Gestor de Reservas',
  },
];

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(COOKIE_NAME)?.value;
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const parsed = JSON.parse(Buffer.from(session, 'base64').toString('utf-8'));
    return NextResponse.json({ authenticated: true, user: parsed });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();

    const matched = VALID_USERS.find(
      (u) => u.email.toLowerCase() === email && u.password === password
    );

    if (!matched) {
      return NextResponse.json(
        { error: 'E-mail ou senha inválidos. Verifique suas credenciais.' },
        { status: 401 }
      );
    }

    const userPayload = {
      email: matched.email,
      name: matched.name,
      role: matched.role,
      loggedAt: new Date().toISOString(),
    };

    const token = Buffer.from(JSON.stringify(userPayload)).toString('base64');
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return NextResponse.json({ authenticated: true, user: userPayload });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ authenticated: false });
}
