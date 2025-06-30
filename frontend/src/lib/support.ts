import type { SupportTicket } from './types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
  try {
    const res = await fetch(`${API_URL}/api/support/user/${userId}`, { cache: 'no-store' });
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

export async function getAdminSupportTickets(): Promise<SupportTicket[]> {
  try {
    const res = await fetch(`${API_URL}/api/support/admin`, { cache: 'no-store' });
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


export async function getTicketById(ticketId: string): Promise<SupportTicket | null> {
  try {
    const res = await fetch(`${API_URL}/api/support/${ticketId}`, { cache: 'no-store' });
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
