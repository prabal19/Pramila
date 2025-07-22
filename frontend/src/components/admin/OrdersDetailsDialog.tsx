
'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Order, OrderStatus, PopulatedUser } from "@/lib/types";
import { format } from "date-fns";
import { Printer, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
    const slipRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const input = slipRef.current;
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
                const canvasHeight = pdfWidth / ratio;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, canvasHeight);
                pdf.save(`packing-slip-${order?._id.slice(-6).toUpperCase()}.pdf`);
                setIsDownloading(false);
            }).catch(() => {
                setIsDownloading(false);
            });
        }
    };


    if (!order) return null;

    const user = order.userId as PopulatedUser;

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
                        <DialogTitle>Order Summary - #{(order._id as string).slice(-6).toUpperCase()}</DialogTitle>
                    </DialogHeader>
                    <div ref={slipRef} className="flex-grow overflow-y-auto printable-area bg-white text-black">
                        <div className="p-4 sm:p-8">
                            <header className="text-center mb-8">
                                <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary" style={{fontFamily: "'Cormorant Garamond', serif"}}>PRAMILA</h1>
                                <p className="text-xs sm:text-sm text-gray-500">Jaypee greens wishtown, sector 128, Noida-201304</p>
                            </header>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-sm">
                                <div className="space-y-2">
                                    <p><strong className="font-semibold text-gray-600 w-28 inline-block">Order Number:</strong> #{(order._id as string).slice(-6).toUpperCase()}</p>
                                    <p><strong className="font-semibold text-gray-600 w-28 inline-block">Order Date:</strong> {format(new Date(order.createdAt), 'dd MMM, yyyy')}</p>
                                    <p><strong className="font-semibold text-gray-600 w-28 inline-block">Shipping Method:</strong> Standard</p>
                                    <p><strong className="font-semibold text-gray-600 w-28 inline-block">Payment Status:</strong> Paid</p>
                                </div>
                                <div className="space-y-2 sm:text-right">
                                    <p className="font-semibold">Order Status:</p>
                                    <Badge variant="outline" className={cn('capitalize', getStatusVariant(order.status))}>{order.status}</Badge>
                                </div>
                            </div>

                            <Separator className="my-6 bg-gray-200"/>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 text-sm">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-gray-600 mb-1">SHIPPING TO:</h3>
                                    <p className="font-bold">{user.firstName} {user.lastName}</p>
                                    <p>{order.phone}</p>
                                    <p>{user.email}</p>
                                    <p>{order.shippingAddress}</p>
                                </div>
                            </div>

                            <div className="rounded-lg border w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="w-[60%]">Item Name</TableHead>
                                            <TableHead>Variant</TableHead>
                                            <TableHead className="text-right">Quantity</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>{item.size}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
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
