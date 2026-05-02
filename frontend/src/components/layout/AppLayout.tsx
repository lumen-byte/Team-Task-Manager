import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Subtle background texture for that 'handcrafted' feel */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
        </div>
        
        <div className="relative z-10 p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
