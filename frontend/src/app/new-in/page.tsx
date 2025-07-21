
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import PageBannerContainer from '@/components/PageBannerContainer';
import ProductGrid from '@/components/ProductGrid';

export default async function NewInPage() {
  const [allProducts, allCategories] = await Promise.all([getProducts(), getCategories()]);

  const products = allProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <PageBannerContainer page="new-in" position="top-of-page" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-headline text-center mb-8" style={{fontFamily: "'Cormorant Garamond', serif"}}>
          New In
        </h1>

        <ProductGrid products={products} allCategories={allCategories} defaultSort="newest" showCategoryFilter={true} />
      </div>
      <PageBannerContainer page="new-in" position="bottom-of-page" />
    </>
  );
}
