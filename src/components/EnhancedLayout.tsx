import React from 'react';
import Layout from './Layout';
import DashboardLink from './DashboardLink';

interface EnhancedLayoutProps {
  children: React.ReactNode;
}

const EnhancedLayout = ({ children }: EnhancedLayoutProps) => {
  return (
    <>
      <Layout>
        {children}
      </Layout>
      <DashboardLink />
    </>
  );
};

export default EnhancedLayout;
