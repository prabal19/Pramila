
'use client'

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ReturnRequest, PopulatedUser } from "@/lib/types"
import { format } from "date-fns"

interface ReturnDetailsDialogProps {
    returnRequest: ReturnRequest | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ReturnDetailsDialog({ returnRequest, open, onOpenChange }: ReturnDetailsDialogProps) {
    if (!returnRequest) return null;

    const user = returnRequest.userId as PopulatedUser;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle>Return Details - #RTN{returnRequest.returnId}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow">
                     <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                     <h3 className="font-semibold mb-2">Product Information</h3>
                                     <div className="flex gap-4">
                                        {returnRequest.productId.images?.[0] && (
                                            <div className="relative w-24 h-32 shrink-0">
                                                <Image src={returnRequest.productId.images[0]} alt={returnRequest.productId.name} fill className="object-cover rounded-md"/>
                                            </div>
                                        )}
                                        <div className="text-sm">
                                            <p className="font-bold">{returnRequest.productId.name}</p>
                                        </div>
                                     </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                     <h3 className="font-semibold mb-2">Return Details</h3>
                                     <div className="space-y-4 text-sm">
                                         <p><strong className="font-medium text-muted-foreground w-28 inline-block">Reason:</strong> {returnRequest.reason}</p>
                                         <p><strong className="font-medium text-muted-foreground w-28 inline-block">Description:</strong> {returnRequest.description || 'N/A'}</p>
                                     </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <h3 className="font-semibold mb-4">Status & Dates</h3>
                                     <div className="flex justify-between"><span>Status</span> <Badge variant="secondary">{returnRequest.status}</Badge></div>
                                     <div className="flex justify-between"><span>Requested On</span> <span>{format(new Date(returnRequest.createdAt), 'PP')}</span></div>
                                     <div className="flex justify-between"><span>Last Updated</span> <span>{format(new Date(returnRequest.updatedAt), 'PP')}</span></div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <h3 className="font-semibold mb-4">Customer Details</h3>
                                     <p>{user.firstName} {user.lastName}</p>
                                     <p className="text-muted-foreground">{user.email}</p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <h3 className="font-semibold mb-4">Original Order</h3>
                                     <p><strong className="font-medium text-muted-foreground">Order ID:</strong> #{typeof returnRequest.orderId === 'object' ? returnRequest.orderId._id.slice(-6).toUpperCase() : returnRequest.orderId.slice(-6).toUpperCase()}</p>
                                </CardContent>
                            </Card>
                        </div>
                     </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
