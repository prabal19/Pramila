"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Order, OrderStatus, PopulatedUser } from '@/lib/types'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

function getStatusVariant(status: OrderStatus) {
    switch (status) {
        case 'Delivered':
            return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
        case 'Out for Delivery':
             return 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100';
        case 'Shipped':
            return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100';
        case 'Confirmed / Processing':
            return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100';
        case 'Cancelled':
        case 'Returned':
            return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
        case 'Pending':
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
    }
}

function getPaymentStatusText(status: OrderStatus) {
    switch (status) {
        case 'Delivered':
        case 'Shipped':
        case 'Out for Delivery':
        case 'Confirmed / Processing':
            return 'Paid';
        case 'Returned':
            return 'Refunded';
        case 'Cancelled':
            return 'Cancelled';
        case 'Pending':
        default:
            return 'Pending';
    }
}


export const columns: ColumnDef<Order>[] = [
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
        <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {
        const status = row.getValue("status") as OrderStatus
        return (
            <Badge variant="outline" className={cn('capitalize', getStatusVariant(status))}>
                {getPaymentStatusText(status)}
            </Badge>
        )
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <div>
        <DataTableColumnHeader column={column} title="Amount" />
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return <div className="font-medium">Rs. {amount.toLocaleString('en-IN')}</div>
    },
  },
]
