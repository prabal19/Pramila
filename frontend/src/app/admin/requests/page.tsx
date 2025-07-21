'use client'

import { useState, useEffect } from 'react';
import { getAdminRequests } from '@/lib/requests';
import type { Request as SupportRequest } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { CheckCircle, Mail, MessageSquare } from 'lucide-react';

const requestTypes = [
  { value: 'Support', label: 'Support', icon: MessageSquare },
  { value: 'Contact', label: 'Contact', icon: Mail },
  { value: 'Newsletter', label: 'Newsletter', icon: CheckCircle },
]

export default function AdminSupportPage() {
    const [data, setData] = useState<SupportRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const tickets = await getAdminRequests();
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
                    <h1 className="text-3xl font-bold">Requests</h1>
                    <p className="text-muted-foreground">Manage and respond to all customer requests.</p>
                </div>
                {renderSkeleton()}
            </div>
       )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Requests</h1>
                <p className="text-muted-foreground">Manage and respond to all customer requests.</p>
            </div>
            <DataTable 
                columns={columns} 
                data={data} 
                searchKey="contactName" 
                searchPlaceholder="Search by name..." 
                dateFilterKey="updatedAt"
                facetedFilterKey="type"
                facetedFilterOptions={requestTypes}
                facetedFilterTitle="Type"
            />
        </div>
    );
}
