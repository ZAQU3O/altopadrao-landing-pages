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
    return { title: 'Condomínio Não Encontrado | AltoPadrão Imobiliária' };
  }
  const title = `${space.name} · ${space.offerTitle} ${space.offerBadge} | AltoPadrão Imobiliária`;
  const description = space.heroSubtitle;
  const ogImage = space.heroImage || '/images/aldebaran/hero-pool.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'AltoPadrão Imobiliária',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: space.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function SpacePage(context: {
  params: Promise<{ slug: string }>;
}) {
  await ensureSeeded();
  const { slug } = await context.params;

  const [space, allSpaces, sysConfig] = await Promise.all([
    prisma.space.findUnique({ where: { slug } }),
    prisma.space.findMany({
      orderBy: { featuredOrder: 'asc' },
      select: { id: true, slug: true, name: true, subdomain: true },
    }),
    prisma.systemConfig.findUnique({ where: { id: 'default' } }).catch(() => null),
  ]);

  if (!space) {
    notFound();
  }

  return (
    <SpaceSubdomainView
      space={JSON.parse(JSON.stringify(space))}
      allSpaces={JSON.parse(JSON.stringify(allSpaces))}
      sysConfig={JSON.parse(JSON.stringify(sysConfig))}
    />
  );
}

