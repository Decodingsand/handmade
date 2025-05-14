
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface FeaturedSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

const FeaturedSection = ({ title, products, viewAllLink }: FeaturedSectionProps) => {
  return (
    <section className="py-10">
      <div className="ceramics-container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
          {viewAllLink && (
            <Link to={viewAllLink}>
              <Button variant="outline">View All</Button>
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
