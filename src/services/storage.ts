import { supabase } from '@/lib/supabase';

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
 * Uploads a file (Image or PDF) to Supabase Storage.
 * Uses Base64 data URL as smooth fallback if bucket is offline or unconfigured.
 */
export async function uploadFileToSupabase(
  file: File,
  bucket: 'media_desa' | 'publikasi_pdf' = 'media_desa'
): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop() || 'bin';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    // Attempt upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }

    // Smooth fallback to Base64 data URL
    return await fileToBase64(file);
  } catch (err) {
    console.warn('Supabase storage upload fallback to base64:', err);
    return await fileToBase64(file);
  }
}
