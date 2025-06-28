import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { notFound } from 'next/navigation';
import PageBannerContainer from '@/components/PageBannerContainer';

function formatCollectionName(slug: string) {
    if (slug === 'indian-clothing') {
        return "Modern Indian";
    }
    return notFound();
}

type CollectionPageProps = {
  params: {
    slug: string;
  };
};

export default async function CollectionPage({ params }: CollectionPageProps) {
    const products = await getProducts();
    const collectionName = formatCollectionName(params.slug);

  return (
    <>
      <PageBannerContainer page={params.slug} position="top-of-page" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-headline text-center mb-8" style={{fontFamily: "'Cormorant Garamond', serif"}}>
          {collectionName}
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-y py-3 gap-4">
          <Button variant="ghost" className="text-sm font-medium gap-2">
              <Filter className="w-4 h-4" />
              SHOW FILTERS
          </Button>
          <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground uppercase text-xs">SORT BY</span>
              <Select defaultValue="featured">
                  <SelectTrigger className="w-auto border-0 text-sm focus:ring-0 focus:ring-offset-0 gap-1 bg-transparent hover:bg-transparent p-0 h-auto font-medium">
                      <SelectValue/>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <PageBannerContainer page={params.slug} position="bottom-of-page" />
    </>
  );
}