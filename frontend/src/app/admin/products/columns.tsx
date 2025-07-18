"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Product } from '@/lib/types'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export const columns: ColumnDef<Product>[] = [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        alt={row.original.name}
        className="aspect-square rounded-md object-cover"
        height="64"
        src={row.original.images[0]}
        width="64"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
        const category = row.getValue("category") as string;
        // Capitalize and replace dash with space
        return <span className="capitalize">{category.replace(/-/g, ' ')}</span>;
    },
  },
  {
    accessorKey: "bestseller",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bestseller" />
    ),
    cell: ({ row }) => (
      row.getValue("bestseller") ? (
        <Badge variant="outline">Yes</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      )
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Added On" />
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
    accessorKey: "price",
    header: ({ column }) => (
      <div className="text-right">
        <DataTableColumnHeader column={column} title="Price" />
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("price") as number
      return <div className="text-right font-medium">Rs. {amount.toLocaleString('en-IN')}</div>
    },
  },
]
