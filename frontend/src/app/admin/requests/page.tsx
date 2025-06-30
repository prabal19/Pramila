'use client'

import { useState, useEffect } from 'react';
import { getAdminSupportTickets } from '@/lib/support';
import type { SupportTicket } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSupportPage() {
    const [data, setData] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const tickets = await getAdminSupportTickets();
            setData(tickets);
            setLoading(false);
        }
        fetchData();
    }, [])

    const renderSkeleton = () => (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );

    if (loading) {
       return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Support Requests</h1>
                    <p className="text-muted-foreground">Manage and respond to customer support tickets.</p>
                </div>
                {renderSkeleton()}
            </div>
       )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Support Requests</h1>
                <p className="text-muted-foreground">Manage and respond to customer support tickets.</p>
            </div>
            <DataTable 
                columns={columns} 
                data={data} 
                searchKey="userId" 
                searchPlaceholder="Search by customer..." 
                dateFilterKey="updatedAt" 
            />
        </div>
    );
}
