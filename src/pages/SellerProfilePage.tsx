
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProductCard from '@/components/ProductCard';
import MessageForm from '@/components/MessageForm';
import { useUser } from '@/contexts/UserContext';
import { useMessages } from '@/contexts/MessageContext';
import { products } from '@/data/mockData';
import { Product, Seller } from '@/types';
import { MessageSquare } from 'lucide-react';

const SellerProfilePage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  const { getSeller } = useUser();
  const { getMessagesBetween } = useMessages();
  
  useEffect(() => {
    if (sellerId) {
      const foundSeller = getSeller(sellerId);
      
      if (foundSeller) {
        setSeller(foundSeller);
        
        // Get seller's products
        const sellerProds = products.filter(p => p.sellerId === sellerId);
        setSellerProducts(sellerProds);
      }
    }
  }, [sellerId, getSeller]);
  
  if (!seller) {
    return (
      <div className="ceramics-container py-12 text-center">
        <h2 className="text-2xl mb-4">Seller not found</h2>
        <p className="mb-6">The seller profile you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/sellers">View All Sellers</Link>
        </Button>
      </div>
    );
  }
  
  // Get messages with this seller
  const messages = getMessagesBetween(sellerId);
  
  return (
    <div className="py-10">
      <div className="ceramics-container">
        {/* Profile Header */}
        <div className="bg-gray-50 rounded-lg p-6 md:p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="aspect-square max-w-xs mx-auto md:mx-0 rounded-full overflow-hidden">
                <img 
                  src={seller.photo} 
                  alt={seller.name} 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h1 className="text-3xl font-semibold mb-2">{seller.name}</h1>
              <p className="text-gray-600 mb-4">{seller.location}</p>
              
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-1">Style</h2>
                <p className="italic">{seller.style}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-1">About</h2>
                <p>{seller.bio}</p>
              </div>
              
              <Button 
                className="bg-ceramic-secondary hover:bg-opacity-90 flex items-center gap-2"
                onClick={() => setIsMessageModalOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
                Contact {seller.name}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Products Section */}
        <h2 className="text-2xl font-semibold mb-6">Products by {seller.name}</h2>
        
        {sellerProducts.length === 0 ? (
          <div className="py-8 text-center">
            <p>No products available from this seller at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sellerProducts.map(product => (
              <ProductCard key={product.id} product={product} showAddToCart />
            ))}
          </div>
        )}
        
        {/* Message History (if any) */}
        {messages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Your Message History</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              {messages.map((message, index) => (
                <div key={message.id} className="mb-4 last:mb-0">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {message.buyerId !== sellerId ? 'Y' : seller.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {message.buyerId !== sellerId ? 'You' : seller.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsMessageModalOpen(true)}
                >
                  Send Another Message
                </Button>
              </div>
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

export default SellerProfilePage;
