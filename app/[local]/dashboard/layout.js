'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineAppstore, AiOutlineDashboard } from 'react-icons/ai';
import { FiList, FiMenu, FiX } from 'react-icons/fi';
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard Overview',
      href: '/dashboard',
      icon: <AiOutlineDashboard size={20} />,
    },
    {
      name: 'Categories',
      href: '/dashboard/categories',
      icon: <AiOutlineAppstore size={20} />,
    },
    {
      name: 'Listings',
      href: '/dashboard/listings',
      icon: <FiList size={20} />,
    },
  ];

  return (
    <div className='dashboard-container'>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <div className='sidebar-header'>
          <h2 className='sidebar-title'>Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className='sidebar-close-button'
          >
            <FiX size={24} />
          </button>
        </div>
        <nav className='sidebar-nav'>
          <div className='nav-group'>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                <span className='nav-icon'>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className='main-content'>
        <header className='main-header'>
          <div className='header-container'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='menu-button'
            >
              <FiMenu size={24} />
            </button>
            <div className='user-actions'>
              {/* User profile or actions could go here */}
            </div>
          </div>
        </header>
        <main className='main-area'>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
