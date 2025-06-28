'use client'

import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/products';
import { Product } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';

export default function AdminProductsPage() {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        const products = await getProducts();
        setData(products);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleFormClose = (refresh: boolean) => {
        setIsFormOpen(false);
        if (refresh) {
            fetchProducts();
        }
    }

    const fetchData = async () => {
        const products = await getProducts();
        setData(products);
        setLoading(false);
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
                        <h1 className="text-3xl font-bold">Manage Products</h1>
                        <p className="text-muted-foreground">A list of all products in your store.</p>
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
                    <h1 className="text-3xl font-bold">Manage Products</h1>
                    <p className="text-muted-foreground">A list of all products in your store.</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>
            <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search by name..." dateFilterKey="createdAt" />
            {isFormOpen && (
                <ProductForm
                    open={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    onFormSubmit={handleFormClose}
                />
            )}
        </div>
    );
}
