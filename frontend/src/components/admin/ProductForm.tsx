
'use client'

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { addProduct, updateProduct, addCategory, updateCategory, deleteCategory } from "@/actions/products";
import { uploadImage } from "@/actions/upload";
import type { Product, Category } from "@/lib/types";
import { getCategories } from "@/lib/categories";
import { Plus, Check as CheckIcon, MoreVertical, Pencil, Trash2, Upload } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "../ui/skeleton";

const addProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  strikeoutPrice: z.coerce.number().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  bestseller: z.boolean().default(false),
  sizes: z.array(z.string()).optional(),
  specifications: z.string().optional(),
  quantity: z.coerce.number().min(0, "Quantity can't be negative").default(0),
});

const updateProductSchema = addProductSchema;

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
    const [isUploading, setIsUploading] = useState(false);

    const formSchema = product ? updateProductSchema : addProductSchema;
    
    const defaultValues = product ? {
        ...product,
    } : {
        name: '',
        description: '',
        category: '',
        price: 0,
        strikeoutPrice: undefined,
        images: [],
        bestseller: false,
        sizes: allSizes,
        specifications: '',
        quantity: 0,
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    
    const selectedCategorySlug = useWatch({ control: form.control, name: 'category' });

    const fetchCategories = async () => {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.sort((a,b) => a.name.localeCompare(b.name)));
    };

    useEffect(() => {
        fetchCategories();
        form.reset(defaultValues);
    }, [product, open]);

    const handleCategoryAdded = (newCategory: Category) => {
        setCategories(prev => [...prev, newCategory].sort((a,b) => a.name.localeCompare(b.name)));
        form.setValue('category', newCategory.slug);
        setShowAddCategory(false);
    };
    
    const handleCategoryEdited = async () => {
        await fetchCategories();
    }

    const handleCategoryDeleted = (deletedSlug: string) => {
        setCategories(prev => prev.filter(c => c.slug !== deletedSlug));
        if (form.getValues('category') === deletedSlug) {
            form.setValue('category', '');
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('image', file);
            setIsUploading(true);

            const result = await uploadImage(formData);
            setIsUploading(false);

            if (result.success && result.url) {
                const currentImages = form.getValues('images') || [];
                form.setValue('images', [...currentImages, result.url], { shouldValidate: true });
                toast({ title: 'Success', description: 'Image uploaded successfully.' });
            } else {
                toast({ variant: 'destructive', title: 'Upload Failed', description: result.message });
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        const currentImages = form.getValues('images') || [];
        form.setValue('images', currentImages.filter((_, index) => index !== indexToRemove));
    };


    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = product 
            ? await updateProduct(product.id, values as z.infer<typeof updateProductSchema>) 
            : await addProduct(values as z.infer<typeof addProductSchema>);

        if(result.success) {
            toast({ title: "Success!", description: `Product ${product ? 'updated' : 'created'} successfully.` });
            onFormSubmit(true);
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
            onFormSubmit(false);
        }
    }
    
    const CategoryActions = () => {
        const selectedCategory = categories.find(c => c.slug === selectedCategorySlug);
        const [isEditOpen, setIsEditOpen] = useState(false);
        const [newName, setNewName] = useState(selectedCategory?.name || '');
    
        const handleEdit = async () => {
            if (!selectedCategory) return;
            const result = await updateCategory(selectedCategory._id, { name: newName });
            if (result.success) {
                toast({ title: "Category updated" });
                setIsEditOpen(false);
                await handleCategoryEdited();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.message });
            }
        };

        const handleDelete = async () => {
            if (!selectedCategory) return;
            const result = await deleteCategory(selectedCategory._id);
             if (result.success) {
                toast({ title: "Category deleted" });
                handleCategoryDeleted(selectedCategory.slug);
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.message });
            }
        };
        
        if (!selectedCategory) return null;

        return (
            <>
                <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Edit Category Name</AlertDialogTitle>
                            <AlertDialogDescription>
                                Current name: "{selectedCategory.name}". Changing this will update it everywhere.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Input value={newName} onChange={e => setNewName(e.target.value)} />
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleEdit}>Save Changes</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => { setNewName(selectedCategory.name); setIsEditOpen(true);}}>
                            <Pencil className="mr-2 h-4 w-4"/> Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4"/> Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete "{selectedCategory.name}"?</AlertDialogTitle>
                                    <AlertDialogDescription>This cannot be undone. Products in this category will need to be reassigned.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete Category</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit Product' : 'Create New Product'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
                        {product && (
                            <FormItem>
                                <FormLabel>Product ID</FormLabel>
                                <FormControl><Input value={product.id} disabled /></FormControl>
                            </FormItem>
                        )}
                        <FormField name="name" control={form.control} render={({ field }) => (<FormItem><FormLabel>Name*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                                <CategoryActions/>
                                </div>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        {showAddCategory && <AddCategoryForm onCategoryAdded={handleCategoryAdded} />}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField name="price" control={form.control} render={({ field }) => (<FormItem><FormLabel>Price*</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="strikeoutPrice" control={form.control} render={({ field }) => (<FormItem><FormLabel>Strikeout Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="quantity" control={form.control} render={({ field }) => (<FormItem><FormLabel>Quantity*</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        
                        <FormField name="images" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Images*</FormLabel>
                                <div className="space-y-4">
                                    {field.value?.map((url, index) => (
                                        <div key={index} className="relative w-full h-60 rounded-md border flex items-center justify-center bg-muted/20">
                                            <Image src={url} alt={`Product image ${index + 1}`} fill className="object-contain rounded-md" />
                                            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={() => removeImage(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="w-full h-60 rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center relative bg-muted/20">
                                        {isUploading ? <Skeleton className="w-full h-full" /> : (
                                            <div className="text-center text-muted-foreground p-2">
                                                <Upload className="mx-auto h-8 w-8" />
                                                <p className="mt-2">Click to upload or drag & drop</p>
                                            </div>
                                        )}
                                        <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />

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
