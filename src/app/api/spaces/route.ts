import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, ensureSeeded } from '@/lib/prisma';

export async function GET() {
  try {
    await ensureSeeded();
    const spaces = await prisma.space.findMany({
      orderBy: { featuredOrder: 'asc' },
      include: {
        reservations: true,
        captures: true,
      },
    });
    return NextResponse.json({ spaces });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureSeeded();
    const body = await req.json();
    const rawSlug = String(body.slug || body.name || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

    if (!rawSlug) {
      return NextResponse.json({ error: 'Slug/subdomínio inválido' }, { status: 400 });
    }

    const count = await prisma.space.count();
    const template = await prisma.space.findFirst({ where: { slug: 'aldebaran' } });

    const created = await prisma.space.create({
      data: {
        slug: rawSlug,
        subdomain: `${rawSlug}.altopadraoreservas.com`,
        name: body.name,
        eyebrow: body.eyebrow || `${body.name} · ${body.region || 'Teresina - PI'}`,
        region: body.region || 'Zona Leste · Teresina - PI',
        developer: body.developer || 'AltoPadrão Urbanismo Parceiro',
        offerTitle: body.offerTitle || `Entrada + ${body.maxInstallments || 60}x`,
        offerBadge: body.offerBadge || 'SEM JUROS',
        offerBarText: body.offerBarText || `Entrada + ${body.maxInstallments || 60}x sem juros`,
        heroSubtitle:
          body.heroSubtitle ||
          `Lotes exclusivos a partir de ${body.minAreaM2 || 450} m² em condomínio fechado de alto padrão. Unidades limitadas.`,
        projectTitle: body.projectTitle || 'Arquitetura autoral e qualidade de vida.',
        projectLead:
          body.projectLead ||
          `${body.name} reúne lotes amplos, infraestrutura completa de clube e segurança 24h com a curadoria da AltoPadrão Imobiliária.`,
        projectBody:
          body.projectBody ||
          'Portaria monumental, fiação protegida, alamedas arborizadas e complexo esportivo completo para toda a família.',
        architect: body.architect || 'Curadoria AltoPadrão Arquitetura',
        landscaper: body.landscaper || 'Estúdio Paisagismo Tropical',
        spaTitle: 'Bem-estar e relaxamento todos os dias.',
        spaLead: 'Sauna, espaço massagem e piscinas integradas à natureza.',
        locationTitle: body.region || 'Localização estratégica e valorizada.',
        locationLead: 'Acesso rápido e cercado pelos melhores serviços da região.',
        ctaTitle: `Garanta seu lote no ${body.name}.`,
        ctaLead: 'Simule sua proposta agora e receba atendimento prioritário de um especialista AltoPadrão.',
        footerDisclaimer:
          template?.footerDisclaimer ||
          'AltoPadrão Imobiliária | CRECI 0481-PJ | Teresina - PI.',
        whatsappNumber: body.whatsappNumber || '5586900000000',
        accentColor: body.accentColor || '#a8582f',
        deepColor: body.deepColor || '#16302e',
        maxInstallments: Number(body.maxInstallments) || 60,
        defaultLotPrice: Number(body.defaultLotPrice) || 380000,
        defaultDownPayment: Number(body.defaultDownPayment) || 76000,
        totalLots: Number(body.totalLots) || 200,
        availableLots: Number(body.availableLots) || 35,
        minAreaM2: Number(body.minAreaM2) || 450,
        greenAreaText: body.greenAreaText || '50 mil m²',
        heroImage: body.heroImage || '/images/aldebaran/hero-pool.jpg',
        projectImage: '/images/aldebaran/project-entrance.jpg',
        locationImage: '/images/aldebaran/location-pergola.jpg',
        ctaBgImage: '/images/aldebaran/cta-bg.jpg',
        factsJson: JSON.stringify([
          { value: String(body.totalLots || 200), label: 'lotes em condomínio fechado' },
          { value: `${body.minAreaM2 || 450} m²`, label: 'metragem a partir de' },
          { value: body.greenAreaText || '50 mil m²', label: 'de área verde e lazer' },
          { value: `${body.maxInstallments || 60}x`, label: 'parcelamento especial' },
        ]),
        offerBulletsJson:
          template?.offerBulletsJson ||
          JSON.stringify([
            'Tabela direta com condições de lançamento',
            'Lotes selecionados em condomínio fechado',
            'Assessoria jurídica e imobiliária AltoPadrão',
          ]),
        mosaicJson: template?.mosaicJson || '[]',
        tagsJson: template?.tagsJson || '[]',
        spaItemsJson: template?.spaItemsJson || '[]',
        familyItemsJson: template?.familyItemsJson || '[]',
        locationBulletsJson:
          JSON.stringify([
            { title: 'Localização', text: body.region || 'Teresina - PI' },
            { title: 'Condições', text: body.offerBarText || 'Entrada facilitada + parcelamento direto' },
          ]),
        areaOptionsJson: JSON.stringify([
          `A partir de ${body.minAreaM2 || 450} m²`,
          'Lote Padrão Nascente',
          'Lote de Esquina / Lazer',
          'Casa Construída no Condomínio',
        ]),
        active: true,
        featuredOrder: count + 1,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/espaco/${created.slug}`);

    return NextResponse.json({ space: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

