"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns'
import type { Order, OrderStatus, PopulatedUser } from '@/lib/types'
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { updateOrderStatus } from "@/actions/orders"


const StatusUpdater = ({ order, onRefresh }: { order: Order; onRefresh: () => void }) => {
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const orderStatuses: OrderStatus[] = ['Pending', 'Confirmed / Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click event
        setIsSaving(true);
        const result = await updateOrderStatus(order._id, currentStatus);
        setIsSaving(false);
        if (result.success) {
            toast({ title: "Success", description: "Order status updated." });
            onRefresh();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
            setCurrentStatus(order.status); // Revert on failure
        }
    };
    
    const handleSelectClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click event
    }

    return (
        <div className="flex items-center gap-2" onClick={handleSelectClick}>
            <Select value={currentStatus} onValueChange={(value) => setCurrentStatus(value as OrderStatus)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    {orderStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button size="sm" onClick={handleSave} disabled={isSaving || currentStatus === order.status}>
                {isSaving ? 'Saving...' : 'Save'}
            </Button>
        </div>
    );
};



export const columns = ({ onRefresh }: { onRefresh: () => void }): ColumnDef<Order>[] => [
  {
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-medium text-xs">#{(row.getValue("_id") as string).slice(-6).toUpperCase()}</span>
  },
  {
    accessorKey: "userId",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
        const user = row.getValue("userId") as PopulatedUser;
        return (
             <div>
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
        )
    },
    filterFn: (row, id, value) => {
        const user = row.getValue("userId") as PopulatedUser;
        const searchTerm = (value as string).toLowerCase();
        return user.firstName.toLowerCase().includes(searchTerm) || 
               user.lastName.toLowerCase().includes(searchTerm) || 
               user.email.toLowerCase().includes(searchTerm);
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => format(new Date(row.getValue("createdAt") as string), 'MMM d, yyyy'),
    filterFn: (row, id, value) => {
        const date = new Date(row.getValue(id) as string);
        const { from, to } = value as { from?: Date; to?: Date };
        
        if (from && !to) {
          const fromDate = new Date(from);
          fromDate.setHours(0, 0, 0, 0);
          return date >= fromDate;
        } else if (!from && to) {
          const toDate = new Date(to);
          toDate.setHours(23, 59, 59, 999);
          return date <= toDate;
        } else if (from && to) {
          const fromDate = new Date(from);
          fromDate.setHours(0, 0, 0, 0);
          const toDate = new Date(to);
          toDate.setHours(23, 59, 59, 999);
          return date >= fromDate && date <= toDate;
        }
        return true;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusUpdater order={row.original} onRefresh={onRefresh} />,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <div className="text-right">
        <DataTableColumnHeader column={column} title="Total" />
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return <div className="text-right font-medium">Rs. {amount.toLocaleString('en-IN')}</div>
    },
  },
]
