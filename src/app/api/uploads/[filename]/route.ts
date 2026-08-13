import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

const MIME_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  try {
    // Sanitize filename to prevent directory traversal
    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '');
    const filePath = join(process.cwd(), 'public', 'uploads', safeFilename);

    if (!existsSync(filePath)) {
      return new Response('File not found', { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = safeFilename.split('.').pop()?.toLowerCase() || '';
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new Response('Internal error', { status: 500 });
  }
}
