
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const { favoriteProducts } = useFavorites();
  
  return (
    <div className="py-10">
      <div className="ceramics-container">
        <h1 className="text-3xl font-semibold mb-6">Your Favorites</h1>
        
        {favoriteProducts.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl mb-4">No favorites yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Save your favorite ceramic pieces by clicking the heart icon on any product.
            </p>
            <Button asChild>
              <Link to="/explore">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id} product={product} showAddToCart />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
