import React from 'react';
import type { Metadata } from 'next';
import { prisma, ensureSeeded } from '@/lib/prisma';
import AdminDashboardView from '@/components/AdminDashboardView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Painel Administrativo Unificado | AltoPadrão Reservas',
  description:
    'Central de gerenciamento de reservas, captação de imóveis, relatórios detalhados e notificações em tempo real para todos os subdomínios AltoPadrão.',
};

export default async function AdminPage() {
  await ensureSeeded();

  const [spaces, reservations, captures, notifications] = await Promise.all([
    prisma.space.findMany({ orderBy: { featuredOrder: 'asc' } }),
    prisma.reservation.findMany({
      include: { space: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.propertyCapture.findMany({
      include: { space: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.findMany({
      include: { space: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  return (
    <AdminDashboardView
      initialSpaces={JSON.parse(JSON.stringify(spaces))}
      initialReservations={JSON.parse(JSON.stringify(reservations))}
      initialCaptures={JSON.parse(JSON.stringify(captures))}
      initialNotifications={JSON.parse(JSON.stringify(notifications))}
    />
  );
}

