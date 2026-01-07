
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0a] text-zinc-100">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 border-r border-zinc-800 bg-[#0d0d0d] hidden md:flex flex-col">
        {sidebar}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
};
