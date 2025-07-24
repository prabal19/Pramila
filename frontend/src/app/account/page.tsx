'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateUser as updateUserAction, addAddress, updateAddress as updateAddressAction, deleteAddress as deleteAddressAction, deleteUser as deleteUserAction } from '@/actions/auth';
import { useToast } from '@/hooks/use-toast';
import type { Address, Order ,Product, ReturnRequest} from '@/lib/types';
import ReturnItemDialog from '@/components/ReturnItemDialog';
import { getUserReturns } from '@/lib/returns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, ShoppingBag , RefreshCw} from 'lucide-react';
import { getUserOrders } from '@/lib/orders';
import { getProductsByIds } from '@/lib/products';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';


// Sidebar component
const AccountSidebar = ({ activeView, onNavigate, onLogout }: { activeView: string, onNavigate: (view: string) => void, onLogout: () => void }) => {
    const { user } = useAuth();
    const navItems = [
        { key: 'overview', name: 'Overview' },
        { key: 'orders', name: 'Orders & Returns' },
        { key: 'addresses', name: 'Saved Addresses' },
        { key: 'delete', name: 'Delete Account' },
    ];
    return (
        <aside className="w-full md:w-1/4 lg:w-1/5 pr-8 border-r">
            <div className="sticky top-28">
                <div className="pb-4 border-b mb-4">
                    <p className="font-bold">Account</p>
                    <p className="text-sm text-muted-foreground">{user?.firstName} {user?.lastName}</p>
                </div>
                <nav className="space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground tracking-wider">ACCOUNT</h3>
                    <ul className="space-y-3">
                        {navItems.map(item => (
                            <li key={item.key}>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(item.key); }} className={`text-sm ${activeView === item.key ? 'text-primary font-bold' : 'text-gray-700 hover:text-primary'}`}>
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                 <Button onClick={onLogout} variant="outline" className="mt-8 w-full">Logout</Button>
            </div>
        </aside>
    );
};

// Profile View Component (for Overview)
const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

const OverviewView = () => {
    const { user, updateUser } = useAuth();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                firstName: user.firstName,
                lastName: user.lastName,
            });
        }
    }, [user, form]);

    async function onSubmit(values: z.infer<typeof profileFormSchema>) {
        if (!user) return;
        const result = await updateUserAction(user._id, values);
        if (result.success && result.user) {
            updateUser(result.user);
            toast({
                title: 'Success!',
                description: 'Your profile has been updated.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: result.message,
            });
        }
    }

    return (
        <div>
            <h1 className="text-xl font-bold mb-8">Edit Details</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
                     <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user?.email || ''} disabled />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 h-auto" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                        {form.formState.isSubmitting ? 'SAVING...' : 'SAVE DETAILS'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

// Address View Component
const addressFormSchema = z.object({
  houseNo: z.string().min(1, 'House/Flat No. is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  landmark: z.string().min(1, 'Nearest Landmark is required'),
});

// This parser is best-effort. A more robust solution would store address fields separately.
const parseAddressForForm = (fullAddress: string): z.infer<typeof addressFormSchema> => {
    const pattern = /^(?<houseNo>.*?), (?<landmark>.*?), (?<city>.*?), (?<state>.*?) - (?<pincode>\w+), (?<country>.*?)$/;
    const match = fullAddress.match(pattern);
    if (match && match.groups) {
        return {
            houseNo: match.groups.houseNo,
            landmark: match.groups.landmark,
            city: match.groups.city,
            state: match.groups.state,
            pincode: match.groups.pincode,
            country: match.groups.country,
        };
    }
    // Fallback for any format that doesn't match
    return { houseNo: fullAddress, landmark: '', city: '', state: '', pincode: '', country: '' };
};


const AddressesView = () => {
    const { user, updateUser } = useAuth();
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const form = useForm<z.infer<typeof addressFormSchema>>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: { houseNo: '', country: '', city: '', state: '', pincode: '', landmark: '' },
    });

    const handleAddNew = () => {
        setEditingAddress(null);
        form.reset({ houseNo: '', country: 'India', city: '', state: '', pincode: '', landmark: '' });
        setIsFormOpen(true);
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        form.reset(parseAddressForForm(address.fullAddress));
        setIsFormOpen(true);
    };
    
    const handleDelete = async (addressId: string) => {
        if (!user) return;
        const result = await deleteAddressAction(user._id, addressId);
        if (result.success && result.user) {
            updateUser(result.user);
            toast({ title: 'Address deleted successfully!' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    };

    const onSubmit = async (values: z.infer<typeof addressFormSchema>) => {
        if (!user) return;
        
        const action = editingAddress
            ? updateAddressAction(user._id, editingAddress._id, values)
            : addAddress(user._id, values);

        const result = await action;

        if (result.success && result.user) {
            updateUser(result.user);
            toast({ title: 'Success!', description: `Address has been ${editingAddress ? 'updated' : 'saved'}.` });
            setIsFormOpen(false);
            setEditingAddress(null);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold">Saved Addresses</h1>
                {!isFormOpen && (
                    <Button onClick={handleAddNew}>Add a new address</Button>
                )}
            </div>

            {isFormOpen ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl border p-6 rounded-lg bg-gray-50">
                        <h2 className="text-lg font-semibold border-b pb-2 mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
                        <FormField control={form.control} name="houseNo" render={({ field }) => (<FormItem><FormLabel>House/Flat No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="landmark" render={({ field }) => (<FormItem><FormLabel>Nearest Landmark</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="pincode" render={({ field }) => (<FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'SAVING...' : 'Save Address'}</Button>
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            ) : (
                user?.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-4">
                        {user.addresses.map(address => (
                            <div key={address._id} className="border p-4 rounded-lg flex justify-between items-center">
                                <p className="text-muted-foreground pr-4">{address.fullAddress}</p>
                                <div className="flex gap-2 shrink-0">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(address)}>Edit</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone. This will permanently delete your address.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(address._id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You have no saved addresses.</p>
                    </div>
                )
            )}
        </div>
    );
};


// Placeholder Orders View


function getStatusVariant(status: string) {
    switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
        case 'Out for Delivery': return 'bg-sky-100 text-sky-800 border-sky-200';
        case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Confirmed / Processing': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'Cancelled': case 'Returned': case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
        case 'Pending': case 'Pending Approval': case 'Approved': case 'Item Picked Up': case 'Refunded': default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

const OrdersView = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [products, setProducts] = useState<Map<string, Product>>(new Map());
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'orders' | 'returns' | 'all'>('all');
    const [returnItem, setReturnItem] = useState<{order: Order, item: Order['items'][0]} | null>(null);

    const fetchData = async () => {
        if (user) {
            setLoading(true);
            const [userOrders, userReturns] = await Promise.all([
                getUserOrders(user._id),
                getUserReturns(user._id)
            ]);
            setOrders(userOrders);
            setReturns(userReturns);

            if (userOrders.length > 0) {
                const productIds = [...new Set(userOrders.flatMap(o => o.items.map(i => i.productId)))];
                const fetchedProducts = await getProductsByIds(productIds);
                const productMap = new Map(fetchedProducts.map(p => [p.id, p]));
                setProducts(productMap);
            }
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div>
                <h1 className="text-xl font-bold mb-8">Orders & Returns</h1>
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }
    
    if (orders.length === 0 && returns.length === 0) {
        return (
             <div>
                <h1 className="text-xl font-bold mb-8">Orders & Returns</h1>
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">No Orders Yet</h2>
                    <p className="mt-2 text-sm text-muted-foreground">You haven't placed any orders with us yet. Let's change that!</p>
                    <Button asChild className="mt-6">
                        <Link href="/shop">Start Shopping</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const filteredReturns = view === 'all' || view === 'returns' ? returns : [];
    const filteredOrders = view === 'all' || view === 'orders' ? orders : [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Orders & Returns</h1>
                <div className="flex items-center gap-2">
                    <Button variant={view === 'all' ? 'default' : 'outline'} onClick={() => setView('all')}>All</Button>
                    <Button variant={view === 'orders' ? 'default' : 'outline'} onClick={() => setView('orders')}>My Orders</Button>
                    <Button variant={view === 'returns' ? 'default' : 'outline'} onClick={() => setView('returns')}>My Returns</Button>
                </div>
            </div>

            <div className="space-y-6">
                {filteredOrders.map(order => (
                    <Accordion key={order._id} type="single" collapsible className="border rounded-lg">
                        <AccordionItem value={order._id} className="border-b-0">
                            <AccordionTrigger className="p-4 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left gap-2 sm:gap-4">
                                    <div className="flex-1">
                                        <p className="font-bold text-base">Order #{order._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(order.createdAt), 'PPP')}</p>
                                    </div>
                                    <div className="flex-1 text-right sm:text-left">
                                         <p className="text-xs text-muted-foreground">Total</p>
                                         <p className="font-semibold">Rs. {order.totalAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="sm:flex-1 text-right">
                                        <Badge variant="outline" className={cn('capitalize', getStatusVariant(order.status))}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                               <div className="p-4 border-t">
                                   <h3 className="font-semibold mb-4">Items in your order:</h3>
                                   <div className="space-y-4">
                                       {order.items.map(item => {
                                           const product = products.get(item.productId);
                                           return (
                                                <div key={item._id} className="flex gap-4 justify-between items-start">
                                                    <Link href={`/product/${item.productId}`} className="flex gap-4 group">
                                                      <div className="w-20 h-24 bg-muted rounded-md shrink-0 relative">
                                                          {product ? (
                                                              <Image src={product.images[0]} alt={product.name} fill className="object-cover rounded-md" />
                                                          ) : (
                                                              <div className="w-full h-full bg-muted rounded-md"></div>
                                                          )}
                                                      </div>
                                                      <div>
                                                          <p className="font-semibold group-hover:underline">{item.name}</p>
                                                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                                          <p className="text-sm text-muted-foreground">Price: Rs. {item.price.toLocaleString('en-IN')}</p>
                                                      </div>
                                                    </Link>
                                                    {order.status === 'Delivered' && !item.returnStatus && (
                                                        <Button variant="outline" size="sm" onClick={() => setReturnItem({order, item})}>Return Item</Button>
                                                    )}
                                                     {item.returnStatus && (
                                                        <Badge variant="outline" className={cn('capitalize text-xs', getStatusVariant(item.returnStatus))}>Return {item.returnStatus}</Badge>
                                                     )}
                                                </div>
                                           )
                                        })}
                                   </div>
                                    <Separator className="my-4" />
                                    <div>
                                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                                        <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                                    </div>
                               </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>

            <div className="space-y-6 mt-6">
                {filteredReturns.map(ret => (
                     <Link key={ret._id} href={`/product/${ret.productId._id}`} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-muted/50 transition-colors">
                        <div className="flex gap-4">
                            {ret.productId.images?.[0] && (
                                <div className="w-20 h-24 bg-muted rounded-md shrink-0 relative">
                                    <Image src={ret.productId.images[0]} alt={ret.productId.name} fill className="object-cover rounded-md" />
                                </div>
                            )}
                            <div>
                                <p className="font-bold text-sm">RETURN ID #{ret.returnId}</p>
                                <p className="font-semibold">{ret.productId.name}</p>
                                <p className="text-sm text-muted-foreground">Reason: {ret.reason}</p>
                                <p className="text-xs text-muted-foreground">Requested on {format(new Date(ret.createdAt), 'PP')}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className={cn('capitalize self-end sm:self-center', getStatusVariant(ret.status))}>{ret.status}</Badge>
                     </Link>
                ))}
            </div>

            {returnItem && (
                 <ReturnItemDialog
                    isOpen={!!returnItem}
                    onClose={() => setReturnItem(null)}
                    order={returnItem.order}
                    item={returnItem.item}
                    onReturnSuccess={fetchData}
                 />
            )}
        </div>
    );
};



// Delete Account View
const DeleteAccountView = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleDeleteAccount = async () => {
        if (!user) return;
        const result = await deleteUserAction(user._id);
        if (result.success) {
            toast({
                title: 'Account Deleted',
                description: 'Your account has been permanently deleted.',
            });
            logout();
            router.push('/');
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.message,
            });
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-8">Delete Account</h1>
            <div className="max-w-md p-6 border-2 border-destructive/50 rounded-lg bg-destructive/5">
                <div className="flex items-start gap-4">
                    <AlertTriangle className="h-8 w-8 text-destructive mt-1 shrink-0" />
                    <div>
                        <h2 className="text-lg font-semibold text-destructive">Warning</h2>
                        <p className="text-muted-foreground mt-2">
                           This is a permanent action. All your data, including profile details, saved addresses, and wishlists, will be deleted. This cannot be undone.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={() => router.push('/')}>Cancel</Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete My Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove all your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDeleteAccount}>
                                    Yes, delete my account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};


// Main Page Component
export default function AccountPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [view, setView] = useState('overview');


useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const viewParam = queryParams.get('view');
        if (viewParam) {
            setView(viewParam);
        }
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };
    
    if (loading || !user) {
        return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
    }

    const renderView = () => {
        switch (view) {
            case 'overview':
                return <OverviewView />;
            case 'orders':
                return <OrdersView />;
            case 'addresses':
                return <AddressesView />;
            case 'delete':
                return <DeleteAccountView />;
            default:
                return <OverviewView />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row gap-12">
                <AccountSidebar activeView={view} onNavigate={setView} onLogout={handleLogout} />
                <main className="w-full md:w-3/4 lg:w-4/5">
                    {renderView()}
                </main>
            </div>
        </div>
    );
}