
import React from 'react';
import { Button } from '@/components/ui/button';
import FeaturedSection from '@/components/FeaturedSection';
import SearchBar from '@/components/SearchBar';
import SellerCard from '@/components/SellerCard';
import { Link, useNavigate } from 'react-router-dom';
import { products, sellers } from '@/data/mockData';

const HomePage = () => {
  const navigate = useNavigate();
  // Get featured products
  const featuredProducts = products.filter(product => product.featured);
  // Get featured sellers
  const featuredSellers = sellers.filter(seller => seller.featured);

  const handleSearch = (query: string) => {
    navigate(`/explore?search=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-ceramic-light py-16 md:py-24">
        <div className="ceramics-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-ceramic-secondary leading-tight">
                Handcrafted Ceramics with Soul
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Discover unique pieces from talented artisans around the world. 
                Each item tells a story of creativity and craftsmanship.
              </p>
              <div className="max-w-md mb-8">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-ceramic-accent text-ceramic-secondary hover:bg-opacity-80">
                  <Link to="/explore">Explore Collection</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/sellers">Meet the Artisans</Link>
                </Button>
              </div>
            </div>
            <div className="order-1 md:order-2 hero-container">
              <div className="rounded-lg overflow-hidden hero-image">
                <img 
                  src="/heroes/pottery_in_motion.jpg" 
                  alt="Pottery in motion - hands crafting ceramic art" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="py-12 bg-gray-50">
        <div className="ceramics-container">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link to="/explore?category=Kitchen" className="relative group overflow-hidden rounded-lg">
              <img 
                src="/headers/kitchen_header_new.jpg" 
                alt="Kitchen Ceramics Crafting" 
                className="w-full h-60 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold">Kitchen</h3>
              </div>
            </Link>
            <Link to="/explore?category=Home" className="relative group overflow-hidden rounded-lg">
              <img 
                src="/headers/home_header_new.jpg" 
                alt="Home Decor Crafting" 
                className="w-full h-60 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold">Home Decor</h3>
              </div>
            </Link>
            <Link to="/explore?category=Garden" className="relative group overflow-hidden rounded-lg">
              <img 
                src="/headers/garden_header_new.jpg" 
                alt="Garden Ceramics Crafting" 
                className="w-full h-60 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold">Garden</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedSection 
        title="Featured Pieces" 
        products={featuredProducts} 
        viewAllLink="/explore" 
      />

      {/* Featured Seller */}
      {featuredSellers.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="ceramics-container">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8">Featured Artisan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={featuredSellers[0].photo}
                  alt={featuredSellers[0].name}
                  className="w-full h-auto"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{featuredSellers[0].name}</h3>
                <p className="text-gray-500 mb-2">{featuredSellers[0].location}</p>
                <p className="italic mb-4">{featuredSellers[0].style}</p>
                <p className="mb-6">{featuredSellers[0].bio}</p>
                <Button asChild className="bg-gray-600 hover:bg-ceramic-secondary">
                  <Link to={`/seller/${featuredSellers[0].id}`}>View Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Artisan Spotlight */}
      <section className="py-12">
        <div className="ceramics-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Meet Our Artisans</h2>
            <Link to="/sellers">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="ceramics-container">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">Customer Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <svg className="w-20 h-12 text-ceramic-accent" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4 text-center">
                "The craftsmanship is amazing. I've bought several pieces for my home, and they're all perfect conversation starters."
              </p>
              <div className="text-center">
                <p className="font-medium">Sarah K.</p>
                <p className="text-sm text-gray-500">Seattle, WA</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <svg className="w-20 h-12 text-ceramic-accent" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4 text-center">
                "Being able to connect directly with the artists makes each purchase special. I love knowing the story behind my ceramics."
              </p>
              <div className="text-center">
                <p className="font-medium">Michael T.</p>
                <p className="text-sm text-gray-500">Brooklyn, NY</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <svg className="w-20 h-12 text-ceramic-accent" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4 text-center">
                "The quality of these ceramics is exceptional. Each piece is unique and beautifully made. I'll definitely be back for more."
              </p>
              <div className="text-center">
                <p className="font-medium">Jessica R.</p>
                <p className="text-sm text-gray-500">Austin, TX</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
