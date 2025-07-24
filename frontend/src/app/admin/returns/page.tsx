
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdminReturns, updateReturnStatus,getReturnById } from '@/lib/returns';
import { ReturnRequest, ReturnStatus } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';
import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns'
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PopulatedUser } from '@/lib/types';
import Image from 'next/image';
import ReturnDetailsDialog from '@/components/admin/ReturnDetailsDialog';

const StatusUpdater = ({ returnRequest, onRefresh }: { returnRequest: ReturnRequest; onRefresh: () => void }) => {
    const [currentStatus, setCurrentStatus] = useState<ReturnStatus>(returnRequest.status);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const returnStatuses: ReturnStatus[] = ['Pending Approval', 'Approved', 'Rejected', 'Item Picked Up', 'Refunded'];

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation(); 
        setIsSaving(true);
        const result = await updateReturnStatus(returnRequest._id, currentStatus);
        setIsSaving(false);
        if (result.success) {
            toast({ title: "Success", description: "Return status updated." });
            onRefresh();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
            setCurrentStatus(returnRequest.status);
        }
    };
    
    const handleSelectClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    return (
        <div className="flex items-center gap-2" onClick={handleSelectClick}>
            <Select value={currentStatus} onValueChange={(value) => setCurrentStatus(value as ReturnStatus)}>
                <SelectTrigger className="w-[200px] h-9">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    {returnStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button size="sm" onClick={handleSave} disabled={isSaving || currentStatus === returnRequest.status}>
                {isSaving ? '...' : 'Save'}
            </Button>
        </div>
    );
};

export const columns = (onRefresh: () => void): ColumnDef<ReturnRequest>[] => [
    {
        accessorKey: "returnId",
        header: "Return ID",
        cell: ({ row }) => <span className="font-medium text-xs">#RTN{row.getValue("returnId")}</span>
    },
    {
        accessorKey: "userId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
        cell: ({ row }) => {
            const user = row.original.userId as PopulatedUser;
            return (
                <div>
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "productId",
        header: "Product",
        cell: ({ row }) => {
            const product = row.original.productId;
            return (
                <div className="flex items-center gap-2">
                    {product.images?.[0] && <Image src={product.images[0]} alt={product.name} width={40} height={40} className="rounded-sm" />}
                    <span>{product.name}</span>
                </div>
            );
        }
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ row }) => format(new Date(row.getValue("createdAt") as string), 'MMM d, yyyy'),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <StatusUpdater returnRequest={row.original} onRefresh={onRefresh} />,
    },
];

export default function AdminReturnsPage() {
    const [data, setData] = useState<ReturnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const returns = await getAdminReturns();
        setData(returns);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRowClick = async (returnRequest: ReturnRequest) => {
        const fullDetails = await getReturnById(returnRequest._id);
        if (fullDetails) {
            setSelectedReturn(fullDetails);
            setIsDialogOpen(true);
        }
    }

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
                    <h1 className="text-3xl font-bold">Manage Returns</h1>
                    <p className="text-muted-foreground">Review and process customer return requests.</p>
                </div>
                {renderSkeleton()}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Manage Returns</h1>
                <p className="text-muted-foreground">Review and process customer return requests.</p>
            </div>
            <DataTable 
              columns={columns(fetchData)} 
              data={data} 
              searchKey="returnId" 
              searchPlaceholder="Search by return ID..." 
              onRowClick={handleRowClick}
            />
            {selectedReturn && (
                <ReturnDetailsDialog
                    returnRequest={selectedReturn}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            )}
        </div>
    );
}

