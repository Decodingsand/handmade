
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser } from './UserContext';
import { Product } from '../types';
import { products as allProducts } from '../data/mockData';
import { toast } from '@/components/ui/use-toast';

interface FavoritesContextType {
  favorites: string[];
  favoriteProducts: Product[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useUser();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (currentUser) {
      setFavorites(currentUser.favorites || []);
      
      // Get the full product objects for favorites
      const favProducts = allProducts.filter(product => 
        currentUser.favorites.includes(product.id)
      );
      setFavoriteProducts(favProducts);
    } else {
      setFavorites([]);
      setFavoriteProducts([]);
    }
  }, [currentUser]);

  const toggleFavorite = (productId: string) => {
    if (!currentUser) return;

    let updatedFavorites: string[];
    
    if (favorites.includes(productId)) {
      // Remove from favorites
      updatedFavorites = favorites.filter(id => id !== productId);
      toast({
        title: "Removed from Favorites",
        description: "Item removed from your favorites.",
      });
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, productId];
      toast({
        title: "Added to Favorites",
        description: "Item added to your favorites.",
      });
    }
    
    setFavorites(updatedFavorites);
    
    // Update the favorite products array
    const favProducts = allProducts.filter(product => 
      updatedFavorites.includes(product.id)
    );
    setFavoriteProducts(favProducts);
    
    // Update the current user object (in a real app, this would persist to backend)
    if (currentUser) {
      currentUser.favorites = updatedFavorites;
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      favoriteProducts,
      toggleFavorite,
      isFavorite,
      favoritesCount: favorites.length,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
