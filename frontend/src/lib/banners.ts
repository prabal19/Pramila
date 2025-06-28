import type { Banner } from './types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(`${API_URL}/api/banners`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch banners, status:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('getBanners error:', error);
    return [];
  }
}
