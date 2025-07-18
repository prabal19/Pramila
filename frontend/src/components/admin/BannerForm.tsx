
'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Upload, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { addBanner, updateBanner } from "@/actions/banners";
import { uploadImage } from "@/actions/upload";
import type { Banner } from "@/lib/types";
import BannerPreview from "./BannerPreview";
import { Skeleton } from "../ui/skeleton";

const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Please provide an image." }).optional().or(z.literal('')),
  buttonText: z.string().optional(),
  buttonLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  position: z.enum(['above-header', 'top-of-page', 'after-section', 'bottom-of-page']),
  targetPages: z.array(z.string()).min(1, { message: "Select at least one page." }),
  sectionIdentifier: z.string().optional(),
  order: z.coerce.number().optional(),
  isActive: z.boolean().default(false),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  animation: z.enum(['none', 'fade', 'slide', 'zoom']).default('none'),
  clickableImage: z.boolean().default(false),
}).refine(data => {
    if (data.position === 'after-section') {
        return !!data.sectionIdentifier;
    }
    return true;
}, {
    message: "Section Identifier is required when position is 'After specific section'",
    path: ['sectionIdentifier'],
});

const pageOptions = [
    { id: 'all', label: 'All Pages' },
    { id: 'home', label: 'Home Page' },
    { id: 'about', label: 'About Page' },
    { id: 'contact', label: 'Contact Page' },
    { id: 'shop', label: 'Shop (All Products) Page' },
    { id: 'sharara-set', label: 'Shop (Sharara Sets) Page' },
    { id: 'saree', label: 'Shop (Sarees) Page' },
    { id: 'draped-sets', label: 'Shop (Draped Sets) Page' },
]

interface BannerFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFormSubmit: (refresh: boolean) => void;
    banner: Banner | null;
}

export default function BannerForm({ open, onOpenChange, onFormSubmit, banner }: BannerFormProps) {
    const { toast } = useToast();
    const [step, setStep] = useState<'details' | 'preview'>('details');
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<z.infer<typeof bannerSchema>>({
        resolver: zodResolver(bannerSchema),
        defaultValues: banner ? {
            ...banner,
            title: banner.title ?? '',
            subtitle: banner.subtitle ?? '',
            description: banner.description ?? '',
            imageUrl: banner.imageUrl ?? '',
            buttonText: banner.buttonText ?? '',
            buttonLink: banner.buttonLink ?? '',
            backgroundColor: banner.backgroundColor ?? '#ffffff',
            textColor: banner.textColor ?? '#000000',
            sectionIdentifier: banner.sectionIdentifier ?? '',
            order: banner.order ?? 0,
            isActive: banner.isActive ?? false,
            animation: banner.animation ?? 'none',
            clickableImage: banner.clickableImage ?? false,
            startDate: banner.startDate ? new Date(banner.startDate) : undefined,
            endDate: banner.endDate ? new Date(banner.endDate) : undefined,
        } : {
            title: '',
            subtitle: '',
            description: '',
            imageUrl: '',
            buttonText: '',
            buttonLink: '',
            backgroundColor: '#ffffff',
            textColor: '#000000',
            position: 'top-of-page',
            targetPages: [],
            sectionIdentifier: '',
            order: 0,
            isActive: false,
            animation: 'none',
            clickableImage: false,
        },
    });
    
    const watchedValues = form.watch();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('image', file);
            setIsUploading(true);

            const result = await uploadImage(formData);
            setIsUploading(false);

            if (result.success && result.url) {
                form.setValue('imageUrl', result.url, { shouldValidate: true });
                toast({ title: 'Success', description: 'Image uploaded successfully.' });
            } else {
                toast({ variant: 'destructive', title: 'Upload Failed', description: result.message });
            }
        }
    };


    const handleNextStep = async () => {
        const isValid = await form.trigger();
        if (isValid) {
            setStep('preview');
        } else {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please fill out all required fields before proceeding.',
            })
        }
    };
    
    async function onSubmit(values: z.infer<typeof bannerSchema>) {
        const result = banner 
            ? await updateBanner(banner._id, values) 
            : await addBanner(values);

        if(result.success) {
            toast({ title: "Success!", description: `Banner ${banner ? 'updated' : 'created'} successfully.` });
            onFormSubmit(true);
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
            onFormSubmit(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-none w-screen h-screen sm:h-auto sm:max-w-6xl top-0 left-0 translate-x-0 translate-y-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 rounded-none sm:rounded-lg p-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader className="p-6 border-b">
                            <DialogTitle>{banner ? 'Edit Banner' : 'Create a New Banner'}</DialogTitle>
                        </DialogHeader>

                        {step === 'details' && (
                            <div className="p-6 max-h-[calc(100vh-150px)] overflow-y-auto">
                                <Tabs defaultValue="basic">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                        <TabsTrigger value="placement">Layout & Placement</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="basic" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                        <div className="space-y-4">
                                             <FormField name="imageUrl" control={form.control} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Banner Image</FormLabel>
                                                    <FormControl>
                                                        <div className="w-full h-60 rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center relative bg-muted/20 cursor-pointer">
                                                            {isUploading ? (
                                                                <Skeleton className="w-full h-full" />
                                                            ) : field.value ? (
                                                                <>
                                                                    <Image src={field.value} alt="Banner Preview" fill className="object-contain" />
                                                                     <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={() => form.setValue('imageUrl', '')}>
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <div className="text-center text-muted-foreground">
                                                                    <Upload className="mx-auto h-8 w-8" />
                                                                    <p>Click to upload or drag & drop</p>
                                                                </div>
                                                            )}
                                                             <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField name="title" control={form.control} render={({ field }) => (
                                                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Summer Sale" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField name="subtitle" control={form.control} render={({ field }) => (
                                                <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input placeholder="Up to 50% off!" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField name="description" control={form.control} render={({ field }) => (
                                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Grab your summer essentials now." {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <div className="space-y-4">
                                            <FormField name="buttonText" control={form.control} render={({ field }) => (
                                                <FormItem><FormLabel>Button Text</FormLabel><FormControl><Input placeholder="Shop Now" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField name="buttonLink" control={form.control} render={({ field }) => (
                                                <FormItem><FormLabel>Button Link</FormLabel><FormControl><Input placeholder="/sale" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField name="backgroundColor" control={form.control} render={({ field }) => (
                                                    <FormItem><FormLabel>Background Color</FormLabel><FormControl><Input type="color" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField name="textColor" control={form.control} render={({ field }) => (
                                                    <FormItem><FormLabel>Text Color</FormLabel><FormControl><Input type="color" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="placement" className="pt-6 space-y-6">
                                        <FormField name="position" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Position*</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select where the banner appears" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="above-header">Above Header (Announcement)</SelectItem>
                                                        <SelectItem value="top-of-page">Top of page</SelectItem>
                                                        <SelectItem value="after-section">After specific section</SelectItem>
                                                        <SelectItem value="bottom-of-page">Bottom of page</SelectItem>
                                                    </SelectContent>
                                                </Select><FormMessage />
                                            </FormItem>
                                        )} />
                                        {form.watch('position') === 'after-section' && (
                                            <FormField name="sectionIdentifier" control={form.control} render={({ field }) => (
                                                <FormItem><FormLabel>Section Identifier*</FormLabel><FormControl><Input placeholder="e.g., #featured-products or .featured-section" {...field} /></FormControl><FormDescription>Unique ID or classname of the section to place banner after.</FormDescription><FormMessage /></FormItem>
                                            )} />
                                        )}
                                        <FormField name="targetPages" control={form.control} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Target Pages*</FormLabel>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-md border p-4 max-h-60 overflow-y-auto">
                                                    {pageOptions.map((item) => (
                                                        <FormField key={item.id} control={form.control} name="targetPages"
                                                            render={({ field }) => (
                                                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...(field.value || []), item.id])
                                                                                    : field.onChange(field.value?.filter((value) => value !== item.id))
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField name="order" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormDescription>For ordering multiple banners on the same page/position.</FormDescription><FormMessage /></FormItem>
                                        )} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                        
                        {step === 'preview' && (
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-h-[calc(100vh-150px)] overflow-y-auto">
                                <div className="md:col-span-2">
                                     <div className="relative w-full aspect-video overflow-hidden rounded-lg border flex items-center justify-center">
                                        <BannerPreview banner={watchedValues} />
                                     </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="font-semibold text-lg border-b pb-2">Control & Behavior</h3>
                                    <FormField control={form.control} name="isActive" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Active</FormLabel><FormDescription>Make the banner live.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name="clickableImage" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Clickable Banner</FormLabel><FormDescription>Entire banner redirects to link.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>
                                    )} />
                                    <FormField name="animation" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Animation</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    <SelectItem value="fade">Fade</SelectItem>
                                                    <SelectItem value="slide">Slide</SelectItem>
                                                    <SelectItem value="zoom">Zoom</SelectItem>
                                                </SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="startDate" render={({ field }) => (
                                        <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="endDate" render={({ field }) => (
                                        <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                        )}

                        <DialogFooter className="p-6 border-t gap-2 md:gap-0">
                             <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            {step === 'details' && (
                                <Button type="button" onClick={handleNextStep}>Show Preview</Button>
                            )}
                            {step === 'preview' && (
                                <div className="flex gap-2">
                                    <Button type="button" variant="secondary" onClick={() => setStep('details')}>Go Back</Button>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Saving...' : (banner ? 'Update Banner' : 'Make Banner')}
                                    </Button>
                                </div>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
