import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, ensureSeeded } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

export async function GET() {
  try {
    await ensureSeeded();
    const config = await prisma.systemConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        globalWhatsapp: '5586900000000',
        globalMetaPixelId: '',
        globalGtmId: '',
        globalWebhookUrl: '',
        adminEmail: 'admin@altopadraoreservas.com',
        adminPassword: 'altopadrao2026',
      },
    });
    return NextResponse.json({
      config: {
        ...config,
        adminPassword: '', // do not expose raw password in GET
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdminAuth();
    if (!auth.authorized) return auth.response;

    await ensureSeeded();
    const body = await req.json();

    const existing = await prisma.systemConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' },
    });

    const cleanWhatsapp = body.globalWhatsapp
      ? String(body.globalWhatsapp).replace(/\D/g, '')
      : existing.globalWhatsapp;

    const updated = await prisma.systemConfig.update({
      where: { id: 'default' },
      data: {
        globalWhatsapp: cleanWhatsapp || existing.globalWhatsapp,
        globalMetaPixelId:
          body.globalMetaPixelId !== undefined
            ? String(body.globalMetaPixelId).trim()
            : existing.globalMetaPixelId,
        globalGtmId:
          body.globalGtmId !== undefined
            ? String(body.globalGtmId).trim()
            : existing.globalGtmId,
        globalWebhookUrl:
          body.globalWebhookUrl !== undefined
            ? String(body.globalWebhookUrl).trim()
            : existing.globalWebhookUrl,
        adminEmail:
          body.adminEmail && String(body.adminEmail).trim() !== ''
            ? String(body.adminEmail).trim().toLowerCase()
            : existing.adminEmail,
        adminPassword:
          body.adminPassword && String(body.adminPassword).trim() !== ''
            ? String(body.adminPassword).trim()
            : existing.adminPassword,
      },
    });

    if (body.applyWhatsappToAllSpaces && cleanWhatsapp) {
      await prisma.space.updateMany({
        data: { whatsappNumber: cleanWhatsapp },
      });
    }

    revalidatePath('/');
    revalidatePath('/admin');

    return NextResponse.json({
      config: {
        ...updated,
        adminPassword: '',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
