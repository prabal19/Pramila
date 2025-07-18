'use client'

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { addProduct, addCategory } from "@/actions/products";
import type { Product, Category } from "@/lib/types";
import { getCategories } from "@/lib/categories";
import { Plus, Check as CheckIcon } from "lucide-react";

const productSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  strikeoutPrice: z.coerce.number().optional(),
  images: z.string().min(1, 'At least one image URL is required'),
  bestseller: z.boolean().default(false),
  sizes: z.array(z.string()).optional(),
  specifications: z.string().optional(),
});

const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required.'),
    parent: z.enum(['collection', 'accessory']),
});

const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'CUSTOM SIZE'];

interface ProductFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFormSubmit: (refresh: boolean) => void;
    product?: Product | null;
}

const AddCategoryForm = ({ onCategoryAdded }: { onCategoryAdded: (newCategory: Category) => void }) => {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const categoryForm = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: '', parent: 'collection' }
    });
    
    const onCategorySubmit = async (values: z.infer<typeof categorySchema>) => {
        setIsSaving(true);
        const result = await addCategory(values);
        setIsSaving(false);
        if (result.success && result.data) {
            toast({ title: "Success!", description: "New category added." });
            onCategoryAdded(result.data);
            categoryForm.reset();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    }

    return (
        <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="flex items-end gap-2 p-4 border rounded-md bg-muted">
                <FormField name="name" control={categoryForm.control} render={({ field }) => (
                    <FormItem className="flex-grow"><FormLabel>New Category Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="parent" control={categoryForm.control} render={({ field }) => (
                     <FormItem><FormLabel>Parent</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="collection">Collection</SelectItem><SelectItem value="accessory">Accessory</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <Button type="submit" size="icon" disabled={isSaving}><CheckIcon className="w-4 h-4" /></Button>
            </form>
        </Form>
    );
};

export default function ProductForm({ open, onOpenChange, onFormSubmit, product }: ProductFormProps) {
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [showAddCategory, setShowAddCategory] = useState(false);

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: product ? {
            ...product,
            productId: product.id,
            images: product.images.join(', '),
        } : {
            productId: '',
            name: '',
            description: '',
            category: '',
            price: 0,
            strikeoutPrice: undefined,
            images: '',
            bestseller: false,
            sizes: allSizes,
            specifications: '',
        },
    });

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const handleCategoryAdded = (newCategory: Category) => {
        const updatedCategories = [...categories, newCategory].sort((a, b) => a.name.localeCompare(b.name));
        setCategories(updatedCategories);
        form.setValue('category', newCategory.slug);
        setShowAddCategory(false);
    };

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
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <FormField name="category" control={form.control} render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel>Category*</FormLabel>
                                <div className="flex gap-2">
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {categories.map(cat => <SelectItem key={cat._id} value={cat.slug}>{cat.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Button type="button" variant="outline" size="icon" onClick={() => setShowAddCategory(!showAddCategory)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                                </div>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        {showAddCategory && <AddCategoryForm onCategoryAdded={handleCategoryAdded} />}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
