
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Shirt, MessageCircle, Minus, Plus } from 'lucide-react';
import { SizeChartDialog } from './SizeChartDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RelatedProducts from './RelatedProducts';
import ProductReviews from './ProductReviews';
import { Input } from '@/components/ui/input';
import { Badge } from './ui/badge';
import WishlistIcon from './WishlistIcon';
import { cn } from '@/lib/utils';

const ProductDetailsClient = ({ product }: { product: Product }) => {
  const { addToCart, isUpdating, setBuyNowItem } = useCart();
  const router = useRouter();
  
  const availableSizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'CUSTOM SIZE'];

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  useEffect(() => {
    setSelectedImage(product.images[0]);
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [product, availableSizes]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedSize, { showToast: true });
    const cartSheetTrigger = document.getElementById('cart-sheet-trigger');
    if (cartSheetTrigger) {
        cartSheetTrigger.click();
    }
  };

  const handleBuyNow = () => {
    setBuyNowItem({ 
        _id: 'buy-now-item', // temporary id
        productId: product.id, 
        quantity, 
        size: selectedSize 
    });
    router.push('/checkout');
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(1);
    }
  }

  function getCategoryTitle(slug: string): string {
     if (!slug) return '';
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  const washInstructions = "To maintain the beauty of your handcrafted garment, we recommend dry cleaning only. Avoid direct exposure to sunlight for prolonged periods. Store in a cool, dry place."

  const hasDiscount = product.strikeoutPrice && product.strikeoutPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.strikeoutPrice! - product.price) / product.strikeoutPrice!) * 100)
    : 0;
  
  const isOutOfStock = product.quantity === 0;

  return (
    <>
      <SizeChartDialog open={isSizeChartOpen} onOpenChange={setIsSizeChartOpen} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-col gap-3 shrink-0 order-first hidden sm:flex">
              {product.images.map((img, index) => (
              <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-28 relative rounded-sm overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'} transition-colors`}
                  title={`View image ${index + 1} of ${product.name}`}
                  aria-label={`View image ${index + 1} of ${product.name}`}
                >
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
               <div className="absolute top-4 right-4">
                    <WishlistIcon productId={product.id} variant="button" />
                </div>
            </div>
             <div className="flex sm:hidden flex-row gap-3 overflow-x-auto absolute bottom-4 left-4 right-4 pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-24 flex-shrink-0 relative rounded-sm overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'} transition-colors`}
                  title={`View image ${index + 1} of ${product.name}`}
                  aria-label={`View image ${index + 1} of ${product.name}`}
                >
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
            {product.bestseller && !isOutOfStock && (
              <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2 tracking-widest">
                <Shirt className="w-5 h-5" />
                <span>BESTSELLER</span>
              </div>
            )}
            <Link href={`/shop/${product.category}`} className="text-sm text-muted-foreground hover:text-primary">{getCategoryTitle(product.category)}</Link>
            <h1 className={cn("text-3xl md:text-4xl font-headline mt-1 mb-2", isOutOfStock && "line-through text-muted-foreground")}>{product.name}</h1>
             {isOutOfStock && <p className="text-xl font-bold text-destructive mb-2">OUT OF STOCK</p>}
            <div className="flex items-baseline gap-4 mb-6">
                <p className="text-2xl font-semibold">Rs. {product.price.toLocaleString('en-IN')}</p>
                {hasDiscount && (
                    <>
                        <p className="text-lg text-muted-foreground line-through">Rs. {product.strikeoutPrice!.toLocaleString('en-IN')}</p>
                        <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                            {discountPercentage}% OFF
                        </Badge>
                    </>
                )}
            </div>

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
                      disabled={isOutOfStock}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center border rounded-sm">
                  <Button aria-label="Decrease quantity" variant="ghost" size="icon" className="h-full rounded-r-none" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1 || isOutOfStock}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    aria-label="Product quantity"
                    className="w-16 h-full text-center border-x border-y-0 focus-visible:ring-0 rounded-none hide-arrows [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     disabled={isOutOfStock}
                  />
                  <Button aria-label="Increase quantity" variant="ghost" size="icon" className="h-full rounded-l-none" onClick={() => setQuantity(q => q + 1)} disabled={isOutOfStock}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="outline" size="lg" className={cn("flex-1 rounded-sm tracking-widest border-black hover:bg-black hover:text-white", isOutOfStock && "bg-gray-300 border-gray-300 text-gray-500 hover:bg-gray-300 hover:text-gray-500 cursor-not-allowed")} onClick={handleAddToCart} disabled={isOutOfStock|| isUpdating}>
                  ADD TO CART
                </Button>
              </div>
              
              <Button size="lg" className={cn("w-full rounded-sm bg-primary text-primary-foreground tracking-widest font-semibold hover:bg-primary/90", isOutOfStock && "bg-gray-400 hover:bg-gray-400 cursor-not-allowed")} onClick={handleBuyNow} disabled={isOutOfStock|| isUpdating}>
                {isOutOfStock ? "OUT OF STOCK" : "BUY NOW"}
              </Button>
              
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
