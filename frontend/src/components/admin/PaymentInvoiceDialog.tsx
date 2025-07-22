
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import type { Order, PopulatedUser } from "@/lib/types"
import { format } from "date-fns"

interface PaymentInvoiceDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PaymentInvoiceDialog({ order, open, onOpenChange }: PaymentInvoiceDialogProps) {
    if (!order) return null;

    const user = order.userId as PopulatedUser;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl">Invoice</DialogTitle>
                    <DialogDescription>
                        Invoice for Order #{(order._id as string).slice(-6).toUpperCase()}
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div className="space-y-1">
                            <p className="font-semibold text-muted-foreground">Billed To</p>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p>{user.email}</p>
                        </div>
                         <div className="space-y-1 text-right">
                            <p className="font-semibold text-muted-foreground">Invoice Date</p>
                            <p>{format(new Date(order.createdAt), 'MMMM d, yyyy')}</p>
                             <p className="font-semibold text-muted-foreground mt-2">Order Status</p>
                             <p>{order.status}</p>
                        </div>
                    </div>
                     <div className="text-sm">
                        <p className="font-semibold text-muted-foreground">Shipping Address</p>
                        <p>{order.shippingAddress}</p>
                    </div>

                    <div className="rounded-lg border">
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60%]">Description</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-medium">
                                            {item.name}
                                            <span className="text-muted-foreground ml-2">({item.size})</span>
                                        </TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>Rs. {item.price.toLocaleString('en-IN')}</TableCell>
                                        <TableCell className="text-right">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold text-base">Total</TableCell>
                                    <TableCell className="text-right font-bold text-base">Rs. {order.totalAmount.toLocaleString('en-IN')}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>

                    <div className="text-center text-xs text-muted-foreground">
                        <p>Thank you for your business!</p>
                        <p>PRAMILA</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
