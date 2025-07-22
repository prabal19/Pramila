
'use client'

import { useState, useEffect, useMemo } from 'react';
import { getProducts, getProductById } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { Product, Category } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShoppingBag } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import ProductDetailsDialog from '@/components/admin/ProductDetailsDialog';

export default function AdminProductsPage() {
    const [data, setData] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const [products, fetchedCategories] = await Promise.all([getProducts(), getCategories()]);
        setData(products);
        setCategories(fetchedCategories);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])
    
    const categoryFilterOptions = useMemo(() => 
        categories.map(cat => ({
            value: cat.slug,
            label: cat.name,
            icon: ShoppingBag
        })), [categories]);

    const handleOpenForm = (product: Product | null = null) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    }
    
    const handleRowClick = async (product: Product) => {
        const fullProduct = await getProductById(product.id);
        if (fullProduct) {
            setSelectedProduct(fullProduct);
            setIsDetailsOpen(true);
        }
    }

    const handleFormClose = (refresh: boolean) => {
        setIsFormOpen(false);
        setSelectedProduct(null);
        if (refresh) {
            fetchData();
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
                <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>
            <DataTable 
                columns={columns({ onEdit: handleOpenForm, onRefresh: fetchData })} 
                data={data} 
                searchKey="name" 
                searchPlaceholder="Search by name..." 
                dateFilterKey="createdAt" 
                onRowClick={handleRowClick}
                facetedFilterKey="category"
                facetedFilterOptions={categoryFilterOptions}
                facetedFilterTitle="Category"
            />
            {isFormOpen && (
                <ProductForm
                    open={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    onFormSubmit={handleFormClose}
                    product={selectedProduct}
                />
            )}
            {isDetailsOpen && selectedProduct && (
                 <ProductDetailsDialog
                    product={selectedProduct}
                    open={isDetailsOpen}
                    onOpenChange={setIsDetailsOpen}
                />
            )}
        </div>
    );
}