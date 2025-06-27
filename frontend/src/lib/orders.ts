import type { Order } from './types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_URL}/api/orders`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch orders, status:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('getOrders error:', error);
    return [];
  }
}
