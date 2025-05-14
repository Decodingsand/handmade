
import React from 'react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/mockData';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="overflow-x-auto flex space-x-2 pb-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className={selectedCategory === category ? "bg-ceramic-accent text-ceramic-secondary" : ""}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
