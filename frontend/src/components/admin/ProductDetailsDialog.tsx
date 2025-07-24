
'use client'

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Product } from "@/lib/types"
import { format } from "date-fns"

interface ProductDetailsDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProductDetailsDialog({ product, open, onOpenChange }: ProductDetailsDialogProps) {
    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle>Product Details - {product.name}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow">
                     <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-2">Images</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {product.images.map((img, index) => (
                                            <div key={index} className="relative aspect-square">
                                                <Image src={img} alt={`${product.name} image ${index + 1}`} fill className="object-cover rounded-md" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                     <h3 className="font-semibold mb-2">Description</h3>
                                     <p className="text-sm text-muted-foreground">{product.description}</p>
                                     <Separator className="my-4"/>
                                     <h3 className="font-semibold mb-2">Specifications</h3>
                                     <p className="text-sm text-muted-foreground">{product.specifications || 'N/A'}</p>
                                    <Separator className="my-4"/>
                                     <h3 className="font-semibold mb-2">Wash Instructions</h3>
                                     <p className="text-sm text-muted-foreground">{product.washInstructions || 'N/A'}</p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <div className="flex justify-between"><span>Product ID</span> <span className="font-mono text-xs">{product.id}</span></div>
                                     <div className="flex justify-between"><span>Category</span> <span className="capitalize">{product.category.replace('-', ' ')}</span></div>
                                     <div className="flex justify-between"><span>Bestseller</span> <Badge variant={product.bestseller ? "default" : "secondary"}>{product.bestseller ? 'Yes' : 'No'}</Badge></div>
                                     <div className="flex justify-between"><span>Date Added</span> <span>{format(new Date(product.createdAt), 'MMM d, yyyy')}</span></div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <h3 className="font-semibold mb-2">Pricing & Stock</h3>
                                      <div className="flex justify-between"><span>Price</span> <span>Rs. {product.price.toLocaleString('en-IN')}</span></div>
                                      <div className="flex justify-between"><span>Strikeout Price</span> <span>Rs. {product.strikeoutPrice?.toLocaleString('en-IN') || 'N/A'}</span></div>
                                      <div className="flex justify-between"><span>Stock Quantity</span> <span>{product.quantity}</span></div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <h3 className="font-semibold mb-2">Available Sizes</h3>
                                     <div className="flex flex-wrap gap-2">
                                        {product.sizes && product.sizes.length > 0 ? product.sizes.map(s => <Badge key={s} variant="outline">{s}</Badge>) : <p>No sizes specified.</p>}
                                     </div>
                                </CardContent>
                            </Card>
                        </div>
                     </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
