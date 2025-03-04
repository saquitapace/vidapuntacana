'use client';

import PreLoader from '@/src/components/PreLoader';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import './styles.css';
const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalListings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes, listingsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/listings/preview'),
        ]);

        const categories = await categoriesRes.json();
        const listings = await listingsRes.json();

        setStats({
          totalCategories: categories.length || 0,
          totalListings: listings?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className='loading-container'>
        <PreLoader />
      </div>
    );
  }

  return (
    <div className='dashboard-overview'>
      <h1 className='dashboard-title'>Dashboard Overview</h1>

      <div className='dashboard-stats'>
        <div className='card'>
          <h2 className='card-title'>Total Categories</h2>
          <p className='card-value blue'>{stats.totalCategories}</p>
          <Link href='/dashboard/categories' className='card-link blue'>
            View all categories <span className='card-link-arrow'>→</span>
          </Link>
        </div>

        <div className='card'>
          <h2 className='card-title'>Total Listings</h2>
          <p className='card-value green'>{stats.totalListings}</p>
          <Link href='/dashboard/listings' className='card-link green'>
            View all listings <span className='card-link-arrow'>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
