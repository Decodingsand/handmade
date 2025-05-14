import React, { useState, useEffect } from 'react';
import '../admin-styles.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDashboardUrl } from '../helper';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Product, Seller } from '@/types';
import { products } from '@/data/mockData';
import { ArrowLeft, Save, Trash2, X, Plus, Minus, Upload, Image as ImageIcon } from 'lucide-react';

// Validation schema
const productSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  category: z.string({ required_error: "Please select a category" }),
  tags: z.array(z.string()).min(1, { message: "Add at least one tag" }),
  inventory: z.coerce.number().int().nonnegative({ message: "Inventory must be a non-negative integer" }),
  featured: z.boolean().default(false)
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductEditPage = () => {
  const { sellerId, productId } = useParams<{ sellerId?: string, productId?: string }>();
  // Handle both URL patterns:
  // 1. /seller/:sellerId/product/new (productId will be 'new')
  // 2. /seller/products/new (no productId in params but URL ends with 'new')
  const isNewProduct = productId === 'new' || window.location.pathname.endsWith('/products/new');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getSeller } = useUser();
  
  const [seller, setSeller] = useState<Seller | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  
  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category: '',
      tags: [],
      inventory: 0,
      featured: false
    }
  });
  
  useEffect(() => {
    // First find the product by ID if it exists
    let foundProduct = null;
    if (productId && !isNewProduct) {
      foundProduct = products.find(p => p.id === productId);
      console.log('Found product:', foundProduct);
    }
    
    // Use sellerId from params, or from the found product, or default to 'seller1'
    let effectiveSellerId;
    
    // If we have a product, always use its seller ID first
    if (foundProduct) {
      effectiveSellerId = foundProduct.sellerId;
    } else {
      // Otherwise use the URL param or default
      effectiveSellerId = sellerId || 'seller1';
    }
    
    console.log('Using seller ID:', effectiveSellerId);
    
    // Always find the seller - should always exist in our mock data
    const foundSeller = getSeller(effectiveSellerId);
    
    // For development, automatically provide the first seller if none is found
    // This prevents "Seller not found" errors during development
    if (!foundSeller && effectiveSellerId) {
      console.warn('Seller not found with ID:', effectiveSellerId, 'Using default seller');
      setSeller(getSeller('seller1'));
    } else {
      setSeller(foundSeller);
    }
    
    if (isNewProduct) {
      // For new products, just set empty defaults
      console.log('Creating new product');
      setProductImages([]);
    } else if (foundProduct) {
      setProduct(foundProduct);
      setProductImages(foundProduct.images || []);
      
      // Set form values
      form.reset({
        title: foundProduct.title,
        description: foundProduct.description,
        price: foundProduct.price,
        category: foundProduct.category,
        tags: foundProduct.tags || [],
        inventory: foundProduct.inventory,
        featured: foundProduct.featured
      });
    } else if (productId) {
      console.error('Product not found with ID:', productId);
    }
    
    setIsLoading(false);
  }, [sellerId, productId, getSeller, isNewProduct, form]);
  
  if (isLoading) {
    return (
      <div className="ceramics-container py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!seller) {
    return (
      <div className="ceramics-container py-12 text-center">
        <h2 className="text-2xl mb-4">Seller not found</h2>
        <p className="mb-6">The seller you're looking for doesn't exist or you don't have permission to edit their products.</p>
        <Button asChild>
          <Link to="/sellers">View All Sellers</Link>
        </Button>
      </div>
    );
  }
  
  if (!isNewProduct && !product) {
    return (
      <div className="ceramics-container py-12 text-center">
        <h2 className="text-2xl mb-4">Product not found</h2>
        <p className="mb-6">The product you're trying to edit doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to={`/seller/${sellerId}/dashboard`}>Back to Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  const handleAddTag = () => {
    if (currentTag.trim() && !form.getValues().tags.includes(currentTag.trim())) {
      // Ensure we're setting a non-empty array to satisfy the nonempty validation
      const currentTags = form.getValues().tags;
      const updatedTags = [...currentTags, currentTag.trim()];
      form.setValue('tags', updatedTags);
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    const filteredTags = form.getValues().tags.filter(t => t !== tag);
    
    // Ensure we always have at least one tag to satisfy the non-empty array requirement
    // If removing the last tag, add a default tag to meet TypeScript's [string, ...string[]] requirement
    if (filteredTags.length > 0) {
      form.setValue('tags', filteredTags);
    } else {
      form.setValue('tags', ['ceramics']);
    }
  };
  
  const handleAddImage = () => {
    // In a real app, this would upload an image
    // For demo purposes, we'll add a placeholder image
    const newImage = `/images/p${Math.floor(Math.random() * 10) + 1}.jpg`;
    setProductImages([...productImages, newImage]);
  };
  
  const handleRemoveImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };
  
  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === productImages.length - 1)
    ) {
      return;
    }
    
    const newImages = [...productImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setProductImages(newImages);
  };
  
  const onSubmit = (data: ProductFormValues) => {
    // In a real app, we would save to a database
    // For demo purposes, we'll just show a success message
    
    // Ensure we have images
    if (productImages.length === 0) {
      toast({
        title: "Missing Images",
        description: "Please add at least one product image",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: isNewProduct ? "Product Created" : "Product Updated",
      description: `"${data.title}" has been ${isNewProduct ? "created" : "updated"} successfully.`
    });
    
    // Navigate back to the seller dashboard
    navigate(`/seller/${sellerId}/dashboard`);
  };
  
  const handleDelete = () => {
    // In a real app, we would delete from the database
    // For demo purposes, we'll just show a success message
    toast({
      title: "Product Deleted",
      description: "The product has been permanently removed.",
      variant: "destructive"
    });
    
    // Navigate back to the seller dashboard
    navigate(`/seller/${sellerId}/dashboard`);
  };
  
  return (
    <div className="py-10">
      <div className="ceramics-container">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/seller/${sellerId}/dashboard`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-semibold">
              {isNewProduct ? "Add New Product" : `Edit ${product?.title}`}
            </h1>
          </div>
          
          {!isNewProduct && (
            <Button
              variant="outline"
              size="icon"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="images">Images ({productImages.length})</TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <TabsContent value="basic">
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                        <CardDescription>
                          Enter the basic information about your product.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter product title" {...field} />
                              </FormControl>
                              <FormDescription>
                                This will be displayed as the product name.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your product in detail..." 
                                  className="min-h-32"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Provide a detailed description of your product, including materials, dimensions, and care instructions.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    step="0.01" 
                                    placeholder="0.00" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Kitchen">Kitchen</SelectItem>
                                    <SelectItem value="Home">Home</SelectItem>
                                    <SelectItem value="Garden">Garden</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="inventory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inventory</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  step="1" 
                                  placeholder="0" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Number of items available for sale.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div>
                          <FormLabel>Tags</FormLabel>
                          <div className="flex flex-wrap gap-2 mt-2 mb-4">
                            {form.getValues().tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="gap-1 px-3 py-1">
                                {tag}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 ml-1"
                                  onClick={() => handleRemoveTag(tag)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a tag"
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddTag}
                            >
                              Add
                            </Button>
                          </div>
                          {form.formState.errors.tags && (
                            <p className="text-sm font-medium text-destructive mt-2">
                              {form.formState.errors.tags.message}
                            </p>
                          )}
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Featured Product</FormLabel>
                                <FormDescription>
                                  Featured products appear on the homepage and are highlighted in search results.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="images">
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>
                          Upload and arrange images for your product. The first image will be used as the primary image.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {productImages.map((image, index) => (
                            <div key={index} className="relative group overflow-hidden rounded-md border product-image-container">
                              <img 
                                src={image}
                                alt={`Product image ${index + 1}`}
                                className="aspect-square w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex gap-1">
                                  {index > 0 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 bg-white text-black"
                                      onClick={() => handleMoveImage(index, 'up')}
                                    >
                                      <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {index < productImages.length - 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 bg-white text-black"
                                      onClick={() => handleMoveImage(index, 'down')}
                                    >
                                      <ArrowLeft className="h-4 w-4 rotate-180" />
                                    </Button>
                                  )}
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleRemoveImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {index === 0 && (
                                <Badge className="absolute top-2 left-2 bg-ceramic-secondary">
                                  Primary
                                </Badge>
                              )}
                            </div>
                          ))}
                          
                          <Button
                            type="button"
                            variant="outline"
                            className="aspect-square flex flex-col items-center justify-center gap-2 border-dashed"
                            onClick={handleAddImage}
                          >
                            <Upload className="h-6 w-6" />
                            <span>Upload Image</span>
                          </Button>
                        </div>
                        
                        {productImages.length === 0 && (
                          <div className="rounded-md border border-destructive p-4 text-destructive text-sm flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Please add at least one product image
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <div className="mt-6 flex gap-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/seller/${sellerId}/dashboard`)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-ceramic-secondary hover:bg-opacity-90 flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isNewProduct ? "Create Product" : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </Tabs>
          </div>
          
          {/* Preview Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Product Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src={productImages[0] || '/placeholder.svg'} 
                    alt="Product preview"
                    className="aspect-square w-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg mb-1">
                  {form.getValues().title || "Product Title"}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  by {seller.name}
                </p>
                <p className="font-semibold mb-4">
                  ${form.getValues().price?.toFixed(2) || "0.00"}
                </p>
                <div className="text-sm text-gray-600 line-clamp-4 mb-4">
                  {form.getValues().description || "Product description will appear here..."}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.getValues().tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm">Inventory</div>
                    <div className="font-medium">{form.getValues().inventory || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm">Category</div>
                    <div className="font-medium">{form.getValues().category || "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-sm">Status</div>
                    <Badge variant={form.getValues().featured ? "default" : "outline"}>
                      {form.getValues().featured ? "Featured" : "Standard"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              from your store and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductEditPage;
