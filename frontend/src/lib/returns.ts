
import type { ReturnRequest, ReturnStatus } from './types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function createReturnRequest(data: {
    userId: string;
    orderId: string;
    orderItemId: string;
    productId: string;
    reason: string;
    description?: string;
}): Promise<{ success: boolean; message: string; data?: ReturnRequest }> {
    try {
        const res = await fetch(`${API_URL}/api/returns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            cache: 'no-store',
        });
        const responseData = await res.json();
        if (!res.ok) {
            return { success: false, message: responseData.msg || 'Failed to create return request.' };
        }
        return { success: true, message: 'Return request created successfully.', data: responseData };
    } catch (error) {
        console.error('Failed to create return request:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function getUserReturns(userId: string): Promise<ReturnRequest[]> {
    if (!userId) return [];
    try {
        const res = await fetch(`${API_URL}/api/returns/user/${userId}`, { cache: 'no-store' });
        if (!res.ok) {
            console.error('Failed to fetch user returns, status:', res.status);
            return [];
        }
        return res.json();
    } catch (error) {
        console.error('getUserReturns error:', error);
        return [];
    }
}

export async function getAdminReturns(): Promise<ReturnRequest[]> {
    try {
        const res = await fetch(`${API_URL}/api/returns/admin`, { cache: 'no-store' });
        if (!res.ok) {
            console.error('Failed to fetch admin returns, status:', res.status);
            return [];
        }
        return res.json();
    } catch (error) {
        console.error('getAdminReturns error:', error);
        return [];
    }
}

export async function getReturnById(id: string): Promise<ReturnRequest | null> {
    try {
        const res = await fetch(`${API_URL}/api/returns/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error(`Error fetching return ${id}:`, error);
        return null;
    }
}

export async function updateReturnStatus(returnId: string, status: ReturnStatus): Promise<{ success: boolean; message: string; data?: ReturnRequest }> {
    try {
        const res = await fetch(`${API_URL}/api/returns/${returnId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
            cache: 'no-store',
        });
        const responseData = await res.json();
        if (!res.ok) {
            return { success: false, message: responseData.msg || 'Failed to update status.' };
        }
        return { success: true, message: 'Status updated.', data: responseData };
    } catch (error) {
        console.error('Failed to update return status:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
