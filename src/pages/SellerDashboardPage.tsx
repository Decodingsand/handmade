import React, { useState, useEffect } from 'react';
import '../admin-styles.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { Product, Seller } from '@/types';
import { products } from '@/data/mockData';
import { PlusCircle, MoreHorizontal, Pencil, Copy, EyeOff, Eye, Trash2 } from 'lucide-react';

const SellerDashboardPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { getSeller } = useUser();
  const { toast } = useToast();
  
  // For demonstration purposes, we'll track product status with a local state
  // In a real app, this would be part of the product data
  const [productStatus, setProductStatus] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Use sellerId from params or default to 'seller1'
    const effectiveSellerId = sellerId || 'seller1';
    const foundSeller = getSeller(effectiveSellerId);
    
    if (foundSeller) {
      setSeller(foundSeller);
      
      // Get seller's products
      const sellerProds = products.filter(p => p.sellerId === effectiveSellerId);
      setSellerProducts(sellerProds);
      
      // Initialize status for all products (assuming all are enabled by default)
      const initialStatus: Record<string, boolean> = {};
      sellerProds.forEach(product => {
        initialStatus[product.id] = true;
      });
      setProductStatus(initialStatus);
    }
  }, [sellerId, getSeller]);
  
  if (!seller) {
    return (
      <div className="ceramics-container py-12 text-center">
        <h2 className="text-2xl mb-4">Seller not found</h2>
        <p className="mb-6">The seller dashboard you're looking for doesn't exist or you don't have permission to access it.</p>
        <Button asChild>
          <Link to="/sellers">View All Sellers</Link>
        </Button>
      </div>
    );
  }
  
  const toggleProductStatus = (productId: string) => {
    setProductStatus(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
    
    toast({
      title: productStatus[productId] ? "Product Disabled" : "Product Enabled",
      description: `The product has been ${productStatus[productId] ? "disabled" : "enabled"} successfully.`,
    });
  };
  
  const handleDuplicateProduct = (product: Product) => {
    toast({
      title: "Product Duplicated",
      description: "A copy of the product has been created. You can now edit it.",
    });
  };
  
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      // In a real app, we would update the database
      // For now, we'll just update our local state
      setSellerProducts(sellerProducts.filter(p => p.id !== selectedProduct.id));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Product Deleted",
        description: "The product has been permanently removed.",
        variant: "destructive"
      });
    }
  };
  
  const activeProducts = sellerProducts.filter(product => productStatus[product.id]);
  const inactiveProducts = sellerProducts.filter(product => !productStatus[product.id]);
  
  return (
    <div className="py-10">
      <div className="ceramics-container">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">{seller.name}'s Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your products and store</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={() => navigate(sellerId ? `/seller/${sellerId}/product/new` : '/seller/products/new')}
              className="bg-ceramic-secondary hover:bg-opacity-90 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <Card>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All Products ({sellerProducts.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeProducts.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactiveProducts.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ProductTable 
                products={sellerProducts} 
                productStatus={productStatus}
                onToggleStatus={toggleProductStatus}
                onEditProduct={(product) => navigate(`/seller/${sellerId}/product/${product.id}`)}
                onDuplicateProduct={handleDuplicateProduct}
                onDeleteProduct={(product) => {
                  setSelectedProduct(product);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </TabsContent>
            
            <TabsContent value="active">
              <ProductTable 
                products={activeProducts} 
                productStatus={productStatus}
                onToggleStatus={toggleProductStatus}
                onEditProduct={(product) => navigate(`/seller/${sellerId}/product/${product.id}`)}
                onDuplicateProduct={handleDuplicateProduct}
                onDeleteProduct={(product) => {
                  setSelectedProduct(product);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </TabsContent>
            
            <TabsContent value="inactive">
              <ProductTable 
                products={inactiveProducts} 
                productStatus={productStatus}
                onToggleStatus={toggleProductStatus}
                onEditProduct={(product) => navigate(`/seller/${sellerId}/product/${product.id}`)}
                onDuplicateProduct={handleDuplicateProduct}
                onDeleteProduct={(product) => {
                  setSelectedProduct(product);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </TabsContent>
          </Tabs>
        </Card>
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
              onClick={handleDeleteProduct}
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

interface ProductTableProps {
  products: Product[];
  productStatus: Record<string, boolean>;
  onToggleStatus: (productId: string) => void;
  onEditProduct: (product: Product) => void;
  onDuplicateProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

const ProductTable = ({ 
  products, 
  productStatus, 
  onToggleStatus,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct
}: ProductTableProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto bg-white rounded-md">
      <Table className="bg-white">
        <TableHeader>
          <TableRow className="bg-white">
            <TableHead className="w-[300px] bg-white">Product</TableHead>
            <TableHead className="bg-white">Price</TableHead>
            <TableHead className="bg-white">Inventory</TableHead>
            <TableHead className="bg-white">Category</TableHead>
            <TableHead className="bg-white">Status</TableHead>
            <TableHead className="text-right bg-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="bg-white">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="truncate max-w-[230px]">
                    {product.title}
                  </div>
                </div>
              </TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.inventory}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={productStatus[product.id]} 
                    onCheckedChange={() => onToggleStatus(product.id)}
                  />
                  <span className={productStatus[product.id] ? "text-green-600" : "text-gray-500"}>
                    {productStatus[product.id] ? "Active" : "Inactive"}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 h-7" 
                    onClick={() => onEditProduct(product)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onDuplicateProduct(product)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(product.id)}>
                      {productStatus[product.id] ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Disable
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Enable
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDeleteProduct(product)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SellerDashboardPage;
