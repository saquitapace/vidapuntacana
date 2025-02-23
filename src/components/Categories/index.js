'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './style.css';
import { capitalize } from 'lodash';
const categoryIcons = {
  stays: 'flaticon-government',
  restaurant: 'flaticon-serving-dish',
  shopping: 'flaticon-game-controller',
  bars: 'flaticon-suitcase',
  'night-clubs': 'flaticon-gift-box',
  fitness: 'flaticon-dumbbell',
};

// Skeleton loader component
const SkeletonLoader = () => (
  <div className='col-lg-2 col-md-4 category-column'>
    <div className='category-item category-item-one'>
      <div className='info text-center'>
        <div className='icon'>
          <div className='skeleton-icon'></div>
        </div>
        <h6 className='skeleton-text'></h6>
      </div>
    </div>
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        const categoriesWithIcons = data.map(category => ({
          ...category,
          icon: categoryIcons[category?.name] || 'flaticon-placeholder' 
        }));
        setCategories(categoriesWithIcons);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className='category-area'>
      <div className='container'>
        <div className='category-wrapper-one wow fadeInDown'>
          <div className='row no-gutters'>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <SkeletonLoader key={index} />) 
              : categories.map((category) => (
                  <div key={category.id} className='col-lg-2 col-md-4 category-column'>
                    <div className='category-item category-item-one'>
                      <div className='info text-center'>
                        <div className='icon'>
                          <i className={category?.icon}></i>
                        </div>
                        <h6>{capitalize(category?.name)}</h6>
                      </div>
                      <Link
                        className='category-btn'
                        href={`/listing-grid?cat=${category?.id}`}
                      >
                        <i className='ti-arrow-right'></i>
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories; 