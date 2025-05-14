
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Buyer, Seller } from '../types';
import { buyers, sellers } from '../data/mockData';
import { toast } from '@/components/ui/use-toast';

interface UserContextType {
  currentUser: Buyer | null;
  switchUser: (buyerId: string) => void;
  allBuyers: Buyer[];
  allSellers: Seller[];
  getSeller: (id: string) => Seller | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Buyer | null>(null);
  const [allBuyers] = useState<Buyer[]>(buyers);
  const [allSellers] = useState<Seller[]>(sellers);

  useEffect(() => {
    // Initialize with the first buyer on mount
    const savedUserId = localStorage.getItem('currentBuyerId');
    const initialBuyer = savedUserId 
      ? buyers.find(buyer => buyer.id === savedUserId) || buyers[0]
      : buyers[0];
    
    setCurrentUser(initialBuyer);
  }, []);

  const switchUser = (buyerId: string) => {
    const buyer = buyers.find(b => b.id === buyerId);
    if (buyer) {
      setCurrentUser(buyer);
      localStorage.setItem('currentBuyerId', buyerId);
      toast({
        title: "Profile Switched",
        description: `You are now browsing as ${buyer.name}`,
      });
    }
  };

  const getSeller = (id: string) => {
    return allSellers.find(seller => seller.id === id);
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      switchUser,
      allBuyers,
      allSellers,
      getSeller,
    }}>
      {children}
    </UserContext.Provider>
  );
};
