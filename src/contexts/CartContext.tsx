
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Cart, CartItem, Product } from '../types';
import { carts, products } from '../data/mockData';
import { useUser } from './UserContext';
import { toast } from '@/components/ui/use-toast';

interface CartContextType {
  cart: Cart | null;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useUser();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      // Find the cart for current user or initialize a new one
      let userCart = carts.find(c => c.buyerId === currentUser.id);
      
      if (!userCart) {
        userCart = {
          buyerId: currentUser.id,
          items: [],
          updatedAt: new Date().toISOString()
        };
        carts.push(userCart);
      }
      
      setCart(userCart);
      calculateCartTotal(userCart.items);
      setCartCount(userCart.items.reduce((acc, item) => acc + item.quantity, 0));
    } else {
      setCart(null);
      setCartTotal(0);
      setCartCount(0);
    }
  }, [currentUser]);

  const calculateCartTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
    return total;
  };

  const addToCart = (product: Product, quantity: number) => {
    if (!cart || !currentUser) return;

    const existingItem = cart.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update existing item
      updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      // Add new item
      const newItem: CartItem = {
        productId: product.id,
        sellerId: product.sellerId,
        quantity: quantity,
        price: product.price,
        title: product.title,
        image: product.images[0]
      };
      
      const updatedItems = [...cart.items, newItem];
      updateCart(updatedItems);
      
      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart.`,
      });
    }
    
    // Open cart when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    if (!cart) return;
    
    const updatedItems = cart.items.filter(item => item.productId !== productId);
    updateCart(updatedItems);
    
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!cart) return;
    
    // Find the product to check inventory
    const product = products.find(p => p.id === productId);
    
    if (product && quantity > product.inventory) {
      toast({
        title: "Insufficient Stock",
        description: `Sorry, only ${product.inventory} units available.`,
        variant: "destructive"
      });
      quantity = product.inventory;
    }
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedItems = cart.items.map(item => 
      item.productId === productId
        ? { ...item, quantity }
        : item
    );
    
    updateCart(updatedItems);
  };

  const updateCart = (items: CartItem[]) => {
    if (!cart || !currentUser) return;
    
    const updatedCart: Cart = {
      ...cart,
      items: items,
      updatedAt: new Date().toISOString()
    };
    
    // Update in-memory cart data
    const cartIndex = carts.findIndex(c => c.buyerId === currentUser.id);
    if (cartIndex >= 0) {
      carts[cartIndex] = updatedCart;
    }
    
    setCart(updatedCart);
    calculateCartTotal(items);
    setCartCount(items.reduce((acc, item) => acc + item.quantity, 0));
  };

  const clearCart = () => {
    if (!cart) return;
    updateCart([]);
    
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartTotal,
      cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};
