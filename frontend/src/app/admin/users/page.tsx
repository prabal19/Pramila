'use client'

import { useState, useEffect } from 'react';
import { getUsers } from '@/lib/users';
import { User } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUsersPage() {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const users = await getUsers();
            setData(users);
            setLoading(false);
        }
        fetchData();
    }, [])
    
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
                    <h1 className="text-3xl font-bold">Manage Users</h1>
                    <p className="text-muted-foreground">A list of all registered users.</p>
                </div>
                {renderSkeleton()}
            </div>
       )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Manage Users</h1>
                <p className="text-muted-foreground">A list of all registered users.</p>
            </div>
            <DataTable columns={columns} data={data} searchKey="email" searchPlaceholder="Search by email..." dateFilterKey="date"/>
        </div>
    );
}
