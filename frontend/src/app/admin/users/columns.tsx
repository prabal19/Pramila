
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/lib/types"
import { format } from 'date-fns';
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date Joined" />
    ),
     cell: ({ row }) => {
        const dateValue = row.getValue("date") as string;
        if (!dateValue || isNaN(new Date(dateValue).getTime())) {
            return <span>-</span>;
        }
        return format(new Date(dateValue), 'MMM d, yyyy');
     },
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
    accessorKey: "_id",
    header: "User ID",
  },
]
