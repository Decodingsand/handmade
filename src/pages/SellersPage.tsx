
import React from 'react';
import SellerCard from '@/components/SellerCard';
import { sellers } from '@/data/mockData';

const SellersPage = () => {
  return (
    <div className="py-10">
      <div className="ceramics-container">
        <h1 className="text-3xl font-semibold mb-6">Our Artisans</h1>
        
        <p className="text-lg text-gray-700 max-w-3xl mb-8">
          Meet the talented ceramic artists behind our marketplace. Each artisan brings their unique style, 
          techniques, and passion to create beautiful handcrafted pieces.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sellers.map(seller => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellersPage;
