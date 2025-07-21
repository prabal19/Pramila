
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { getProductsByIds } from '@/lib/products';
import { createOrder } from '@/actions/orders';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

type EnrichedCartItem = Product & {
  quantity: number;
  size: string;
  cartItemId: string;
};

const CheckoutStep = ({ number, label, active, completed }: { number: number; label: string; active: boolean; completed: boolean; }) => (
  <div className="flex flex-col items-center gap-2 flex-1">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${active ? 'bg-primary text-primary-foreground border-primary' : completed ? 'bg-primary/20 text-primary border-primary' : 'bg-gray-200 text-gray-500 border-gray-300'}`}>
       {completed ? <Check className="w-5 h-5" /> : number}
    </div>
    <span className={`text-xs text-center sm:text-sm font-medium ${active || completed ? 'text-primary' : 'text-gray-500'}`}>{label}</span>
  </div>
);


export default function PaymentPage() {
  const { cart, isLoading: isCartLoading, clearCart, shippingInfo } = useCart();
  const { user, loading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<EnrichedCartItem[]>([]);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (cart.length > 0) {
        setIsProductLoading(true);
        const productIds = cart.map(item => item.productId);
        const fetchedProducts = await getProductsByIds(productIds);

        const enrichedItems = cart.map(cartItem => {
          const product = fetchedProducts.find(p => p.id === cartItem.productId);
          return { ...product!, quantity: cartItem.quantity, size: cartItem.size, cartItemId: cartItem._id };
        }).filter(item => item.id);

        setProducts(enrichedItems);
        setIsProductLoading(false);
      } else {
        setProducts([]);
        setIsProductLoading(false);
      }
    };

    if (!isCartLoading) fetchCartProducts();
  }, [cart, isCartLoading]);
  
  useEffect(() => {
     if (!isCartLoading && !isAuthLoading) {
        if (cart.length === 0) {
            router.replace('/shop');
        } else if (!shippingInfo) {
            router.replace('/checkout');
        }
    }
  }, [isCartLoading, isAuthLoading, cart.length, router, shippingInfo]);


  const handleMakePayment = async () => {
    if (!user) {
        toast({
            title: "Authentication Error",
            description: "Something went wrong, user not found.",
            variant: "destructive"
        });
        router.push('/checkout');
        return;
    }
    
    if (products.length === 0 || !shippingInfo) return;

    setIsProcessing(true);
    
    const orderItems = products.map(p => ({
        productId: p.id,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        size: p.size,
    }));
    
    const totalAmount = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await createOrder({
        userId: user._id,
        items: orderItems,
        totalAmount,
        shippingAddress: shippingInfo.address,
    });

    setIsProcessing(false);

    if (result.success && result.data) {
        toast({ title: "Order Placed!", description: "Your order has been placed successfully."});
        clearCart();
        router.push(`/checkout/confirmation?orderId=${result.data._id}`);
    } else {
        toast({ variant: 'destructive', title: "Order Failed", description: result.message });
    }
  }
  
  const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isLoading = isCartLoading || isProductLoading || isAuthLoading;

  if (isLoading || !shippingInfo) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
         </div>
      );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-2xl font-bold tracking-widest" style={{fontFamily: "'Cormorant Garamond', serif"}}>PRAMILA</Link>
            <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/checkout" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Shipping Details
                </Link>
            </Button>
          </div>
          
          <div className="flex items-start mb-8 p-4 border rounded-lg bg-white">
            <CheckoutStep number={1} label="Shipping Details" active={false} completed={true} />
            <div className="flex-1 mt-4"><Separator /></div>
            <CheckoutStep number={2} label="Payment" active={true} completed={false} />
            <div className="flex-1 mt-4"><Separator /></div>
            <CheckoutStep number={3} label="Order Confirmation" active={false} completed={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <Card className="lg:col-span-2 p-6">
                <CardTitle>Payment Selection</CardTitle>
                
                <div className="mt-6">
                     <h3 className="text-sm font-semibold text-muted-foreground mb-4">CHOOSE A PAYMENT METHOD</h3>
                     <Tabs defaultValue="credit-card">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="credit-card">Credit/Debit Card</TabsTrigger>
                            <TabsTrigger value="net-banking">Net Banking</TabsTrigger>
                            <TabsTrigger value="upi">UPI</TabsTrigger>
                        </TabsList>
                        <TabsContent value="credit-card" className="border rounded-b-lg p-6">
                             <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><Label htmlFor="card-number">Card Number</Label><Input id="card-number" placeholder="0000 0000 0000 0000" /></div>
                                    <div><Label htmlFor="card-name">Name on Card</Label><Input id="card-name" placeholder="Enter Your Name Here" /></div>
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div><Label htmlFor="expiry-date">Expiry Date</Label><Input id="expiry-date" placeholder="MM/YY" /></div>
                                    <div><Label htmlFor="cvv">CVV</Label><Input id="cvv" placeholder="***" type="password"/></div>
                                </div>
                             </div>
                        </TabsContent>
                         <TabsContent value="net-banking" className="border rounded-b-lg p-6 text-center">
                            <p className="text-muted-foreground">This feature is not yet available.</p>
                         </TabsContent>
                         <TabsContent value="upi" className="border rounded-b-lg p-6 text-center">
                            <p className="text-muted-foreground">This feature is not yet available.</p>
                         </TabsContent>
                     </Tabs>
                </div>

                 <div className="flex justify-between items-center mt-8 pt-6 border-t">
                    <Button variant="link" asChild className="p-0 h-auto text-muted-foreground"><Link href="/checkout"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Shipping Details</Link></Button>
                    <Button size="lg" className="w-full md:w-auto" onClick={handleMakePayment} disabled={isProcessing}>
                       {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       {isProcessing ? 'Processing...' : 'MAKE PAYMENT'}
                    </Button>
                </div>

            </Card>

            <div className="lg:col-span-1">
                 <Card className="sticky top-24">
                    <CardHeader><CardTitle className="flex justify-between items-center text-base"><span>Order Summary</span></CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {isProductLoading ? ( <div className="space-y-2"><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-full" /></div> ) : (
                            <div className="space-y-2 text-sm text-muted-foreground max-h-60 overflow-y-auto pr-2">
                                {products.map(item => (
                                    <div key={item.cartItemId} className="flex gap-4">
                                        <Image src={item.images[0]} alt={item.name} width={64} height={80} className="object-cover rounded-md" />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-foreground">{item.name}</p>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-foreground">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Separator/>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span>Sub-total</span><span>Rs. {subtotal.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span>Shipping Charges</span><span className="text-green-600">Free</span></div>
                            <Separator/>
                            <div className="flex justify-between font-bold text-base text-foreground"><span>Total</span><span>Rs. {subtotal.toLocaleString('en-IN')}</span></div>
                        </div>
                    </CardContent>
                 </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
