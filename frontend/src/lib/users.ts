import type { User } from './types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${API_URL}/api/admin/users`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch users, status:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('getUsers error:', error);
    return [];
  }
}
