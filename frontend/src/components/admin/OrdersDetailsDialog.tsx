
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Order, OrderStatus, PopulatedUser } from "@/lib/types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface OrderDetailsDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function getStatusVariant(status: OrderStatus) {
    switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
        case 'Out for Delivery': return 'bg-sky-100 text-sky-800 border-sky-200';
        case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Confirmed / Processing': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'Cancelled':
        case 'Returned': return 'bg-red-100 text-red-800 border-red-200';
        case 'Pending':
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

export default function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
    if (!order) return null;

    const user = order.userId as PopulatedUser;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle>Order Details - #{(order._id as string).slice(-6).toUpperCase()}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow">
                     <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-4">Items Ordered</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>{item.size}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>Rs. {item.price.toLocaleString('en-IN')}</TableCell>
                                                <TableCell className="text-right">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <div className="flex justify-between"><span>Status</span> <Badge variant="outline" className={cn('capitalize', getStatusVariant(order.status))}>{order.status}</Badge></div>
                                     <div className="flex justify-between"><span>Date</span> <span>{format(new Date(order.createdAt), 'MMM d, yyyy')}</span></div>
                                     <div className="flex justify-between font-bold text-base"><span>Total</span> <span>Rs. {order.totalAmount.toLocaleString('en-IN')}</span></div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <h3 className="font-semibold mb-2">Customer Details</h3>
                                     <p>{user.firstName} {user.lastName}</p>
                                     <p>{user.email}</p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <h3 className="font-semibold mb-2">Shipping Address</h3>
                                     <p>{order.shippingAddress}</p>
                                </CardContent>
                            </Card>
                        </div>
                     </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
