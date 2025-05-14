
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Seller } from '@/types';

interface SellerCardProps {
  seller: Seller;
}

const SellerCard = ({ seller }: SellerCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-square overflow-hidden">
        <img 
          src={seller.photo} 
          alt={seller.name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <CardContent className="p-4 flex-grow">
        <h3 className="font-medium text-lg">{seller.name}</h3>
        <p className="text-sm text-gray-500">{seller.location}</p>
        <p className="text-sm text-gray-700 mt-2 italic">{seller.style}</p>
        <p className="mt-2 line-clamp-3 text-sm">{seller.bio}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-gray-600 hover:bg-ceramic-secondary">
          <Link to={`/seller/${seller.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SellerCard;
