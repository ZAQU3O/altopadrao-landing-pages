import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo de imagem enviado.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name || '').toLowerCase() || '.jpg';
    const safeBase = path
      .basename(file.name || 'imagem', ext)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]/g, '-');

    const fileName = `${Date.now()}-${safeBase}${ext}`;
    const mimeType = file.type || 'image/jpeg';

    if (process.env.VERCEL) {
      const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        url: dataUrl,
        fileName,
      });
    }

    try {
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        url: `/images/uploads/${fileName}`,
        fileName,
      });
    } catch {
      const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        url: dataUrl,
        fileName,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

