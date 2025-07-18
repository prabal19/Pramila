
'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function uploadImage(formData: FormData): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.msg || 'Upload failed.' };
    }

    return { success: true, message: 'Image uploaded successfully.', url: data.url };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An unexpected error occurred during upload.' };
  }
}
