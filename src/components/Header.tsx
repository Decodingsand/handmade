
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { MenuIcon, ShoppingCart, Heart, X } from 'lucide-react';

const Header = () => {
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { currentUser, allBuyers, switchUser } = useUser();
  const { favoritesCount } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="py-4 px-4 md:px-6 w-full bg-ceramic-light border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-ceramic-secondary font-semibold text-xl md:text-2xl">
            Ceramic<span className="text-ceramic-accent font-bold">Space</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-ceramic-secondary">Home</Link>
          <Link to="/explore" className="text-gray-700 hover:text-ceramic-secondary">Explore</Link>
          <Link to="/sellers" className="text-gray-700 hover:text-ceramic-secondary">Sellers</Link>
          <Link to="/favorites" className="text-gray-700 hover:text-ceramic-secondary">Favorites</Link>
          <Link to="/seller/dashboard" className="text-gray-700 hover:text-ceramic-secondary">Seller Dashboard</Link>
        </nav>
        
        {/* User Controls */}
        <div className="flex items-center space-x-4">
          {/* Profile Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="Profile">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 text-sm font-medium border-b">
                Switch Profile
              </div>
              {allBuyers.map(buyer => (
                <DropdownMenuItem 
                  key={buyer.id} 
                  className="cursor-pointer flex items-center gap-2 p-2"
                  onClick={() => switchUser(buyer.id)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={buyer.avatar} alt={buyer.name} />
                    <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{buyer.name}</span>
                  {currentUser?.id === buyer.id && (
                    <span className="ml-auto text-xs bg-ceramic-accent rounded-full px-2 py-0.5 text-ceramic-secondary">
                      Active
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Favorites Button */}
          <Link to="/favorites" className="relative">
            <Button variant="ghost" size="icon" aria-label="Favorites">
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-ceramic-secondary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Button>
          </Link>
          
          {/* Cart Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative" 
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-ceramic-secondary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
          
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <SheetClose asChild>
                  <Link to="/" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/explore" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Explore</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/sellers" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Sellers</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/favorites" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Favorites</Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
