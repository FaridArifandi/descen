/**
 * Convert file to Base64 data URL for offline fallback or preview.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Uploads a file (Image or PDF) to the server via /api/upload.
 * Uses Base64 data URL as smooth fallback if upload fails.
 */
export async function uploadFileToSupabase(
  file: File,
  bucket: 'media_desa' | 'publikasi_pdf' = 'media_desa'
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        return data.url;
      }
    }

    // Smooth fallback to Base64 data URL
    return await fileToBase64(file);
  } catch (err) {
    console.warn('File upload fallback to base64:', err);
    return await fileToBase64(file);
  }
}
