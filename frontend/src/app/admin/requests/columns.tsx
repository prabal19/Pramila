"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns'
import type { Request as SupportRequest, PopulatedUser, RequestStatus } from '@/lib/types'
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

function getStatusVariant(status: RequestStatus) {
    switch (status) {
        case 'Open': return 'bg-green-100 text-green-800 border-green-200';
        case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'New Subscriber': return 'bg-blue-100 text-blue-800 border-blue-200';
        default: return 'secondary';
    }
}

export const columns: ColumnDef<SupportRequest>[] = [
  {
    accessorKey: "ticketId",
    header: "Request ID",
    cell: ({ row }) => <span className="font-medium">#{row.getValue("ticketId")}</span>
  },
  {
    accessorKey: "contactName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Requester" />,
    cell: ({ row }) => {
        return (
             <div>
                <div className="font-medium">{row.getValue("contactName")}</div>
                <div className="text-xs text-muted-foreground">{row.original.contactEmail}</div>
            </div>
        )
    },
  },
  {
    accessorKey: "subject",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subject" />,
    cell: ({ row }) => <div className="max-w-[250px] truncate">{row.getValue("subject")}</div>
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const variant = type === 'Support' ? 'destructive' : type === 'Contact' ? 'secondary' : 'default';
        return <Badge variant={variant} className="capitalize">{type}</Badge>
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    },
  },
   {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
        const status = row.getValue("status") as RequestStatus;
        return <Badge variant="outline" className={cn('capitalize', getStatusVariant(status))}>{status}</Badge>
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <div><DataTableColumnHeader column={column} title="Last Updated" /></div>,
    cell: ({ row }) => <div>{format(new Date(row.getValue("updatedAt") as string), 'MMM d, yyyy')}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
        <Button asChild variant="secondary" size="sm">
            <Link href={`/admin/requests/${row.original._id}`}>
                View <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
    )
  },
]
