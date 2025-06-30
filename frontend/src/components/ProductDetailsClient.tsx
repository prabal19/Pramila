"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useViewedProducts } from '@/hooks/use-viewed-products';
import { useCart } from '@/hooks/use-cart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shirt, MessageCircle } from 'lucide-react';
import { SizeChartDialog } from './SizeChartDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RelatedProducts from './RelatedProducts';
import ProductReviews from './ProductReviews';
import { useRouter } from 'next/navigation';

const ProductDetailsClient = ({ product }: { product: Product }) => {
  const { addViewedProduct } = useViewedProducts();
  const { addToCart } = useCart();
  const router = useRouter(); 
  const availableSizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'CUSTOM SIZE'];

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);


  useEffect(() => {
    addViewedProduct(product.id);
    setSelectedImage(product.images[0]);
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [product, addViewedProduct, availableSizes]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedSize);
  };

    const handleBuyNow = () => {
    addToCart(product.id, quantity, selectedSize);
    router.push('/checkout');
  };

  function getCategoryTitle(slug: string): string {
     if (!slug) return '';
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  const washInstructions = "To maintain the beauty of your handcrafted garment, we recommend dry cleaning only. Avoid direct exposure to sunlight for prolonged periods. Store in a cool, dry place."

  return (
    <>
      <SizeChartDialog open={isSizeChartOpen} onOpenChange={setIsSizeChartOpen} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-row md:flex-row gap-4">
            <div className="flex-col gap-3 shrink-0 order-first hidden sm:flex">
              {product.images.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(img)} className={`w-20 h-28 relative rounded-sm overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'} transition-colors`}>
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="relative w-full aspect-[3/4]">
               <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
             <div className="flex sm:hidden flex-row gap-3 overflow-x-auto absolute bottom-4 left-4 right-4 pb-2">
              {product.images.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(img)} className={`w-16 h-24 flex-shrink-0 relative rounded-sm overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'} transition-colors`}>
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="md:sticky top-24 self-start">
            {product.bestseller && (
              <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2 tracking-widest">
                <Shirt className="w-5 h-5" />
                <span>BESTSELLER</span>
              </div>
            )}
            <Link href={`/shop/${product.category}`} className="text-sm text-muted-foreground hover:text-primary">{getCategoryTitle(product.category)}</Link>
            <h1 className="text-3xl md:text-4xl font-headline mt-1 mb-2">{product.name}</h1>
            <p className="text-2xl mb-6">Rs. {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Size: <span className="uppercase font-bold">{selectedSize}</span></p>
                  <Button variant="link" onClick={() => setIsSizeChartOpen(true)} className="text-sm underline p-0 h-auto text-muted-foreground hover:text-primary">Size chart</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-sm px-4 h-9 ${selectedSize === size ? 'bg-primary text-primary-foreground' : 'bg-white'}`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Select value={String(quantity)} onValueChange={(val) => setQuantity(Number(val))}>
                  <SelectTrigger className="w-20 rounded-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="lg" className="flex-1 rounded-sm tracking-widest border-black hover:bg-black hover:text-white" onClick={handleAddToCart}>
                  ADD TO CART
                </Button>
              </div>
              
               <Button size="lg" className="w-full rounded-sm bg-primary text-primary-foreground tracking-widest font-semibold hover:bg-primary/90" onClick={handleBuyNow}>BUY NOW</Button>
              
              <p className="text-xs text-muted-foreground">Disclaimer: This product will be shipped to you within 5-6 work from the date of order placed.</p>
              
               <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 border-b rounded-none mb-4">
                  <TabsTrigger value="description" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent hover:underline hover:text-primary transition-none pb-2">Description</TabsTrigger>
                  <TabsTrigger value="specifications" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent hover:underline hover:text-primary transition-none pb-2">Specifications</TabsTrigger>
                  <TabsTrigger value="wash" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent hover:underline hover:text-primary transition-none pb-2">Wash Instructions</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="text-sm text-muted-foreground leading-relaxed">{product.description}</TabsContent>
                <TabsContent value="specifications" className="text-sm text-muted-foreground leading-relaxed">{product.specifications || 'No specifications available.'}</TabsContent>
                <TabsContent value="wash" className="text-sm text-muted-foreground leading-relaxed">{washInstructions}</TabsContent>
              </Tabs>
              
              <div className="flex justify-end">
                  <Button variant="link" className="text-green-600 hover:text-green-700">
                      <MessageCircle className="w-5 h-5 mr-2"/>
                      Chat With Us
                  </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RelatedProducts currentProductId={product.id} />
      <ProductReviews productId={product.id} />
    </>
  );
};

export default ProductDetailsClient;
