import type { Request } from './types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getUserRequests(userId: string): Promise<Request[]> {
  try {
    const res = await fetch(`${API_URL}/api/requests/user/${userId}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch user support tickets, status:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('getUserSupportTickets error:', error);
    return [];
  }
}

export async function getAdminRequests(): Promise<Request[]> {
  try {
    const res = await fetch(`${API_URL}/api/requests/admin`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch admin support tickets, status:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('getAdminSupportTickets error:', error);
    return [];
  }
}


export async function getRequestById(ticketId: string): Promise<Request | null> {
  try {
    const res = await fetch(`${API_URL}/api/requests/${ticketId}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch ticket, status:', res.status);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('getTicketById error:', error);
    return null;
  }
}
