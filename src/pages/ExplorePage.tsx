
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { products } from '@/data/mockData';
import { Product } from '@/types';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Get initial values from URL
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    filterProducts(categoryParam || 'All', searchParam || '');
  }, [searchParams]);
  
  const filterProducts = (category: string, search: string) => {
    let filtered = [...products];
    
    // Filter by category
    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    // Filter by search query
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(lowerSearch) ||
        product.description.toLowerCase().includes(lowerSearch) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }
    
    setFilteredProducts(filtered);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // Update URL parameters
    searchParams.set('category', category);
    if (category === 'All') {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    
    filterProducts(category, searchQuery);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Update URL parameters
    if (query) {
      searchParams.set('search', query);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
    
    filterProducts(selectedCategory, query);
  };
  
  return (
    <div className="py-10">
      <div className="ceramics-container">
        <h1 className="text-3xl font-semibold mb-6">Explore Ceramics</h1>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="mb-4">
            <SearchBar onSearch={handleSearch} placeholder="Search products, techniques, or styles..." />
          </div>
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategoryChange} 
          />
        </div>
        
        {/* Results */}
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="text-xl mb-2">No products found</h3>
            <p className="text-gray-600">
              Try changing your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} showAddToCart={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
