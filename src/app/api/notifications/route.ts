import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureSeeded } from '@/lib/prisma';

export async function GET() {
  try {
    await ensureSeeded();
    const notifications = await prisma.notification.findMany({
      include: { space: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ notifications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureSeeded();
    const body = await req.json();

    if (body.markAllRead) {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
      });
    } else if (body.id) {
      await prisma.notification.update({
        where: { id: body.id },
        data: { read: true },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

