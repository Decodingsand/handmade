import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface SellerAdminButtonProps {
  sellerId: string;
}

const SellerAdminButton = ({ sellerId }: SellerAdminButtonProps) => {
  return (
    <Button 
      asChild
      className="bg-ceramic-primary hover:bg-opacity-90 flex items-center gap-2"
    >
      <Link to={`/seller/${sellerId}/dashboard`}>
        <Settings className="h-4 w-4" />
        Manage Products
      </Link>
    </Button>
  );
};

export default SellerAdminButton;
