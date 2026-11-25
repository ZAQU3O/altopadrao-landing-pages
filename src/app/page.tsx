import React from 'react';
import { prisma, ensureSeeded } from '@/lib/prisma';
import PortalHomeView from '@/components/PortalHomeView';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await ensureSeeded();

  const [spaces, sysConfig] = await Promise.all([
    prisma.space.findMany({
      where: { active: true },
      orderBy: { featuredOrder: 'asc' },
    }),
    prisma.systemConfig.findUnique({ where: { id: 'default' } }).catch(() => null),
  ]);

  return (
    <PortalHomeView
      spaces={JSON.parse(JSON.stringify(spaces))}
      sysConfig={JSON.parse(JSON.stringify(sysConfig))}
    />
  );
}

