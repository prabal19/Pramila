'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminStats } from '@/actions/admin';
import { ShoppingBag, Box } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


export default function AdminDashboardPage() {
    const [stats, setStats] = useState<{ productCount: number; orderCount: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const result = await getAdminStats();
            if (result.success) {
                setStats(result.data);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Box className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-8 w-1/2" />
                        ) : (
                            <div className="text-2xl font-bold">{stats?.productCount ?? 0}</div>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-8 w-1/2" />
                        ) : (
                           <div className="text-2xl font-bold">{stats?.orderCount ?? 0}</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
