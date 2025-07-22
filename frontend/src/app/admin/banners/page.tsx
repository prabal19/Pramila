
'use client'

import { useState, useEffect } from 'react';
import type { Banner } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import BannerForm from '@/components/admin/BannerForm';
import { getBanners } from '@/lib/banners';
import BannerDetailsDialog from '@/components/admin/BannerDetailsDialog';


export default function AdminBannersPage() {
    const [data, setData] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

    const fetchBanners = async () => {
        setLoading(true);
        const banners = await getBanners();
        setData(banners);
        setLoading(false);
    }

    useEffect(() => {
        fetchBanners();
    }, [])

    const handleOpenForm = (banner: Banner | null = null) => {
        setSelectedBanner(banner);
        setIsFormOpen(true);
    }
    
    const handleRowClick = (banner: Banner) => {
        setSelectedBanner(banner);
        setIsDetailsOpen(true);
    }

    const handleFormClose = (refresh: boolean) => {
        setIsFormOpen(false);
        setSelectedBanner(null);
        if (refresh) {
            fetchBanners();
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Banners</h1>
                        <p className="text-muted-foreground">Create, edit, and manage your site's banners.</p>
                    </div>
                     <Skeleton className="h-10 w-32" />
                </div>
                {renderSkeleton()}
            </div>
       )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Banners</h1>
                    <p className="text-muted-foreground">Create, edit, and manage your site's banners.</p>
                </div>
                <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Banner
                </Button>
            </div>
            <DataTable columns={columns({ onEdit: handleOpenForm, onRefresh: fetchBanners })} data={data} searchKey="title" searchPlaceholder="Search by title..." onRowClick={handleRowClick} />
             {isFormOpen && (
                <BannerForm
                    open={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    onFormSubmit={handleFormClose}
                    banner={selectedBanner}
                />
            )}
            {isDetailsOpen && selectedBanner && (
                <BannerDetailsDialog
                    banner={selectedBanner}
                    open={isDetailsOpen}
                    onOpenChange={setIsDetailsOpen}
                />
            )}
        </div>
    );
}
