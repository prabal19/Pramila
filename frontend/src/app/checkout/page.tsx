
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { getProductsByIds } from '@/lib/products';
import type { Product, Address } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
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

// This parser is best-effort. A more robust solution would store address fields separately.
const parseAddressForForm = (fullAddress: string) => {
    const parts = fullAddress.split(', ');
    if (parts.length >= 4) {
        const [houseNo, landmark, city, rest] = parts;
        const stateAndPincode = rest.split(' - ');
        if (stateAndPincode.length >= 2) {
             const [state, pincodeAndCountry] = stateAndPincode;
             const countryParts = pincodeAndCountry.split(', ');
             const pincode = countryParts[0];
             const country = countryParts.length > 1 ? countryParts[1] : 'India'; // Default country if not present
             return { houseNo, landmark, city, state, pincode, country };
        }
    }
    // Fallback for any format that doesn't match
    return { houseNo: fullAddress, landmark: '', city: '', state: '', pincode: '', country: 'India' };
};


export default function CheckoutPage() {
  const { cart, isLoading: isCartLoading } = useCart();
  const { user, loading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<EnrichedCartItem[]>([]);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string>('new');
  
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

  useEffect(() => {
    if (!isAuthLoading && cart.length === 0) {
      toast({ title: "Your cart is empty", description: "Redirecting you to shop.", variant: "destructive" });
      router.replace('/shop');
    }
  }, [isAuthLoading, cart, router, toast]);

  const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isLoading = isCartLoading || isProductLoading || isAuthLoading;
  
  const defaultAddress = user?.addresses?.[0]?.fullAddress 
    ? parseAddressForForm(user.addresses[0].fullAddress) 
    : { houseNo: '', landmark: '', city: '', state: '', pincode: '', country: 'India' };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-2xl font-bold tracking-widest" style={{fontFamily: "'Cormorant Garamond', serif"}}>PRAMILA</Link>
            <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cart
                </Link>
            </Button>
          </div>
          
          <div className="flex items-start mb-8 p-4 border rounded-lg bg-white">
            <CheckoutStep number={1} label="Shipping Details" active={true} completed={false} />
            <div className="flex-1 mt-4"><Separator /></div>
            <CheckoutStep number={2} label="Payment" active={false} completed={false} />
            <div className="flex-1 mt-4"><Separator /></div>
            <CheckoutStep number={3} label="Order Confirmation" active={false} completed={false} />
          </div>

          {isLoading ? (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-6">
                  {user ? (
                    <Card>
                        <CardHeader><CardTitle>Delivery Address</CardTitle></CardHeader>
                        <CardContent>
                            <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                                <SelectTrigger><SelectValue placeholder="Select an address" /></SelectTrigger>
                                <SelectContent>
                                    {user.addresses.map((address: Address) => (
                                        <SelectItem key={address._id} value={address.fullAddress}>{address.fullAddress}</SelectItem>
                                    ))}
                                    <SelectItem value="new">Use a new address</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                  ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardContent className="pt-4 px-0 pb-0">
                                <Input type="email" placeholder="Email Address *" />
                                <p className="text-xs text-muted-foreground mt-2">Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link></p>
                            </CardContent>
                        </CardHeader>
                    </Card>
                  )}

                  { (selectedAddress === 'new' || !user) && (
                      <Card>
                          <CardHeader><CardTitle>{user ? 'Add New Address' : 'Shipping Address'}</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input placeholder="First Name *" defaultValue={user?.firstName || ''}/>
                                  <Input placeholder="Last Name *" defaultValue={user?.lastName || ''}/>
                              </div>
                              <Input placeholder="Street Address *" defaultValue={defaultAddress.houseNo || ''} />
                              <Input placeholder="Apt/Suite/Floor (Optional)" defaultValue={defaultAddress.landmark || ''} />
                               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <Input placeholder="City *" defaultValue={defaultAddress.city || ''} />
                                   <Input placeholder="State *" defaultValue={defaultAddress.state || ''}/>
                                  <Input placeholder="Zip Code *" defaultValue={defaultAddress.pincode || ''}/>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <Checkbox id="billing-address" defaultChecked/>
                                  <Label htmlFor="billing-address" className="font-normal">Use as billing address</Label>
                              </div>
                          </CardContent>
                      </Card>
                  )}
                  
                  <div className="flex justify-end">
                      <Button size="lg" className="w-full md:w-auto" asChild>
                          <Link href="/checkout/payment">Proceed to Payment</Link>
                      </Button>
                  </div>
              </div>

              <div className="lg:col-span-1">
                   <Card className="sticky top-24">
                      <CardHeader>
                          <CardTitle className="flex justify-between items-center text-base">
                              <span>Order Summary ({cart.length} Item(s))</span>
                               <Button variant="link" size="sm" asChild className="p-0 h-auto text-sm"><Link href="/cart">Details</Link></Button>
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                              <span>Order Subtotal</span>
                              <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-sm text-red-600">
                              <span>Sale Discount</span>
                              <span>-Rs. 0.00</span>
                          </div>
                          <Separator/>
                          <div className="flex justify-between font-semibold text-sm">
                              <span>Net Order Subtotal</span>
                              <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span>Shipping</span>
                              <span>FREE</span>
                          </div>
                          <Separator/>
                          <div className="flex justify-between font-bold text-base">
                              <span>Pre-Tax Total</span>
                              <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
                          </div>
                          <Separator/>
                          <div className="flex justify-between font-semibold text-red-600 text-sm">
                              <span>Total Savings</span>
                              <span>Rs. 0.00</span>
                          </div>
                      </CardContent>
                   </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
