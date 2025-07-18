
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

interface ProductGridProps {
  products: Product[];
  allCategories: Category[];
  showCategoryFilter?: boolean;
  defaultSort?: string;
}

export default function ProductGrid({ products, allCategories, showCategoryFilter = false, defaultSort = "featured" }: ProductGridProps) {
  const [sortOption, setSortOption] = useState(defaultSort);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    // Find min and max price from the initial product list to set slider bounds
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

    // Apply filters
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => p.sizes?.some(s => selectedSizes.includes(s)));
    }
    
    if (showCategoryFilter && selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'featured':
      default:
        return filtered; // or any default sorting logic
    }
  }, [products, sortOption, priceRange, selectedSizes, selectedCategories, showCategoryFilter]);

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

      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-headline mb-4">No Products Found</h2>
          <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </>
  );
}
