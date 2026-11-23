import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureSeeded } from '@/lib/prisma';
import { notificationBus } from '@/lib/events';

export async function GET(req: NextRequest) {
  try {
    await ensureSeeded();
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get('spaceId');
    const status = searchParams.get('status');

    const where: any = {};
    if (spaceId && spaceId !== 'ALL') where.spaceId = spaceId;
    if (status && status !== 'ALL') where.status = status;

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        space: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reservations });
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

    const lotValue = Number(body.lotValue) || space.defaultLotPrice;
    const downPayment =
      body.downPayment !== undefined ? Number(body.downPayment) : space.defaultDownPayment;
    const installments = Number(body.installments) || space.maxInstallments;
    const installmentValue =
      installments > 0 && lotValue > downPayment
        ? Number(((lotValue - downPayment) / installments).toFixed(2))
        : 0;

    const rand = Math.floor(1000 + Math.random() * 9000);
    const protocol = `RES-2026-${rand}`;
    const isAutoConfirm = body.status === 'CONFIRMADA';

    const reservation = await prisma.reservation.create({
      data: {
        protocol,
        spaceId: space.id,
        clientName: body.clientName,
        clientPhone: body.clientPhone,
        clientEmail: body.clientEmail || null,
        clientCpf: body.clientCpf || null,
        lotPreference: body.lotPreference || 'Unidade Selecionada na Tabela',
        areaInterest: body.areaInterest || `${space.minAreaM2} m²`,
        lotValue,
        downPayment,
        installments,
        installmentValue,
        status: isAutoConfirm ? 'CONFIRMADA' : body.status || 'CONFIRMADA',
        paymentStatus: body.paymentStatus || 'SINAL_RESERVA_SOLICITADO',
        sourceHost: body.sourceHost || space.subdomain,
        brokerName: body.brokerName || 'Plantão Digital AltoPadrão',
        notes: body.notes || null,
        confirmedAt: new Date(),
      },
      include: {
        space: true,
      },
    });

    if (space.availableLots > 0) {
      await prisma.space.update({
        where: { id: space.id },
        data: { availableLots: { decrement: 1 } },
      });
    }

    const fmtCurrency = (v: number) =>
      v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const notification = await prisma.notification.create({
      data: {
        type: 'RESERVA_CONFIRMADA',
        title: `Nova Reserva Confirmada · ${space.name}`,
        message: `Protocolo ${protocol}: ${reservation.clientName} (${reservation.clientPhone}) reservou ${reservation.lotPreference} (${reservation.areaInterest}) por ${fmtCurrency(lotValue)} [Entrada ${fmtCurrency(downPayment)} + ${installments}x de ${fmtCurrency(installmentValue)}].`,
        protocol,
        spaceId: space.id,
        amount: lotValue,
        clientName: reservation.clientName,
        clientPhone: reservation.clientPhone,
        channelsSent: 'PAINEL_REALTIME,WHATSAPP_AUTO,EMAIL_CORRETOR',
        read: false,
      },
      include: {
        space: true,
      },
    });

    notificationBus.emit({
      event: 'RESERVA_CONFIRMADA',
      notification,
      reservation,
    });

    // Disparo automático de Webhook externo (n8n, Zapier, Make, Evolution API, CRM) se configurado
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
            event: 'NOVA_RESERVA_CONFIRMADA',
            protocol,
            space: {
              id: space.id,
              name: space.name,
              slug: space.slug,
              subdomain: space.subdomain,
            },
            reservation,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {});
      }
    } catch {
      // non-blocking webhook
    }

    return NextResponse.json({ reservation, notification }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

