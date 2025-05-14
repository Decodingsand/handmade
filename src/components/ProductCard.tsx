
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

const ProductCard = ({ product, showAddToCart = false }: ProductCardProps) => {
  const { getSeller } = useUser();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const seller = getSeller(product.sellerId);
  const favorited = isFavorite(product.id);
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <Link to={`/product/${product.sellerId}/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full ${favorited ? 'text-red-500' : 'text-gray-400'}`}
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`} />
        </Button>
        {product.featured && (
          <div className="absolute top-2 left-2 featured-badge text-ceramic-secondary text-xs font-medium px-2 py-1 rounded-md">
            Featured
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow">
        <Link to={`/product/${product.sellerId}/${product.id}`} className="block">
          <h3 className="font-medium text-lg line-clamp-2">{product.title}</h3>
        </Link>
        <Link to={`/seller/${product.sellerId}`} className="text-sm text-gray-500 hover:text-ceramic-secondary mt-1 block">
          by {seller?.name}
        </Link>
        <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/product/${product.sellerId}/${product.id}`} className="w-full">
          <Button 
            className="w-full view-product-button"
          >
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
