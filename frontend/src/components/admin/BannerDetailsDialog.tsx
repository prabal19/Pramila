
'use client'

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Banner } from "@/lib/types"
import { format } from "date-fns"

interface BannerDetailsDialogProps {
    banner: Banner | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BannerDetailsDialog({ banner, open, onOpenChange }: BannerDetailsDialogProps) {
    if (!banner) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle>Banner Details - {banner.title || "Untitled Banner"}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow">
                     <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            {banner.imageUrl && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="font-semibold mb-4">Image Preview</h3>
                                        <div className="relative aspect-video w-full overflow-hidden rounded-md">
                                            <Image src={banner.imageUrl} alt={banner.title || 'Banner image'} fill className="object-cover" />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            <Card>
                                <CardContent className="pt-6">
                                     <h3 className="font-semibold mb-2">Content</h3>
                                     <div className="space-y-4 text-sm">
                                         <p><strong className="font-medium text-muted-foreground w-24 inline-block">Title:</strong> {banner.title || 'N/A'}</p>
                                         <p><strong className="font-medium text-muted-foreground w-24 inline-block">Subtitle:</strong> {banner.subtitle || 'N/A'}</p>
                                         <p><strong className="font-medium text-muted-foreground w-24 inline-block">Description:</strong> {banner.description || 'N/A'}</p>
                                         <Separator />
                                          <p><strong className="font-medium text-muted-foreground w-24 inline-block">Button Text:</strong> {banner.buttonText || 'N/A'}</p>
                                         <p><strong className="font-medium text-muted-foreground w-24 inline-block">Button Link:</strong> {banner.buttonLink || 'N/A'}</p>
                                     </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <h3 className="font-semibold mb-4">Configuration</h3>
                                     <div className="flex justify-between"><span>Status</span> <Badge variant={banner.isActive ? "default" : "secondary"}>{banner.isActive ? 'Active' : 'Inactive'}</Badge></div>
                                     <div className="flex justify-between"><span>Position</span> <span className="capitalize">{banner.position.replace('-', ' ')}</span></div>
                                     {banner.position === 'after-section' && <div className="flex justify-between"><span>Section ID</span> <span>{banner.sectionIdentifier}</span></div>}
                                     <div className="flex justify-between"><span>Order</span> <span>{banner.order}</span></div>
                                     <div className="flex justify-between"><span>Animation</span> <span className="capitalize">{banner.animation}</span></div>
                                     <div className="flex justify-between"><span>Clickable</span> <span>{banner.clickableImage ? 'Yes' : 'No'}</span></div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <h3 className="font-semibold mb-4">Styling</h3>
                                      <div className="flex items-center justify-between"><span>BG Color</span><div className="w-5 h-5 rounded-full border" style={{backgroundColor: banner.backgroundColor}}></div></div>
                                      <div className="flex items-center justify-between"><span>Text Color</span><div className="w-5 h-5 rounded-full border" style={{backgroundColor: banner.textColor}}></div></div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardContent className="pt-6 text-sm space-y-2">
                                     <h3 className="font-semibold mb-4">Targeting & Schedule</h3>
                                     <div className="space-y-1">
                                        <p className="font-medium">Target Pages:</p>
                                        <div className="flex flex-wrap gap-1">{banner.targetPages.map(p => <Badge key={p} variant="outline" className="capitalize">{p}</Badge>)}</div>
                                     </div>
                                      <div className="flex justify-between pt-2"><span>Start Date</span> <span>{banner.startDate ? format(new Date(banner.startDate), 'PP') : 'N/A'}</span></div>
                                      <div className="flex justify-between"><span>End Date</span> <span>{banner.endDate ? format(new Date(banner.endDate), 'PP') : 'N/A'}</span></div>
                                </CardContent>
                            </Card>
                        </div>
                     </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
