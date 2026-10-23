import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Strict Whitelist of allowed MIME types and corresponding extensions
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

// Magic bytes validation to ensure file content actually matches image/pdf format
function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  // JPEG: FF D8 FF
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47
  if (mimeType.includes('png')) {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  // WEBP: RIFF (52 49 46 46) and WEBP (57 45 42 50)
  if (mimeType.includes('webp')) {
    return (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer.subarray(8, 12).toString() === 'WEBP'
    );
  }

  // PDF: %PDF- (25 50 44 46)
  if (mimeType.includes('pdf')) {
    return buffer.subarray(0, 5).toString() === '%PDF-';
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce authentication (Only BPS or Desa admin can upload)
    const authResult = await requireAuth(request, ['bps', 'desa']);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah.' }, { status: 400 });
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas maksimal 10MB.' },
        { status: 400 }
      );
    }

    // 3. Validate MIME type against strict whitelist
    const rawMime = (file.type || '').toLowerCase();
    const safeExt = ALLOWED_MIME_TYPES[rawMime];

    if (!safeExt) {
      return NextResponse.json(
        { error: 'Format file tidak diizinkan. Hanya menerima format JPG, PNG, WEBP, dan PDF.' },
        { status: 400 }
      );
    }

    // 4. Validate binary content (Magic Bytes) to prevent file extension spoofing / webshells
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!validateMagicBytes(buffer, rawMime)) {
      return NextResponse.json(
        { error: 'Konten file tidak valid atau rusak (verifikasi binary gagal).' },
        { status: 400 }
      );
    }

    // 5. Save to disk with completely sanitized and random filename
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${safeExt}`;
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json({ error: 'Gagal memproses file upload.' }, { status: 500 });
  }
}
