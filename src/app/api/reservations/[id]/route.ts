import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureSeeded } from '@/lib/prisma';
import { notificationBus } from '@/lib/events';
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

    const existing = await prisma.reservation.findUnique({
      where: { id },
      include: { space: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 });
    }

    const becomingConfirmed =
      body.status === 'CONFIRMADA' && existing.status !== 'CONFIRMADA';

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        status: body.status ?? existing.status,
        paymentStatus: body.paymentStatus ?? existing.paymentStatus,
        brokerName: body.brokerName ?? existing.brokerName,
        lotPreference: body.lotPreference ?? existing.lotPreference,
        notes: body.notes ?? existing.notes,
        confirmedAt: becomingConfirmed ? new Date() : existing.confirmedAt,
      },
      include: { space: true },
    });

    let notification = null;
    if (becomingConfirmed || body.triggerNotification) {
      const fmtCurrency = (v: number) =>
        v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      notification = await prisma.notification.create({
        data: {
          type: 'RESERVA_CONFIRMADA',
          title: `Reserva Confirmada · ${updated.space.name}`,
          message: `A reserva ${updated.protocol} de ${updated.clientName} foi confirmada pela gestão (${fmtCurrency(updated.lotValue)} · ${updated.lotPreference}). Notificação automática enviada.`,
          protocol: updated.protocol,
          spaceId: updated.spaceId,
          amount: updated.lotValue,
          clientName: updated.clientName,
          clientPhone: updated.clientPhone,
          channelsSent: 'PAINEL_REALTIME,WHATSAPP_AUTO,EMAIL_CLIENTE',
          read: false,
        },
        include: { space: true },
      });

      notificationBus.emit({
        event: 'RESERVA_CONFIRMADA',
        notification,
        reservation: updated,
      });
    }

    return NextResponse.json({ reservation: updated, notification });
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
    await prisma.reservation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

