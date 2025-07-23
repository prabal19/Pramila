
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { getProductsByIds } from '@/lib/products';
import type { Product, CartItem as CartItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShieldCheck, Truck, CreditCard, Bell, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { subscribeToNewsletter } from '@/actions/newsletter';
import { useRouter } from 'next/navigation';


type EnrichedCartItem = Product & { 
  quantity: number; 
  size: string;
  cartItemId: string;
};

const newsletterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});


function CartItem({ item, updateQuantity, removeFromCart }: { item: EnrichedCartItem; updateQuantity: (itemId: string, quantity: number) => void; removeFromCart: (itemId: string) => void; }) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="relative h-32 w-24 flex-shrink-0">
        <Image src={item.images[0]} alt={item.name} fill className="object-cover rounded-md" />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
        <p className="text-lg font-semibold mt-2">Rs. {item.price.toLocaleString('en-IN')}</p>
         <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} disabled={item.quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm">{item.quantity}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
           <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.cartItemId)}>
              <Trash2 className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, cartCount, updateQuantity, removeFromCart, isLoading: isCartLoading,clearBuyNowItem } = useCart();
  const [products, setProducts] = useState<EnrichedCartItem[]>([]);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const { toast } = useToast();
    const router = useRouter();

  const form = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { name: '', email: '' },
  });

  const handleSubscribe = async (values: z.infer<typeof newsletterSchema>) => {
    const result = await subscribeToNewsletter(values);
    if (result.success) {
      toast({
        title: 'Subscription Successful!',
        description: "We'll notify you of price drops.",
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Subscription Failed',
        description: result.message,
      });
    }
  };
    const handleProceedToCheckout = () => {
      clearBuyNowItem();
      router.push('/checkout');
  }

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (cart.length > 0) {
        setIsProductLoading(true);
        const productIds = cart.map(item => item.productId);
        const fetchedProducts = await getProductsByIds(productIds);
        
        const enrichedItems = cart.map(cartItem => {
          const product = fetchedProducts.find(p => p.id === cartItem.productId);
          return { 
            ...product!, 
            quantity: cartItem.quantity,
            size: cartItem.size,
            cartItemId: cartItem._id
          };
        }).filter(item => item.id);

        setProducts(enrichedItems);
        setIsProductLoading(false);
      } else {
        setProducts([]);
        setIsProductLoading(false);
      }
    };

    if (!isCartLoading) {
        fetchCartProducts();
    }
  }, [cart, isCartLoading]);

  const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const isLoading = isCartLoading || isProductLoading;

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl font-headline mb-8">Shopping Cart</h1>
        
        {isLoading ? (
            <p>Loading cart...</p>
        ) : cartCount === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border">
            <h2 className="text-2xl font-headline mb-4">Your cart is empty</h2>
            <Button asChild>
                <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg border space-y-6">
                
                <div className="divide-y">
                    {products.map(item => (
                        <CartItem key={item.cartItemId} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
                    ))}
                </div>

                <Separator />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="border rounded-lg p-4 flex flex-col items-center">
                        <ShieldCheck className="w-8 h-8 text-primary mb-2" />
                        <h4 className="font-semibold text-sm">Purity Guaranteed</h4>
                        <p className="text-xs text-muted-foreground">on every online purchases</p>
                    </div>
                     <div className="border rounded-lg p-4 flex flex-col items-center">
                        <Truck className="w-8 h-8 text-primary mb-2" />
                        <h4 className="font-semibold text-sm">Secure Delivery</h4>
                        <p className="text-xs text-muted-foreground">by our trusted partners</p>
                    </div>
                     <div className="border rounded-lg p-4 flex flex-col items-center">
                        <CreditCard className="w-8 h-8 text-primary mb-2" />
                        <h4 className="font-semibold text-sm">Easy & Secure Payments</h4>
                        <p className="text-xs text-muted-foreground">backed by the trust of TATA</p>
                    </div>
                </div>

                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Bell className="w-5 h-5"/> Get Price Drop Alerts on Your Cart Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Be the first to know when prices on your favourite items drop. Just enter your details below.</p>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleSubscribe)} className="flex flex-col sm:flex-row gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem className="flex-grow"><FormControl><Input placeholder="Name" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem className="flex-grow"><FormControl><Input type="email" placeholder="Email Address" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Subscribing...' : 'Get Alerts'}
                            </Button>
                          </form>
                        </Form>
                        <p className="text-xs text-muted-foreground mt-2">We'll notify you when price drops on your selected items.</p>
                    </CardContent>
                </Card>

            </div>

            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Delivery Details</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <Button variant="outline" className="flex items-center gap-2 flex-grow-0">
                            <Image src="https://flagcdn.com/w20/in.png" width={16} height={12} alt="Indian Flag" />
                            IN
                            <ChevronDown className="h-4 w-4 opacity-50"/>
                        </Button>
                        <div className="relative flex-grow">
                             <Input placeholder="Enter Pincode" />
                             <Button variant="link" className="absolute right-0 top-0 h-full">Check</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Apply Coupon code / Promo Code</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex gap-2">
                                        <Input placeholder="Enter Coupon Code" />
                                        <Button>Apply</Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <Separator />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Sub Total</span>
                                <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span className="text-green-600">- Rs. 0</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Delivery Charge</span>
                                <span className="text-green-600">FREE</span>
                            </div>
                            <Separator />
                             <div className="flex justify-between font-bold text-base">
                                <span>TOTAL (Incl of all Taxes.)</span>
                                <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
                            </div>
                              <div className="flex justify-between text-green-600 font-semibold">
                                <span>You Save</span>
                                <span>+ Rs. 0</span>
                            </div>
                        </div>
                        <Button size="lg" className="w-full" onClick={handleProceedToCheckout}>
                           Proceed to Checkout
                        </Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
