
'use client'

import { useState, useEffect, useCallback } from 'react';
import { getAdminOrders, getOrderById } from '@/lib/orders';
import { Order } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';
import OrderDetailsDialog from '@/components/admin/OrdersDetailsDialog';

export default function AdminOrdersPage() {
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const orders = await getAdminOrders();
        setData(orders);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const handleRowClick = async (order: Order) => {
        const fullOrderDetails = await getOrderById(order._id);
        if (fullOrderDetails) {
            setSelectedOrder(fullOrderDetails);
            setIsDialogOpen(true);
        }
    };

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
              onRowClick={handleRowClick}
            />
            {selectedOrder && (
                <OrderDetailsDialog
                    order={selectedOrder}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            )}
        </div>
    );
}
