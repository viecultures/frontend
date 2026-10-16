import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/Footer';

export const PublicLayout: React.FC = () => {
  return (
    <>
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
