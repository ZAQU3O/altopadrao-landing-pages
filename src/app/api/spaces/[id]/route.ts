import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const existing = await prisma.space.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Landing page / espaço não encontrado.' },
        { status: 404 }
      );
    }

    let nextSlug = existing.slug;
    let nextSubdomain = existing.subdomain;
    if (body.slug && String(body.slug).trim() !== '') {
      const cleaned = String(body.slug)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
      if (cleaned) {
        nextSlug = cleaned;
        nextSubdomain = `${cleaned}.altopadraoreservas.com`;
      }
    }

    const updated = await prisma.space.update({
      where: { id },
      data: {
        slug: nextSlug,
        subdomain: nextSubdomain,
        name: body.name ?? existing.name,
        eyebrow: body.eyebrow ?? existing.eyebrow,
        region: body.region ?? existing.region,
        developer: body.developer ?? existing.developer,
        offerTitle: body.offerTitle ?? existing.offerTitle,
        offerBadge: body.offerBadge ?? existing.offerBadge,
        offerBarText: body.offerBarText ?? existing.offerBarText,
        heroSubtitle: body.heroSubtitle ?? existing.heroSubtitle,
        projectTitle: body.projectTitle ?? existing.projectTitle,
        projectLead: body.projectLead ?? existing.projectLead,
        projectBody: body.projectBody ?? existing.projectBody,
        architect: body.architect ?? existing.architect,
        landscaper: body.landscaper ?? existing.landscaper,
        spaTitle: body.spaTitle ?? existing.spaTitle,
        spaLead: body.spaLead ?? existing.spaLead,
        locationTitle: body.locationTitle ?? existing.locationTitle,
        locationLead: body.locationLead ?? existing.locationLead,
        ctaTitle: body.ctaTitle ?? existing.ctaTitle,
        ctaLead: body.ctaLead ?? existing.ctaLead,
        footerDisclaimer: body.footerDisclaimer ?? existing.footerDisclaimer,
        whatsappNumber: body.whatsappNumber ?? existing.whatsappNumber,
        maxInstallments:
          body.maxInstallments !== undefined
            ? Number(body.maxInstallments)
            : existing.maxInstallments,
        defaultLotPrice:
          body.defaultLotPrice !== undefined
            ? Number(body.defaultLotPrice)
            : existing.defaultLotPrice,
        defaultDownPayment:
          body.defaultDownPayment !== undefined
            ? Number(body.defaultDownPayment)
            : existing.defaultDownPayment,
        totalLots:
          body.totalLots !== undefined
            ? Number(body.totalLots)
            : existing.totalLots,
        availableLots:
          body.availableLots !== undefined
            ? Number(body.availableLots)
            : existing.availableLots,
        minAreaM2:
          body.minAreaM2 !== undefined
            ? Number(body.minAreaM2)
            : existing.minAreaM2,
        greenAreaText: body.greenAreaText ?? existing.greenAreaText,
        heroImage: body.heroImage ?? existing.heroImage,
        projectImage: body.projectImage ?? existing.projectImage,
        locationImage: body.locationImage ?? existing.locationImage,
        ctaBgImage: body.ctaBgImage ?? existing.ctaBgImage,
        factsJson:
          body.factsJson !== undefined
            ? typeof body.factsJson === 'string'
              ? body.factsJson
              : JSON.stringify(body.factsJson)
            : existing.factsJson,
        offerBulletsJson:
          body.offerBulletsJson !== undefined
            ? typeof body.offerBulletsJson === 'string'
              ? body.offerBulletsJson
              : JSON.stringify(body.offerBulletsJson)
            : existing.offerBulletsJson,
        mosaicJson:
          body.mosaicJson !== undefined
            ? typeof body.mosaicJson === 'string'
              ? body.mosaicJson
              : JSON.stringify(body.mosaicJson)
            : existing.mosaicJson,
        tagsJson:
          body.tagsJson !== undefined
            ? typeof body.tagsJson === 'string'
              ? body.tagsJson
              : JSON.stringify(body.tagsJson)
            : existing.tagsJson,
        spaItemsJson:
          body.spaItemsJson !== undefined
            ? typeof body.spaItemsJson === 'string'
              ? body.spaItemsJson
              : JSON.stringify(body.spaItemsJson)
            : existing.spaItemsJson,
        familyItemsJson:
          body.familyItemsJson !== undefined
            ? typeof body.familyItemsJson === 'string'
              ? body.familyItemsJson
              : JSON.stringify(body.familyItemsJson)
            : existing.familyItemsJson,
        locationBulletsJson:
          body.locationBulletsJson !== undefined
            ? typeof body.locationBulletsJson === 'string'
              ? body.locationBulletsJson
              : JSON.stringify(body.locationBulletsJson)
            : existing.locationBulletsJson,
        areaOptionsJson:
          body.areaOptionsJson !== undefined
            ? typeof body.areaOptionsJson === 'string'
              ? body.areaOptionsJson
              : JSON.stringify(body.areaOptionsJson)
            : existing.areaOptionsJson,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/espaco/${updated.slug}`);

    return NextResponse.json({ space: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.space.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
    return NextResponse.json({ deleted: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

