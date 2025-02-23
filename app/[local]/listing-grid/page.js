"use client";
import { useState, useEffect } from "react";
import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layouts/Layout";
import Link from "next/link";
import ListingItem from "@/src/components/ListingItem";
import ListingSkeleton from "@/src/components/ListingSkeleton";
import './styles.css';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ListingGrid = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || '');
  
  
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get('page')) || 1,
    limit: 6,
    total: 0,
    totalPages: 0
  });


  const updateUrl = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.replace(`${pathname}?${params.toString()}`);
  };

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

   const fetchListings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        categoryId: selectedCategory
      });

      const response = await fetch(`/api/listings?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch listings');
      
      const data = await response.json();
      setListings(data.listings);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
    } catch (err) {
      setError('Error loading listings. Please try again.');
      console.error('Error fetching listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    const delayedFetch = setTimeout(() => {
      updateUrl({
        search: searchTerm,
        cat: selectedCategory,
        page: pagination.page
      });
      fetchListings();
    }, 300);

    return () => clearTimeout(delayedFetch);
  }, [searchTerm, selectedCategory, pagination.page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPagination(prev => ({ ...prev, page: 1 }));
    updateUrl({ search: '', cat: '', page: '1' });
  };

  return (
    <Layout>
      <PageBanner title="Listing Grid" pageName="Listing" />
      <section className="listing-grid-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            {/* Sidebar Filters */}
            <div className="col-lg-4">
              <div className="sidebar-widget-area">
                <div className="widget search-listing-widget mb-30 wow fadeInUp">
                  <h4 className="widget-title">Filter Search</h4>
                  <form onSubmit={e => e.preventDefault()}>
                    <div className="search-form">
                      <div className="form_group">
                        <input
                          type="search"
                          className="form_control"
                          placeholder="Search keyword"
                          value={searchTerm}
                          onChange={handleSearch}
                        />
                        <i className="ti-search" />
                      </div>
                      <div className="form_group">
                        {categoriesLoading ? (
                          <div className="loadingSkeleton">Loading categories...</div>
                        ) : (
                          <select 
                            className="wide categorySelect"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                          >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="col-lg-8">
              <div className="listing-search-filter mb-40">
                <div className="row">
                  <div className="col-md-8">
                    <div className="filter-left d-flex align-items-center">
                      <div className="show-text">
                        <span>
                          {pagination.total > 0 
                            ? `Showing ${((pagination.page - 1) * pagination.limit) + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total}`
                            : 'No results found'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="listing-grid-wrapper">
                <div className="row">
                  {error && (
                    <div className="col-12">
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    </div>
                  )}
                  
                  {isLoading ? (
                    Array(6).fill(0).map((_, index) => (
                      <div key={index} className="col-md-6 col-sm-12">
                        <ListingSkeleton />
                      </div>
                    ))
                  ) : listings.length === 0 ? (
                    <div className="col-12 text-center py-5">
                      <div className="empty-state">
                        <i className="ti-search mb-3" style={{ fontSize: '48px', opacity: '0.5' }}></i>
                        <h3>No Listings Found</h3>
                        <p className="text-muted">
                          We couldn't find any listings matching your search criteria.
                          Try adjusting your filters or search terms.
                        </p>
                        <button 
                          className="main-btn icon-btn mt-3"
                          onClick={handleResetFilters}
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    listings.map(listing => (
                      <div key={listing.id} className="col-md-6 col-sm-12">
                        <ListingItem listing={listing} />
                      </div>
                    ))
                  )}
                </div>


                {!isLoading && pagination.totalPages > 1 && (
                  <div className="pagination-wrap mt-40">
                    <ul className="pagination-list">
                      <li>
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="main-btn"
                        >
                          <FaChevronLeft/>
                        </button>
                      </li>

                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        const showPage = 
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1);
                        const showEllipsis = 
                          (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) &&
                          pageNum !== 1 &&
                          pageNum !== pagination.totalPages;

                        if (showPage) {
                          return (
                            <li key={pageNum}>
                              <button
                                onClick={() => handlePageChange(pageNum)}
                                className={`main-btn ${pagination.page === pageNum ? 'active' : ''}`}
                              >
                                {pageNum}
                              </button>
                            </li>
                          );
                        }
                        if (showEllipsis) {
                          return <li key={pageNum}>...</li>;
                        }
                        return null;
                      })}

                      <li>
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="main-btn"
                        >
                          <FaChevronRight/>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ListingGrid;