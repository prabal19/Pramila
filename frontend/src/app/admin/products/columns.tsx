"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Product } from '@/lib/types'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { MoreHorizontal, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteProduct } from "@/actions/products"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const ActionsCell = ({ product, onEdit, onRefresh }: { product: Product, onEdit: (product: Product) => void, onRefresh: () => void }) => {
    const { toast } = useToast();

    const handleDelete = async () => {
        const result = await deleteProduct(product.id);
        if(result.success) {
            toast({ title: "Success", description: "Product deleted successfully." });
            onRefresh();
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product from the database.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                Yes, delete product
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export const columns = ({ onEdit, onRefresh }: { onEdit: (product: Product) => void, onRefresh: () => void }): ColumnDef<Product>[] => [
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
    accessorKey: "quantity",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => row.getValue("quantity"),
  },
  // {
  //   accessorKey: "bestseller",
  //   header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Bestseller" />
  //   ),
  //   cell: ({ row }) => (
  //     row.getValue("bestseller") ? (
  //       <Badge variant="outline">Yes</Badge>
  //     ) : (
  //       <Badge variant="secondary">No</Badge>
  //     )
  //   ),
  // },

  {
    accessorKey: "price",
    header: ({ column }) => (
      <div >
        <DataTableColumnHeader column={column} title="Price" />
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("price") as number
      return <div className="font-medium">Rs. {amount.toLocaleString('en-IN')}</div>
    },
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
    id: "actions",
    cell: ({ row }) => <ActionsCell product={row.original} onEdit={onEdit} onRefresh={onRefresh} />,
  },
]
