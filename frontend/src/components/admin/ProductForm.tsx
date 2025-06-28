'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { addProduct } from "@/actions/products";
import type { Product } from "@/lib/types";

const productSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['sharara-set', 'saree', 'draped-sets']),
  price: z.coerce.number().min(0, 'Price must be positive'),
  strikeoutPrice: z.coerce.number().optional(),
  images: z.string().min(1, 'At least one image URL is required'),
  bestseller: z.boolean().default(false),
  sizes: z.array(z.string()).optional(),
  specifications: z.string().optional(),
});

const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'CUSTOM SIZE'];

interface ProductFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFormSubmit: (refresh: boolean) => void;
    product?: Product | null;
}

export default function ProductForm({ open, onOpenChange, onFormSubmit, product }: ProductFormProps) {
    const { toast } = useToast();
    const allowedCategories = ['sharara-set', 'saree', 'draped-sets'] as const;
    type AllowedCategory = typeof allowedCategories[number];

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: product ? {
            ...product,
            productId: product.id,
            images: product.images.join(', '),
        category: allowedCategories.includes(product.category as any)
            ? (product.category as AllowedCategory)
            : 'saree',
        } : {
            productId: '',
            name: '',
            description: '',
            category: 'saree',
            price: 0,
            strikeoutPrice: undefined,
            images: '',
            bestseller: false,
            sizes: allSizes,
            specifications: '',
        },
    });

    async function onSubmit(values: z.infer<typeof productSchema>) {
        const imageArray = values.images.split(',').map(url => url.trim()).filter(url => url);
        const finalValues = { ...values, images: imageArray };

        const result = await addProduct(finalValues);

        if(result.success) {
            toast({ title: "Success!", description: `Product ${product ? 'updated' : 'created'} successfully.` });
            onFormSubmit(true);
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
            onFormSubmit(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit Product' : 'Create New Product'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="productId" control={form.control} render={({ field }) => (<FormItem><FormLabel>Product ID*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="name" control={form.control} render={({ field }) => (<FormItem><FormLabel>Name*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField name="description" control={form.control} render={({ field }) => (<FormItem><FormLabel>Description*</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="specifications" control={form.control} render={({ field }) => (<FormItem><FormLabel>Specifications</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField name="category" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Category*</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="sharara-set">Sharara Set</SelectItem><SelectItem value="saree">Saree</SelectItem><SelectItem value="draped-sets">Draped Sets</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField name="price" control={form.control} render={({ field }) => (<FormItem><FormLabel>Price*</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="strikeoutPrice" control={form.control} render={({ field }) => (<FormItem><FormLabel>Strikeout Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField name="images" control={form.control} render={({ field }) => (<FormItem><FormLabel>Image URLs*</FormLabel><FormControl><Textarea {...field} /></FormControl><FormDescription>Comma-separated list of image URLs.</FormDescription><FormMessage /></FormItem>)} />
                         <FormField name="sizes" control={form.control} render={() => (
                            <FormItem>
                                <FormLabel>Available Sizes</FormLabel>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 rounded-md border p-4">
                                    {allSizes.map((item) => (
                                        <FormField key={item} control={form.control} name="sizes" render={({ field }) => (
                                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item))}} /></FormControl>
                                                <FormLabel className="font-normal">{item}</FormLabel>
                                            </FormItem>
                                        )} />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="bestseller" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Bestseller</FormLabel><FormDescription>Mark this product as a bestseller.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Saving...' : 'Save Product'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
