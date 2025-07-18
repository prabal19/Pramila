import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { notFound } from 'next/navigation';
import PageBannerContainer from '@/components/PageBannerContainer';
import ProductGrid from '@/components/ProductGrid';
import type { Category, Product } from '@/lib/types';

async function getCategory(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  const category = categories.find(c => c.slug === slug);
  return category || null;
}

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = params;

  const [category, allProducts] = await Promise.all([
    getCategory(categorySlug),
    getProducts()
  ]);

  if (!category) {
    notFound();
  }
  
  const products = allProducts.filter(p => p.category === categorySlug);
  const allCategories = await getCategories();

  return (
    <>
      <PageBannerContainer page={categorySlug} position="top-of-page" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-headline text-center mb-8" style={{fontFamily: "'Cormorant Garamond', serif"}}>
          {category.name}
        </h1>
        <ProductGrid products={products} allCategories={allCategories} />
      </div>
      <PageBannerContainer page={categorySlug} position="bottom-of-page" />
    </>
  );
}

// Generate static paths for all categories
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}
