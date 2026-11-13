import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureSeeded } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
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

