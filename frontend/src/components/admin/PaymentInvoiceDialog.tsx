
'use client'

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import type { Order, PopulatedUser } from "@/lib/types";
import { format } from "date-fns";
import { Printer, Download, Loader2 } from 'lucide-react';

interface PaymentInvoiceDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PaymentInvoiceDialog({ order, open, onOpenChange }: PaymentInvoiceDialogProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const input = invoiceRef.current;
        if (input) {
            setIsDownloading(true);
            html2canvas(input, {
                scale: 2,
                scrollY: -window.scrollY,
                windowWidth: input.scrollWidth,
                windowHeight: input.scrollHeight,
                useCORS: true,
            }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = imgWidth / imgHeight;
                let canvasHeight = pdfWidth / ratio;
                let isMultiPage = imgHeight > pdfHeight * (imgWidth / pdfWidth);

                if (isMultiPage) {
                    canvasHeight = imgHeight * (pdfWidth / imgWidth);
                    let position = 0;
                    let pageCount = Math.ceil(imgHeight / (pdfHeight * (imgWidth / pdfWidth)));
                    
                    for (let i = 0; i < pageCount; i++) {
                        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeight);
                        position -= pdfHeight;
                        if(i < pageCount - 1) pdf.addPage();
                    }

                } else {
                     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, canvasHeight);
                }

                pdf.save(`invoice-${order?._id.slice(-6).toUpperCase()}.pdf`);
                setIsDownloading(false);
            }).catch(() => {
                setIsDownloading(false);
            });
        }
    };


    if (!order) return null;

    const user = order.userId as PopulatedUser;
    const GST_RATE = 0.18; // 18% GST

    const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalGst = subtotal * GST_RATE;
    const grandTotal = subtotal + totalGst;

    return (
        <>
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                    }
                    body, html {
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
                        height: auto;
                        overflow: visible;
                        background: white;
                        color: black;
                    }
                    .print-hidden {
                        display: none;
                    }
                }
            `}</style>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl w-full p-0 flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
                     <DialogHeader className="p-4 sm:p-6 border-b print-hidden flex-shrink-0">
                        <DialogTitle>Invoice - #{(order._id as string).slice(-6).toUpperCase()}</DialogTitle>
                    </DialogHeader>
                    <div ref={invoiceRef} className="bg-white text-black printable-area flex-grow overflow-y-auto">
                        <div className="p-4 sm:p-8">
                            <header className="text-center mb-8">
                                <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary" style={{fontFamily: "'Cormorant Garamond', serif"}}>PRAMILA</h1>
                                <p className="text-xs sm:text-sm text-gray-500">22 Park Street, Mumbai - 400001</p>
                            </header>
                            <Separator className="my-6 bg-gray-300"/>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl sm:text-2xl font-semibold">Invoice</h2>
                                <div className="text-right text-xs sm:text-sm">
                                    <p><span className="font-semibold">Invoice #:</span> {(order._id as string).slice(-6).toUpperCase()}</p>
                                    <p><span className="font-semibold">Date:</span> {format(new Date(order.createdAt), 'dd MMM, yyyy')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 text-xs sm:text-sm">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-gray-600">BILLED TO:</h3>
                                    <p className="font-bold">{user.firstName} {user.lastName}</p>
                                    <p>{order.shippingAddress}</p>
                                    <p>{user.email}</p>
                                </div>
                                <div className="space-y-1 sm:text-right">
                                    <h3 className="font-semibold text-gray-600">FROM:</h3>
                                    <p className="font-bold">PRAMILA Fashions</p>
                                    <p>22 Park Street, Mumbai - 400001</p>
                                    <p>contact@pramila.shop</p>
                                    <p>GSTIN: 27AAPFP1234F1Z5</p>
                                </div>
                            </div>

                            <div className="rounded-lg border w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="w-[40%] sm:w-[50%]">Item</TableHead>
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
                                    <div className="flex justify-between font-bold text-base sm:text-lg">
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
                    </div>
                     <DialogFooter className="p-4 bg-muted border-t print-hidden flex-shrink-0">
                        <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
                            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                             Download PDF
                        </Button>
                        <Button onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
