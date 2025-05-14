
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import MessageForm from '@/components/MessageForm';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { products } from '@/data/mockData';
import { Product } from '@/types';
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react';

const ProductDetailPage = () => {
  const { sellerId, productId } = useParams<{ sellerId: string, productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  const { getSeller } = useUser();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const seller = product ? getSeller(product.sellerId) : null;
  const favorited = product ? isFavorite(product.id) : false;
  
  useEffect(() => {
    if (productId && sellerId) {
      // Find the product
      const foundProduct = products.find(p => p.id === productId && p.sellerId === sellerId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Find related products (same category, excluding current)
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        
        setRelatedProducts(related);
      }
    }
    
    // Reset quantity when product changes
    setQuantity(1);
  }, [productId, sellerId]);
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && (!product || newQuantity <= product.inventory)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  if (!product || !seller) {
    return (
      <div className="ceramics-container py-12 text-center">
        <h2 className="text-2xl mb-4">Product not found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/explore">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="py-10">
      <div className="ceramics-container">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="text-gray-500 hover:text-ceramic-secondary">Home</Link></li>
            <li className="text-gray-500">/</li>
            <li><Link to="/explore" className="text-gray-500 hover:text-ceramic-secondary">Explore</Link></li>
            <li className="text-gray-500">/</li>
            <li><Link to={`/explore?category=${product.category}`} className="text-gray-500 hover:text-ceramic-secondary">{product.category}</Link></li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900 font-medium truncate">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Images */}
          <div>
            <ProductGallery images={product.images} title={product.title} />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
            
            <Link to={`/seller/${seller.id}`} className="flex items-center gap-2 mb-4 text-gray-600 hover:text-ceramic-secondary">
              <Avatar className="h-6 w-6">
                <AvatarImage src={seller.photo} />
                <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>by {seller.name}</span>
            </Link>
            
            <div className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</div>
            
            <Tabs defaultValue="description" className="mb-6">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-4">
                <p className="text-gray-700">{product.description}</p>
              </TabsContent>
              <TabsContent value="details" className="py-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability</span>
                    <span>{product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="mr-4">Quantity</span>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(1)}
                  disabled={product.inventory <= quantity}
                  className="h-8 w-8"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button 
                className="flex-1 bg-gray-600 hover:bg-ceramic-secondary gap-2"
                onClick={handleAddToCart}
                disabled={product.inventory === 0}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                className={`flex-1 gap-2 ${favorited ? 'text-red-500' : ''}`}
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
                {favorited ? 'Saved' : 'Save'}
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => setIsMessageModalOpen(true)}
              >
                Message Seller
              </Button>
            </div>

            {/* Seller Info */}
            <div className="border rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarImage src={seller.photo} alt={seller.name} />
                  <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{seller.name}</h3>
                  <p className="text-sm text-gray-500">{seller.location}</p>
                </div>
              </div>
              <p className="text-sm">{seller.style}</p>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} showAddToCart />
              ))}
            </div>
          </div>
        )}

        {/* Message Modal */}
        <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message {seller.name}</DialogTitle>
            </DialogHeader>
            <MessageForm 
              seller={seller} 
              onMessageSent={() => setIsMessageModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductDetailPage;
