
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import PageBannerContainer from '@/components/PageBannerContainer';
import ProductGrid from '@/components/ProductGrid';

export default async function BestsellersPage() {
  const [allProducts, allCategories] = await Promise.all([getProducts(), getCategories()]);
  const products = allProducts.filter(p => p.bestseller);

  return (
    <>
      <PageBannerContainer page="bestsellers" position="top-of-page" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-headline text-center mb-8" style={{fontFamily: "'Cormorant Garamond', serif"}}>
          Bestsellers
        </h1>

        <ProductGrid products={products} allCategories={allCategories} showCategoryFilter={true} />
      </div>
      <PageBannerContainer page="bestsellers" position="bottom-of-page" />
    </>
  );
}
