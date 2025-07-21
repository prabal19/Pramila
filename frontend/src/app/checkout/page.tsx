
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { getProductsByIds } from '@/lib/products';
import { loginOrRegisterDuringCheckout, addAddress } from '@/actions/auth';
import type { Product, Address as AddressType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  phone: z.string().min(10, "A valid phone number is required"),
  houseNo: z.string().min(1, "House/Flat No. is required"),
  landmark: z.string().min(1, "Nearest Landmark is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "A valid pincode is required"),
  country: z.string().min(1, "Country is required"),
  addressId: z.string().optional(),
});

// Best-effort parser
const parseAddressForForm = (fullAddress: string) => {
    const parts = fullAddress.split(', ');
    if (parts.length >= 4) {
        const [houseNo, landmark, city, rest] = parts;
        const stateAndPincode = rest ? rest.split(' - ') : [];
        if (stateAndPincode.length >= 2) {
             const [state, pincodeAndCountry] = stateAndPincode;
             const countryParts = pincodeAndCountry ? pincodeAndCountry.split(', ') : [];
             const pincode = countryParts[0] || '';
             const country = countryParts.length > 1 ? countryParts[1] : 'India';
             return { houseNo, landmark, city, state, pincode, country };
        }
    }
    return { houseNo: fullAddress, landmark: '', city: '', state: '', pincode: '', country: 'India' };
};

export default function CheckoutPage() {
  const { cart, buyNowItem, isLoading: isCartLoading, setShippingInfo } = useCart();
  const { user, loading: isAuthLoading, login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<EnrichedCartItem[]>([]);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        firstName: '', lastName: '', email: '', password: '', phone: '',
        houseNo: '', landmark: '', city: '', state: '', pincode: '', country: 'India',
        addressId: 'new',
    }
  });
  
  const { control, handleSubmit, reset, watch } = formMethods;
  const selectedAddressId = watch('addressId');

  useEffect(() => {
    if (user) {
      const defaultAddress = user.addresses?.[0];
      const parsedAddress = defaultAddress ? parseAddressForForm(defaultAddress.fullAddress) : {};
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: '',
        addressId: defaultAddress?._id || 'new',
        ...parsedAddress
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (user && selectedAddressId && selectedAddressId !== 'new') {
        const selected = user.addresses.find(a => a._id === selectedAddressId);
        if (selected) {
            const parsed = parseAddressForForm(selected.fullAddress);
            reset({ ...watch(), ...parsed });
        }
    } else if (selectedAddressId === 'new') {
        reset({ ...watch(), houseNo: '', landmark: '', city: '', state: '', pincode: '', country: 'India' });
    }
  }, [selectedAddressId, user, reset, watch]);


  useEffect(() => {
    const fetchCartProducts = async () => {
      const itemsToFetch = buyNowItem ? [buyNowItem] : cart;
      if (itemsToFetch.length > 0) {
        setIsProductLoading(true);
        const productIds = itemsToFetch.map(item => item.productId);
        const fetchedProducts = await getProductsByIds(productIds);
        const enrichedItems = itemsToFetch.map(cartItem => {
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
  }, [cart, isCartLoading, buyNowItem]);

  useEffect(() => {
    if (!isCartLoading && !isAuthLoading && !buyNowItem && cart.length === 0) {
      toast({ title: "Your cart is empty", description: "Redirecting you to shop.", variant: "destructive" });
      router.replace('/shop');
    }
  }, [isAuthLoading, isCartLoading, cart, router, toast, buyNowItem]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    let finalUser = user;

    if (!finalUser) {
        if (!data.password) {
            formMethods.setError("password", { type: "manual", message: "Password is required for new accounts." });
            setIsProcessing(false);
            return;
        }
        const result = await loginOrRegisterDuringCheckout({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
        });

        if (result.success && result.user) {
            login(result.user); // Update global auth state
            finalUser = result.user;
            toast({ title: 'Welcome!', description: 'Your account has been created.' });
        } else {
            toast({ variant: 'destructive', title: 'Authentication Failed', description: result.message });
            setIsProcessing(false);
            return;
        }
    }

    const shippingAddress = { houseNo: data.houseNo, landmark: data.landmark, city: data.city, state: data.state, pincode: data.pincode, country: data.country };

    // If it's a new address for a logged-in user, save it
    if (finalUser && data.addressId === 'new') {
        const addResult = await addAddress(finalUser._id, shippingAddress);
        if (addResult.success && addResult.user) {
            login(addResult.user); // Update user with new address list
            toast({ title: 'Address Saved!' });
        } else {
            toast({ variant: 'destructive', title: 'Could not save address', description: addResult.message });
        }
    }
    
    setShippingInfo({
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        address: `${data.houseNo}, ${data.landmark}, ${data.city}, ${data.state} - ${data.pincode}, ${data.country}`
    });

    setIsProcessing(false);
    const redirectUrl = buyNowItem ? '/checkout/payment?buyNow=true' : '/checkout/payment';
    router.push(redirectUrl);
  };

  const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isLoading = isCartLoading || isProductLoading || isAuthLoading;

  if (isLoading && !user) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin"/></div>

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

          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-6">
                  <Card>
                      <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <FormField name="firstName" control={control} render={({ field }) => (<FormItem><FormLabel>First Name*</FormLabel><FormControl><Input {...field} disabled={!!user} /></FormControl><FormMessage /></FormItem>)} />
                           <FormField name="lastName" control={control} render={({ field }) => (<FormItem><FormLabel>Last Name*</FormLabel><FormControl><Input {...field} disabled={!!user} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField name="email" control={control} render={({ field }) => (<FormItem><FormLabel>Email*</FormLabel><FormControl><Input type="email" {...field} disabled={!!user} /></FormControl><FormMessage /></FormItem>)} />
                        {!user && (
                            <FormField name="password" control={control} render={({ field }) => (<FormItem><FormLabel>Password*</FormLabel><FormControl><Input type="password" {...field} placeholder="Create a password for your new account" /></FormControl><FormMessage /></FormItem>)} />
                        )}
                        <FormField name="phone" control={control} render={({ field }) => (<FormItem><FormLabel>Phone*</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </CardContent>
                  </Card>
                  
                  <Card>
                      <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                          {user && user.addresses.length > 0 && (
                            <FormField name="addressId" control={control} render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a saved address" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {user.addresses.map((address: AddressType) => (
                                                <SelectItem key={address._id} value={address._id}>{address.fullAddress}</SelectItem>
                                            ))}
                                            <SelectItem value="new">Use a new address</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField name="houseNo" control={control} render={({ field }) => (<FormItem><FormLabel>House/Flat No.*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField name="landmark" control={control} render={({ field }) => (<FormItem><FormLabel>Nearest Landmark*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <FormField name="city" control={control} render={({ field }) => (<FormItem><FormLabel>City*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField name="state" control={control} render={({ field }) => (<FormItem><FormLabel>State*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField name="pincode" control={control} render={({ field }) => (<FormItem><FormLabel>Pincode*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                          </div>
                          <FormField name="country" control={control} render={({ field }) => (<FormItem><FormLabel>Country*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </CardContent>
                  </Card>
                  
                  <div className="flex justify-end">
                      <Button size="lg" className="w-full md:w-auto" type="submit" disabled={isProcessing}>
                          {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Proceed to Payment
                      </Button>
                  </div>
              </div>

              <div className="lg:col-span-1">
                   <Card className="sticky top-24">
                      <CardHeader><CardTitle className="flex justify-between items-center text-base"><span>Order Summary ({products.length} Item(s))</span></CardTitle></CardHeader>
                      <CardContent className="space-y-2">
                        {isProductLoading ? ( <div className="space-y-2"><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-full" /></div> ) : (
                            <div className="space-y-2 text-sm text-muted-foreground max-h-60 overflow-y-auto pr-2">
                                {products.map(item => (
                                    <div key={item.cartItemId} className="flex gap-4">
                                        <div className="flex-grow"><p className="font-semibold text-foreground">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></p></div>
                                        <p className="font-semibold text-foreground">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                          <Separator/>
                          <div className="flex justify-between text-sm"><span>Order Subtotal</span><span>Rs. {subtotal.toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between text-sm"><span>Shipping</span><span>FREE</span></div>
                          <Separator/>
                          <div className="flex justify-between font-bold text-base"><span>Total</span><span>Rs. {subtotal.toLocaleString('en-IN')}</span></div>
                      </CardContent>
                   </Card>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
