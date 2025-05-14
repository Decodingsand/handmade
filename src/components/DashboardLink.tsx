import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardLink = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-xl border border-gray-200">
      <h3 className="font-medium mb-2">Quick Access Links</h3>
      <div className="flex flex-col gap-2">
        <Button asChild className="bg-ceramic-secondary">
          <Link to="/seller/seller1/dashboard">
            Sophia's Dashboard
          </Link>
        </Button>
        <Button asChild className="bg-ceramic-secondary">
          <Link to="/seller/seller2/dashboard">
            Marcus's Dashboard
          </Link>
        </Button>
        <Button asChild className="bg-ceramic-secondary">
          <Link to="/seller/seller3/dashboard">
            Emma's Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardLink;
