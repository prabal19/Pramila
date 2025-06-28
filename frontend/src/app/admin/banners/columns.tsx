
"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Banner } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { MoreHorizontal, Trash2, Edit, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { deleteBanner, updateBanner } from "@/actions/banners"
import { useToast } from "@/hooks/use-toast"

const StatusToggle = ({ banner, onRefresh }: { banner: Banner, onRefresh: () => void }) => {
    const { toast } = useToast();
    
    const handleToggle = async (isActive: boolean) => {
        const result = await updateBanner(banner._id, { isActive });
        if(result.success) {
            toast({ title: "Success", description: `Banner has been ${isActive ? 'activated' : 'deactivated'}.` });
            onRefresh();
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
        }
    };
    
    return <Switch checked={banner.isActive} onCheckedChange={handleToggle} aria-label="Toggle banner status" />
}

const ActionsCell = ({ banner, onEdit, onRefresh }: { banner: Banner, onEdit: (banner: Banner) => void, onRefresh: () => void }) => {
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this banner?')) return;
        
        const result = await deleteBanner(banner._id);
        if(result.success) {
            toast({ title: "Success", description: "Banner deleted successfully." });
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
                <DropdownMenuItem onClick={() => onEdit(banner)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export const columns = ({ onEdit, onRefresh }: { onEdit: (banner: Banner) => void, onRefresh: () => void }): ColumnDef<Banner>[] => [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
        const imageUrl = row.original.imageUrl;
        return imageUrl ? (
            <Image
                alt={row.original.title || "Banner Image"}
                className="aspect-video rounded-md object-cover"
                height="40"
                src={imageUrl}
                width="80"
            />
        ) : (
            <div className="aspect-video w-[80px] h-[40px] bg-muted rounded-md flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No Image</span>
            </div>
        )
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: "targetPages",
    header: "Target Pages",
    cell: ({ row }) => <span className="capitalize">{(row.getValue("targetPages") as string[]).join(', ')}</span>,
  },
  {
    accessorKey: "position",
    header: "Position",
     cell: ({ row }) => <span className="capitalize">{(row.getValue("position") as string).replace('-', ' ')}</span>,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusToggle banner={row.original} onRefresh={onRefresh} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell banner={row.original} onEdit={onEdit} onRefresh={onRefresh} />,
  },
]
