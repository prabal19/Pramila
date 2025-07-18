import type { Category } from './types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error('Failed to fetch categories, status:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('getCategories error:', error);
    return [];
  }
}
