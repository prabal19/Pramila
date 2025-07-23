
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Filter } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  products: Product[];
  allCategories: Category[];
  showCategoryFilter?: boolean;
  defaultSort?: string;
}

const PRODUCTS_PER_PAGE = 9;

export default function ProductGrid({ products, allCategories, showCategoryFilter = false, defaultSort = "featured" }: ProductGridProps) {
  const [sortOption, setSortOption] = useState(defaultSort);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const min = Math.floor(Math.min(...prices) / 1000) * 1000;
      const max = Math.ceil(Math.max(...prices) / 1000) * 1000;
      setPriceRange([min, max]);
    }
  }, [products]);
  
  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => p.sizes?.forEach(s => sizes.add(s)));
    return Array.from(sizes);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => p.sizes?.some(s => selectedSizes.includes(s)));
    }
    if (showCategoryFilter && selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    switch (sortOption) {
      case 'price-asc': return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc': return filtered.sort((a, b) => b.price - a.price);
      case 'newest': return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'featured':
      default: return filtered;
    }
  }, [products, sortOption, priceRange, selectedSizes, selectedCategories, showCategoryFilter]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
      setCurrentPage(1);
  }, [sortOption, priceRange, selectedSizes, selectedCategories]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
      const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    setTimeout(() => setIsLoading(false), 300); // Simulate loading
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    setSelectedSizes(prev => checked ? [...prev, size] : prev.filter(s => s !== size));
  };
  
  const handleCategoryChange = (slug: string, checked: boolean) => {
    setSelectedCategories(prev => checked ? [...prev, slug] : prev.filter(s => s !== slug));
  };

  const resetFilters = () => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const min = Math.floor(Math.min(...prices) / 1000) * 1000;
      const max = Math.ceil(Math.max(...prices) / 1000) * 1000;
      setPriceRange([min, max]);
    } else {
       setPriceRange([0, 50000]);
    }
    setSelectedSizes([]);
    setSelectedCategories([]);
  };
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    // Logic for creating pagination items (e.g., with ellipsis)
    // For simplicity, we'll show all page numbers for now
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
            <PaginationItem key={i}>
                <PaginationLink href="#" isActive={i === currentPage} onClick={(e) => { e.preventDefault(); handlePageChange(i); }}>
                    {i}
                </PaginationLink>
            </PaginationItem>
        );
    }
    return (
        <Pagination className="mt-12">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(Math.max(1, currentPage - 1)); }} />
                </PaginationItem>
                {pageNumbers}
                <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(Math.min(totalPages, currentPage + 1)); }}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-y py-3 gap-4">
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium gap-2">
              <Filter className="w-4 h-4" />
              SHOW FILTERS ({filteredAndSortedProducts.length})
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-8">
              {showCategoryFilter && (
                <div>
                  <h3 className="font-semibold mb-4">Category</h3>
                  <div className="space-y-2">
                    {allCategories.map(cat => (
                        <div key={cat.slug} className="flex items-center space-x-2">
                            <Checkbox id={`cat-${cat.slug}`} checked={selectedCategories.includes(cat.slug)} onCheckedChange={(checked) => handleCategoryChange(cat.slug, !!checked)} />
                            <Label htmlFor={`cat-${cat.slug}`} className="font-normal">{cat.name}</Label>
                        </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={0}
                  max={50000}
                  step={1000}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>Rs. {priceRange[0]}</span>
                    <span>Rs. {priceRange[1]}</span>
                </div>
              </div>
              {allSizes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Size</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {allSizes.map(size => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox id={`size-${size}`} checked={selectedSizes.includes(size)} onCheckedChange={(checked) => handleSizeChange(size, !!checked)} />
                        <Label htmlFor={`size-${size}`} className="font-normal">{size}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
             <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
                <Button variant="ghost" onClick={resetFilters}>Reset</Button>
                <Button onClick={() => setIsFilterSheetOpen(false)}>Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground uppercase text-xs">SORT BY</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-auto border-0 text-sm focus:ring-0 focus:ring-offset-0 gap-1 bg-transparent hover:bg-transparent p-0 h-auto font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[400px] w-full" />
                    <div className="space-y-2 pt-2 text-center">
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                    </div>
                </div>
            ))}
          </div>
      ) : paginatedProducts.length > 0 ? (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {renderPagination()}
        </>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-headline mb-4">No Products Found</h2>
          <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </>
  );
}
