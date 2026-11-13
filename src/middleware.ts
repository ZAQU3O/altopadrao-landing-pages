import { NextRequest, NextResponse } from 'next/server';

const MAIN_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'altopadraoreservas.com',
  'www.altopadraoreservas.com',
];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostHeader = req.headers.get('host') || '';
  const hostname = hostHeader.split(':')[0].toLowerCase();

  // Skip static assets and API routes
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/images') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  let subdomain: string | null = null;

  if (!MAIN_DOMAINS.includes(hostname)) {
    if (hostname.endsWith('.localhost')) {
      subdomain = hostname.replace('.localhost', '');
    } else if (hostname.endsWith('.altopadraoreservas.com')) {
      subdomain = hostname.replace('.altopadraoreservas.com', '');
    } else {
      const parts = hostname.split('.');
      if (parts.length >= 3 && parts[0] !== 'www') {
        subdomain = parts[0];
      }
    }
  }

  if (subdomain && subdomain !== 'www') {
    if (subdomain === 'admin') {
      if (!url.pathname.startsWith('/admin')) {
        url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }

    // Rewrite root of space subdomain (e.g. aldebaran.altopadraoreservas.com/) to /espaco/aldebaran
    if (url.pathname === '/') {
      url.pathname = `/espaco/${subdomain}`;
      const res = NextResponse.rewrite(url);
      res.headers.set('x-space-subdomain', subdomain);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

