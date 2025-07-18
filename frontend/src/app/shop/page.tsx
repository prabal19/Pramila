import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import PageBannerContainer from '@/components/PageBannerContainer';
import ProductGrid from '@/components/ProductGrid';

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <PageBannerContainer page="shop" position="top-of-page" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-headline text-center mb-8" style={{fontFamily: "'Cormorant Garamond', serif"}}>
          All Products
        </h1>
        <ProductGrid products={products} allCategories={categories} showCategoryFilter={true} />
      </div>
      <PageBannerContainer page="shop" position="bottom-of-page" />
    </>
  );
}
