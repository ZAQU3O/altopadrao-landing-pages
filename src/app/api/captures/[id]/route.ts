import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureSeeded } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminAuth();
    if (!auth.authorized) return auth.response;

    await ensureSeeded();
    const { id } = await context.params;
    const body = await req.json();

    const updated = await prisma.propertyCapture.update({
      where: { id },
      data: {
        status: body.status,
      },
      include: { space: true },
    });

    return NextResponse.json({ capture: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminAuth();
    if (!auth.authorized) return auth.response;

    const { id } = await context.params;
    await prisma.propertyCapture.delete({ where: { id } });
    return NextResponse.json({ deleted: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

