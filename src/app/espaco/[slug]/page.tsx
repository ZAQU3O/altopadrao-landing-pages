import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma, ensureSeeded } from '@/lib/prisma';
import SpaceSubdomainView from '@/components/SpaceSubdomainView';

export const dynamic = 'force-dynamic';

export async function generateMetadata(context: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await ensureSeeded();
  const { slug } = await context.params;
  const space = await prisma.space.findUnique({ where: { slug } });
  if (!space) {
    return { title: 'Espaço Não Encontrado | AltoPadrão Imobiliária' };
  }
  return {
    title: `${space.name} | AltoPadrão Imobiliária (${space.subdomain})`,
    description: space.heroSubtitle,
  };
}

export default async function SpacePage(context: {
  params: Promise<{ slug: string }>;
}) {
  await ensureSeeded();
  const { slug } = await context.params;

  const [space, allSpaces] = await Promise.all([
    prisma.space.findUnique({ where: { slug } }),
    prisma.space.findMany({
      orderBy: { featuredOrder: 'asc' },
      select: { id: true, slug: true, name: true, subdomain: true },
    }),
  ]);

  if (!space) {
    notFound();
  }

  return (
    <SpaceSubdomainView
      space={JSON.parse(JSON.stringify(space))}
      allSpaces={JSON.parse(JSON.stringify(allSpaces))}
    />
  );
}

