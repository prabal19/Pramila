
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import PageBannerContainer from '@/components/PageBannerContainer';

export default async function NewInPage() {
  const allProducts = await getProducts();
  // Sort by createdAt date, newest first
  const products = allProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <PageBannerContainer page="new-in" position="top-of-page" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-headline text-center mb-8" style={{fontFamily: "'Cormorant Garamond', serif"}}>
          New In
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-y py-3 gap-4">
          <Button variant="ghost" className="text-sm font-medium gap-2">
              <Filter className="w-4 h-4" />
              SHOW FILTERS
          </Button>
          <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground uppercase">SORT BY</span>
              <Select defaultValue="newest">
                  <SelectTrigger className="w-auto border-0 text-sm focus:ring-0 focus:ring-offset-0 gap-1 bg-transparent hover:bg-transparent p-0 h-auto font-medium">
                      <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
              </Select>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        ) : (
          <div className="text-center py-20">
              <h2 className="text-2xl font-headline mb-4">No New Products</h2>
              <p className="text-muted-foreground">Check back soon for our latest arrivals!</p>
          </div>
        )}
      </div>
      <PageBannerContainer page="new-in" position="bottom-of-page" />
    </>
  );
}
