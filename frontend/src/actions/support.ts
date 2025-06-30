'use server';

import * as z from 'zod';
import type { SupportTicket, SupportTicketStatus } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const createTicketSchema = z.object({
    userId: z.string().min(1),
    subject: z.string().min(3, 'Subject must be at least 3 characters.'),
    category: z.string().min(1, 'Category is required.'),
    orderId: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export async function createSupportTicket(values: z.infer<typeof createTicketSchema>): Promise<{ success: boolean; message: string; data?: SupportTicket }> {
    try {
        const validatedValues = createTicketSchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, message: 'Invalid input.' };
        }

        const res = await fetch(`${API_URL}/api/support`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to create ticket.' };
        }
        revalidatePath('/support');
        return { success: true, message: 'Support ticket created successfully.', data };
    } catch (error) {
        console.error('createSupportTicket error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

const addMessageSchema = z.object({
    sender: z.enum(['user', 'support']),
    senderName: z.string(),
    message: z.string().min(1, 'Message cannot be empty.'),
});

export async function addMessageToTicket(ticketId: string, values: z.infer<typeof addMessageSchema>): Promise<{ success: boolean; message: string; data?: SupportTicket }> {
    try {
        const validatedValues = addMessageSchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, message: 'Invalid input.' };
        }

        const res = await fetch(`${API_URL}/api/support/${ticketId}/message`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });
        
        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to add message.' };
        }
        revalidatePath(`/support`);
        revalidatePath(`/admin/requests`);
        return { success: true, message: 'Message sent.', data };
    } catch (error) {
        console.error('addMessageToTicket error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function updateTicketStatus(ticketId: string, status: SupportTicketStatus): Promise<{ success: boolean; message: string; data?: SupportTicket }> {
     try {
        const res = await fetch(`${API_URL}/api/support/${ticketId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
            cache: 'no-store',
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to update status.' };
        }
        revalidatePath('/admin/requests');
        return { success: true, message: 'Ticket status updated.', data };
     } catch (error) {
        console.error('updateTicketStatus error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
     }
}
