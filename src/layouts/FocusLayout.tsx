import React from 'react';
import { Outlet } from 'react-router-dom';

export const FocusLayout: React.FC = () => {
  return (
    <main className="flex-1 w-full">
      <Outlet />
    </main>
  );
};

export default FocusLayout;
