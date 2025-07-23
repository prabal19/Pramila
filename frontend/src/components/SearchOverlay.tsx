
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import type { Product, Category } from '@/lib/types';
import { Separator } from './ui/separator';

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (open) {
                setIsLoading(true);
                const [products, categories] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);
                setAllProducts(products);
                setAllCategories(categories);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [open]);

    const filteredProducts = searchTerm.length > 1
        ? allProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];
    
    const popularSearches = allCategories.sort(() => 0.5 - Math.random()).slice(0, 4);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 top-0 translate-y-0 max-w-full w-full h-full sm:h-auto sm:max-h-[80vh] flex flex-col rounded-none border-0 border-b bg-white shadow-lg data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top">
                <div className="container mx-auto px-4 py-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 text-lg border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary h-auto pb-4 bg-transparent"
                        />
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8">
                                <X className="h-6 w-6" />
                            </Button>
                        </DialogClose>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-4 pb-8">
                       {searchTerm.length <= 1 ? (
                         <div>
                            <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">Popular searches</h3>
                            <div className="flex flex-col items-start gap-3">
                                {popularSearches.map(cat => (
                                    <Link key={cat.slug} href={`/shop/${cat.slug}`} className="text-lg hover:underline" onClick={() => onOpenChange(false)}>
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                       ) : isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                       ) : filteredProducts.length > 0 ? (
                            <div>
                                 <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">Products</h3>
                                 <div className="space-y-4">
                                    {filteredProducts.map(product => (
                                        <Link key={product.id} href={`/product/${product.id}`} className="flex items-center gap-4 group" onClick={() => onOpenChange(false)}>
                                            <Image src={product.images[0]} alt={product.name} width={64} height={80} className="object-cover rounded-md" />
                                            <div>
                                                <p className="font-semibold group-hover:underline">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">Rs. {product.price.toLocaleString('en-IN')}</p>
                                            </div>
                                        </Link>
                                    ))}
                                 </div>
                            </div>
                       ) : (
                            <p className="text-center text-muted-foreground">No results found for &quot;{searchTerm}&quot;</p>
                       )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
