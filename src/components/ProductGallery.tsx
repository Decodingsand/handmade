
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

const ProductGallery = ({ images, title }: ProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
        <img
          src={images[activeImage]}
          alt={`${title} - Image ${activeImage + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "aspect-square overflow-hidden rounded-md border-2",
              activeImage === index 
                ? "border-ceramic-accent" 
                : "border-transparent hover:border-gray-300"
            )}
            onClick={() => setActiveImage(index)}
          >
            <img
              src={image}
              alt={`${title} - Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
