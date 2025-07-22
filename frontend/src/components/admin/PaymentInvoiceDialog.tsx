
'use client'

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import type { Order, PopulatedUser } from "@/lib/types";
import { format } from "date-fns";
import { Printer, Download } from 'lucide-react';

interface PaymentInvoiceDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PaymentInvoiceDialog({ order, open, onOpenChange }: PaymentInvoiceDialogProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        if (invoiceRef.current) {
            html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
                const link = document.createElement('a');
                link.download = `invoice-${order?._id.slice(-6).toUpperCase()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };

    if (!order) return null;

    const user = order.userId as PopulatedUser;
    const GST_RATE = 0.18; // 18% GST

    // Calculate totals
    const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalGst = subtotal * GST_RATE;
    const grandTotal = subtotal + totalGst;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0">
                <div id="invoice-content" ref={invoiceRef} className="bg-white text-black p-8 printable-area">
                    <header className="text-center mb-8">
                        <h1 className="text-4xl font-bold font-headline text-primary" style={{fontFamily: "'Cormorant Garamond', serif"}}>PRAMILA</h1>
                        <p className="text-sm text-gray-500">22 Park Street, Mumbai - 400001</p>
                    </header>
                    <Separator className="my-6 bg-gray-300"/>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Invoice</h2>
                        <div className="text-right text-sm">
                            <p><span className="font-semibold">Invoice #:</span> {(order._id as string).slice(-6).toUpperCase()}</p>
                            <p><span className="font-semibold">Date:</span> {format(new Date(order.createdAt), 'dd MMM, yyyy')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                        <div className="space-y-1">
                            <h3 className="font-semibold text-gray-600">BILLED TO:</h3>
                            <p className="font-bold">{user.firstName} {user.lastName}</p>
                            <p>{order.shippingAddress}</p>
                            <p>{user.email}</p>
                        </div>
                         <div className="space-y-1 text-right">
                             <h3 className="font-semibold text-gray-600">FROM:</h3>
                             <p className="font-bold">PRAMILA Fashions</p>
                             <p>22 Park Street, Mumbai - 400001</p>
                             <p>contact@pramila.shop</p>
                             <p>GSTIN: 27AAPFP1234F1Z5</p>
                        </div>
                    </div>

                    <div className="rounded-lg border">
                         <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-[50%]">Item</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Rate</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-medium">
                                            {item.name}
                                            <span className="text-gray-500 ml-2">({item.size})</span>
                                        </TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>₹{item.price.toLocaleString('en-IN')}</TableCell>
                                        <TableCell className="text-right">₹{(item.price * item.quantity).toLocaleString('en-IN')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end mt-6">
                        <div className="w-full max-w-xs space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">GST (18%):</span>
                                <span>₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <Separator className="bg-gray-300 my-2"/>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Grand Total:</span>
                                <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                     <footer className="mt-12 text-center text-xs text-gray-500">
                        <p>This is a computer-generated invoice and does not require a signature.</p>
                        <p>Thank you for your business!</p>
                    </footer>
                </div>
                 <DialogFooter className="p-4 bg-muted border-t print-hidden">
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                </DialogFooter>
                 <style jsx global>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .printable-area, .printable-area * {
                            visibility: visible;
                        }
                        .printable-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                        .print-hidden {
                            display: none;
                        }
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    )
}
