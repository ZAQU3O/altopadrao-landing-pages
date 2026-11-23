import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureSeeded } from '@/lib/prisma';
import { notificationBus } from '@/lib/events';

export async function GET(req: NextRequest) {
  try {
    await ensureSeeded();
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get('spaceId');

    const where: any = {};
    if (spaceId && spaceId !== 'ALL') where.spaceId = spaceId;

    const captures = await prisma.propertyCapture.findMany({
      where,
      include: { space: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ captures });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureSeeded();
    const body = await req.json();

    let space = null;
    if (body.spaceId) {
      space = await prisma.space.findUnique({ where: { id: body.spaceId } });
    } else if (body.spaceSlug) {
      space = await prisma.space.findUnique({ where: { slug: body.spaceSlug } });
    }
    if (!space) {
      space = await prisma.space.findFirst({ orderBy: { featuredOrder: 'asc' } });
    }
    if (!space) {
      return NextResponse.json({ error: 'Espaço não encontrado' }, { status: 404 });
    }

    const rand = Math.floor(100 + Math.random() * 900);
    const protocol = `CAP-2026-${rand}`;
    const askingPrice = Number(body.askingPrice) || 450000;
    const areaM2 = Number(body.areaM2) || space.minAreaM2;

    const capture = await prisma.propertyCapture.create({
      data: {
        protocol,
        spaceId: space.id,
        ownerName: body.ownerName,
        ownerPhone: body.ownerPhone,
        ownerEmail: body.ownerEmail || null,
        propertyType: body.propertyType || 'Lote em Condomínio',
        blockAndLot: body.blockAndLot || 'A informar na vistoria',
        areaM2,
        askingPrice,
        acceptsDirectFin: Boolean(body.acceptsDirectFin ?? true),
        description: body.description || null,
        status: 'EM_AVALIACAO',
        sourceHost: body.sourceHost || space.subdomain,
      },
      include: { space: true },
    });

    const fmtCurrency = (v: number) =>
      v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const notification = await prisma.notification.create({
      data: {
        type: 'NOVA_CAPTACAO',
        title: `Nova Captação de Imóvel · ${space.name}`,
        message: `Protocolo ${protocol}: Proprietário ${capture.ownerName} cadastrou ${capture.propertyType} (${capture.blockAndLot}, ${areaM2} m²) por ${fmtCurrency(askingPrice)}.`,
        protocol,
        spaceId: space.id,
        amount: askingPrice,
        clientName: capture.ownerName,
        clientPhone: capture.ownerPhone,
        channelsSent: 'PAINEL_REALTIME,WHATSAPP_CAPTACAO',
        read: false,
      },
      include: { space: true },
    });

    notificationBus.emit({
      event: 'NOVA_CAPTACAO',
      notification,
      capture,
    });

    // Disparo automático de Webhook externo se configurado
    try {
      const sysConfig = await prisma.systemConfig.findUnique({
        where: { id: 'default' },
      });
      const targetWebhook = space.webhookUrl || sysConfig?.globalWebhookUrl;
      if (targetWebhook && targetWebhook.startsWith('http')) {
        fetch(targetWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'NOVA_CAPTACAO_IMOVEL',
            protocol,
            space: {
              id: space.id,
              name: space.name,
              slug: space.slug,
              subdomain: space.subdomain,
            },
            capture,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {});
      }
    } catch {
      // non-blocking webhook
    }

    return NextResponse.json({ capture, notification }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

