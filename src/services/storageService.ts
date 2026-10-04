import { supabase, isSupabaseConfigured } from './supabaseClient';

export const storageService = {
  async uploadFile(
    file: File,
    bucket: 'portfolio-media' | 'resumes' = 'portfolio-media'
  ): Promise<{ url: string; error?: string }> {
    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { url: '', error: 'File size must not exceed 5MB.' };
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return { url: '', error: 'Invalid file type. Allowed: JPG, PNG, WEBP, SVG, PDF.' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    if (isSupabaseConfigured && supabase) {
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return { url: '', error: uploadError.message };
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return { url: data.publicUrl };
    }

    // Local development fallback: convert to Data URL for instant preview & persistence
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ url: '', error: 'Failed to read local file.' });
      };
      reader.readAsDataURL(file);
    });
  },
};
