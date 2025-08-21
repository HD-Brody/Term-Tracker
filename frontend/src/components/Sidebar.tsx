"use client";
import { useState } from 'react';

interface SidebarProps {
  activePage?: string;
  children?: React.ReactNode;
}

export default function Sidebar({ activePage = 'Dashboard', children }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Courses', href: '/courses', icon: '📚' },
    { name: 'Tasks', href: '/tasks', icon: '✅' },
    { name: 'Calendar', href: '/calendar', icon: '📅' },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        className={`
          bg-[#E8966E] shadow-lg transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-16'}
          flex flex-col items-center relative
        `}
      >
        {/* Logo Section */}
        <div className="w-full p-4 flex items-center justify-center">
          {isExpanded ? (
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-[#2D1810]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-[#2D1810] font-bold text-lg">TermTracker</span>
            </div>
          ) : (
            <svg className="w-6 h-6 text-text" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 w-full px-2">
          {navigationItems.map((item) => (
            <div key={item.name} className="mb-2">
              <a
                href={item.href}
                className={`
                  flex items-center px-3 py-3 rounded-lg transition-colors duration-200
                  ${activePage === item.name 
                    ? 'text-text font-bold bg-[#D77A61] bg-opacity-20' 
                    : 'text-text hover:bg-[#D77A61] hover:bg-opacity-10'
                  }
                  ${!isExpanded && 'justify-center'}
                `}
              >
                {/* <span className="text-lg">{item.icon}</span> */}
                {isExpanded && (
                  <span className="ml-3 text-sm">{item.name}</span>
                )}
              </a>
            </div>
          ))}
        </div>

        {/* Toggle Button - Centered in the middle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={toggleSidebar}
            className="
              w-8 h-8 rounded-full
              flex items-center justify-center transition-all duration-200
            "
          >
            <svg 
              className={`w-4 h-4 text-accent4 transition-transform duration-300 ${
                isExpanded ? 'rotate-0' : 'rotate-180'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#FFFBF0] overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
