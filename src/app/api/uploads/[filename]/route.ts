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
  pdf: 'application/pdf',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  try {
    // Sanitize filename strictly to prevent directory traversal
    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '');

    // Prevent hidden files or traversal
    if (safeFilename.startsWith('.') || safeFilename.includes('..')) {
      return new Response('Access denied', { status: 403 });
    }

    const filePath = join(process.cwd(), 'public', 'uploads', safeFilename);

    if (!existsSync(filePath)) {
      return new Response('File not found', { status: 404 });
    }

    const ext = safeFilename.split('.').pop()?.toLowerCase() || '';

    // Block serving executable or script files completely
    const forbiddenExts = ['php', 'phtml', 'sh', 'html', 'htm', 'js', 'exe', 'bat', 'cmd', 'py', 'svg'];
    if (forbiddenExts.includes(ext)) {
      return new Response('Access forbidden for this file type', { status: 403 });
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = await readFile(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new Response('Internal error', { status: 500 });
  }
}
