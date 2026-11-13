import React from 'react';
import { prisma, ensureSeeded } from '@/lib/prisma';
import PortalHomeView from '@/components/PortalHomeView';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await ensureSeeded();

  const [spaces, reservations, captures] = await Promise.all([
    prisma.space.findMany({ orderBy: { featuredOrder: 'asc' } }),
    prisma.reservation.findMany(),
    prisma.propertyCapture.findMany(),
  ]);

  const totalConfirmedVgv = reservations
    .filter((r) => r.status === 'CONFIRMADA')
    .reduce((acc, r) => acc + Number(r.lotValue || 0), 0);

  return (
    <PortalHomeView
      spaces={JSON.parse(JSON.stringify(spaces))}
      stats={{
        totalSpaces: spaces.length,
        totalConfirmedVgv,
        totalReservations: reservations.length,
        totalCaptures: captures.length,
      }}
    />
  );
}

