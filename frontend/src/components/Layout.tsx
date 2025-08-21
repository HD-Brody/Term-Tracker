"use client";
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

export default function Layout({ children, activePage = 'Dashboard' }: LayoutProps) {
  return (
    <Sidebar activePage={activePage}>
      {children}
    </Sidebar>
  );
}
