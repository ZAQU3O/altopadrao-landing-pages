import React from 'react';
import { prisma, ensureSeeded } from '@/lib/prisma';
import PortalHomeView from '@/components/PortalHomeView';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await ensureSeeded();

  const [spaces, reservations, captures, sysConfig] = await Promise.all([
    prisma.space.findMany({ orderBy: { featuredOrder: 'asc' } }),
    prisma.reservation.findMany(),
    prisma.propertyCapture.findMany(),
    prisma.systemConfig.findUnique({ where: { id: 'default' } }).catch(() => null),
  ]);

  const totalConfirmedVgv = reservations
    .filter((r) => r.status === 'CONFIRMADA')
    .reduce((acc, r) => acc + Number(r.lotValue || 0), 0);

  return (
    <PortalHomeView
      spaces={JSON.parse(JSON.stringify(spaces))}
      sysConfig={JSON.parse(JSON.stringify(sysConfig))}
      stats={{
        totalSpaces: spaces.length,
        totalConfirmedVgv,
        totalReservations: reservations.length,
        totalCaptures: captures.length,
      }}
    />
  );
}

