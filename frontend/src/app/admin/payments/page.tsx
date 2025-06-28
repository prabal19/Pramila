'use client'

import { useState, useEffect } from 'react';
import { getOrders } from '@/lib/orders';
import { Order } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPaymentsPage() {
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const orders = await getOrders();
            setData(orders);
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
                    <h1 className="text-3xl font-bold">View Payments</h1>
                    <p className="text-muted-foreground">A list of all payments received from orders.</p>
                </div>
                {renderSkeleton()}
            </div>
       )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">View Payments</h1>
                <p className="text-muted-foreground">A list of all payments received from orders.</p>
            </div>
            <DataTable columns={columns} data={data} searchKey="userId" searchPlaceholder="Search by customer..." dateFilterKey="createdAt"/>
        </div>
    );
}
