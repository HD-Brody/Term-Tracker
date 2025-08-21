"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  activePage?: string;
  children?: React.ReactNode;
}

export default function Sidebar({ activePage = 'Dashboard', children }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/'},
    { name: 'Courses', href: '/courses'},
    { name: 'Tasks', href: '/tasks'},
    { name: 'Calendar', href: '/calendar'},
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Control text visibility with delay to match width transition
  useEffect(() => {
    if (isExpanded) {
      // Show text after width transition starts
      const timer = setTimeout(() => setShowText(true), 180);
      return () => clearTimeout(timer);
    } else {
      // Hide text immediately when collapsing
      setShowText(false);
    }
  }, [isExpanded]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        className={`
          bg-accent1 shadow-lg transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-16'}
          flex flex-col items-center relative
        `}
        onClick={toggleSidebar}
      >
        {/* Logo Section */}
        <div className="w-full p-4 flex items-center justify-center">
          {showText ? (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faBook} size="2x" className="text-text" />
              <span className="text-text font-bold text-[25px]">TermTracker</span>
            </div>
          ) : (
            <FontAwesomeIcon icon={faBook} size="2x" className="text-text" />
          )}
        </div>

        {/* Navigation Links - Only show when expanded */}
        {showText && (
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-2">
            <div className="flex flex-col items-start">
              {navigationItems.map((item) => (
                <div key={item.name} className="mb-2 w-full">
                  <div
                    className={`
                      flex items-center py-3 rounded-lg transition-colors duration-200
                      ${activePage === item.name 
                        ? 'text-text font-bold' 
                        : 'text-text'
                      }
                    `}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={item.href}
                      className="ml-4 text-[25px] hover:underline cursor-pointer"
                    >
                      {item.name}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toggle Button - Centered when closed, fixed distance from right when expanded */}
        <div className={`
          absolute top-1/2 transform -translate-y-1/2 transition-all duration-300
          ${isExpanded ? 'right-4' : 'left-1/2 -translate-x-1/2'}
        `}>
          <button
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
      <main className="flex-1 bg-[#FFFBF0] overflow-auto px-40 py-20">
        {children}
      </main>
    </div>
  );
}
