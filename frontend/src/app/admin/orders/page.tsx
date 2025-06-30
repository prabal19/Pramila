'use client'

import { useState, useEffect, useCallback } from 'react';
import { getOrders } from '@/lib/orders';
import { Order } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminOrdersPage() {
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const orders = await getOrders();
        setData(orders);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const renderSkeleton = () => (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );

    if (loading && data.length === 0) {
       return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Manage Orders</h1>
                    <p className="text-muted-foreground">A list of all orders placed in your store.</p>
                </div>
                {renderSkeleton()}
            </div>
       )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Manage Orders</h1>
                <p className="text-muted-foreground">A list of all orders placed in your store.</p>
            </div>
            <DataTable 
              columns={columns({ onRefresh: fetchData })} 
              data={data} 
              searchKey="userId" 
              searchPlaceholder="Search by customer..." 
              dateFilterKey="createdAt" 
            />
        </div>
    );
}
