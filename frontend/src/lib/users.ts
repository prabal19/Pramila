
import type { User, Order } from './types';
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

export async function getUserDetails(userId: string): Promise<{ user: User; orders: Order[] } | null> {
    try {
        const res = await fetch(`${API_URL}/api/admin/user-details/${userId}`, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`Failed to fetch details for user ${userId}, status: ${res.status}`);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error(`getUserDetails error for id ${userId}:`, error);
        return null;
    }
}
