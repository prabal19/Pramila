
'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import type { Order, PopulatedUser, Product } from "@/lib/types";
import { format } from "date-fns";
import { Download, Loader2 } from 'lucide-react';
// import { cn } from '@/lib/utils';
import { getProductById } from '@/lib/products';
import ProductDetailsDialog from './ProductDetailsDialog';

interface OrderDetailsDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}



export default function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
    const slipRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
        const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
    // const handlePrint = () => {
    //     window.print();
    // };

    const handleDownload = async () => {
        const input = slipRef.current;
        if (input) {
            setIsDownloading(true);
            try {
                const canvas = await html2canvas(input, {
                    scale: 2,
                    useCORS: true,
                    // Allow the canvas to expand beyond the visible area
                    width: input.scrollWidth,
                    height: input.scrollHeight,
                    windowWidth: input.scrollWidth,
                    windowHeight: input.scrollHeight,
                });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'a4',
                });

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = imgWidth / imgHeight;
                let finalImgHeight = pdfWidth / ratio;
                let heightLeft = finalImgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, finalImgHeight);
                heightLeft -= pdfHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - finalImgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, finalImgHeight);
                    heightLeft -= pdfHeight;
                }

                pdf.save(`packing-slip-${order?._id.slice(-6).toUpperCase()}.pdf`);
            } catch (error) {
                console.error("Failed to download PDF:", error);
            } finally {
                setIsDownloading(false);
            }
        }
    };
    const handleProductClick = async (productId: string) => {
        const productDetails = await getProductById(productId);
        if (productDetails) {
            setSelectedProduct(productDetails);
            setIsProductDetailsOpen(true);
        } else {
            console.error("Product not found");
        }
    };

    if (!order) return null;

    const user = order.userId as PopulatedUser;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl w-full p-0 flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
                    <DialogHeader className="p-4 sm:p-6 border-b print-hidden flex-shrink-0">
                        <DialogTitle>Order Summary - #{(order._id as string).slice(-6).toUpperCase()}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="flex-grow overflow-y-auto">
                        <div ref={slipRef} className="bg-white text-black p-4 sm:p-8 printable-area">
                            <header className="text-center mb-8">
                                <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary" style={{fontFamily: "'Cormorant Garamond', serif"}}>PRAMILA</h1>
                                <p className="text-xs sm:text-sm text-gray-500">Jaypee greens wishtown, sector 128, Noida-201304</p>
                            </header>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-sm">
                                <div className="space-y-2">
                                    <p><strong className="font-semibold text-gray-600  inline-block">Order Number:</strong> #{(order._id as string).slice(-6).toUpperCase()}</p>
                                    <p><strong className="font-semibold text-gray-600  inline-block">Order Date:</strong> {format(new Date(order.createdAt), 'dd MMM, yyyy')}</p>
                                    <p><strong className="font-semibold text-gray-600  inline-block">Shipping Method:</strong> Standard</p>
                                    <p><strong className="font-semibold text-gray-600 inline-block">Payment Status:</strong> Paid</p>
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
                                            <TableRow key={item._id} onClick={() => handleProductClick(item.productId)} className="cursor-pointer hover:bg-muted/50">
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
                        {/* <Button onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button> */}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* <div className="printable-area hidden">
                 <div ref={slipRef} className="bg-white text-black p-4 sm:p-8">
                    <header className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary" style={{fontFamily: "'Cormorant Garamond', serif"}}>PRAMILA</h1>
                        <p className="text-xs sm:text-sm text-gray-500">Jaypee greens wishtown, sector 128, Noida-201304</p>
                    </header>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-sm">
                        <div className="space-y-2">
                            <p><strong className="font-semibold text-gray-600 inline-block">Order Number:</strong> #{(order._id as string).slice(-6).toUpperCase()}</p>
                            <p><strong className="font-semibold text-gray-600 inline-block">Order Date:</strong> {format(new Date(order.createdAt), 'dd MMM, yyyy')}</p>
                            <p><strong className="font-semibold text-gray-600 inline-block">Shipping Method:</strong> Standard</p>
                            <p><strong className="font-semibold text-gray-600 inline-block">Payment Status:</strong> Paid</p>
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
            </div> */}
                   {selectedProduct && (
                <ProductDetailsDialog
                    product={selectedProduct}
                    open={isProductDetailsOpen}
                    onOpenChange={setIsProductDetailsOpen}
                />
            )}
        </>
    )
}
