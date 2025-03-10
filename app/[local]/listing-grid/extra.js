"use client";
import { useState, useEffect } from "react";
import PageBanner from "@/src/components/PageBanner";
import RangeSlider from "@/src/components/RangeSlider";
import Layout from "@/src/layouts/Layout";
import Link from "next/link";
import ListingItem from "@/src/components/ListingItem";
import ListingSkeleton from "@/src/components/ListingSkeleton";
import './styles.css';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ListingGrid = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cat = searchParams?.get('cat') || '';
  const search = searchParams.get('search') || '';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(1);

  useEffect(() => {
    if(cat && Number(cat)){
      setSelectedCategory(cat);
      const params = new URLSearchParams(searchParams.toString())
      params.delete('cat');
      router.replace(pathname + '?' + params.toString())
      fetchListings();
    }
  },[])

  useEffect(() => {
    if(search.trim()){
      setSearchTerm(search);
      const params = new URLSearchParams(searchParams.toString())
      params.delete('search');
      router.replace(pathname + '?' + params.toString())
      fetchListings();
    }
  },[])
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchListings();
  }, [pagination.page, debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const url = `/api/listings?page=${pagination.page}&limit=${pagination.limit}&search=${debouncedSearchTerm}&categoryId=${selectedCategory}`;
      console.log('Fetching listings from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      setListings(data.listings);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchTerm(e.target.value)
    fetchListings();
  };

  return (
    <Layout>
      <PageBanner title={"Listing Grid"} pageName={"Listing"} />  
      <section className="listing-grid-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="sidebar-widget-area">
                <div className="widget search-listing-widget mb-30 wow fadeInUp">
                  <h4 className="widget-title">Filter Search</h4>
                  <form onSubmit={handleSearch}>
                    <div className="search-form">
                      <div className="form_group">
                        <input
                          type="search"
                          className="form_control"
                          placeholder="Search keyword"
                          name="search"
                          value={searchTerm}
                          onChange={handleSearch}
                          required=""
                        />
                        <i className="ti-search" />
                      </div>
                      <div className="form_group">
                        {loading ? (
                          <div className="loadingSkeleton">Loading categories...</div>
                        ) : (
                          <select 
                            className="wide categorySelect" 
                            value={selectedCategory}
                            onChange={(e) => {
                              setSelectedCategory(e.target.value);
                              setPagination(prev => ({ ...prev, page: 1 }));
                              fetchListings();
                            }}
                          >
                            <option value="">
                              All Categories
                            </option>
                            {categories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <button className="main-btn icon-btn">Search Now</button>
                    </div>
                  </form>
                </div>
              
              </div>
            </div>
            <div className="col-lg-8">
              <div className="listing-search-filter mb-40">
                <div className="row">
                  <div className="col-md-8">
                    <div className="filter-left d-flex align-items-center">
                      <div className="show-text">
                        <span>Showing Result {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 hidden">
                    <div className="filter-right">
                      <ul className="filter-nav">
                        <li>
                          <Link href="/listing-grid" className="active">
                            <i className="ti-view-grid" />
                          </Link>
                        </li>
                        <li>
                          <Link href="/listing-list">
                            <i className="ti-view-list-alt" />
                          </Link>
                        </li>
                        <li>
                          <Link href="/listing-list">MAP
                          </Link>
                        </li>
                      </ul>
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
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('');
                            setPagination(prev => ({ ...prev, page: 1 }));
                          }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    listings.map((listing, index) => (
                      <div key={listing.id} className="col-md-6 col-sm-12">
                        <ListingItem listing={listing} />
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {!isLoading && pagination.totalPages > 1 && (
                  <div className="pagination-wrap mt-40">
                    <ul className="pagination-list">
                      <li>
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="main-btn "
                        >
                          {/* <i className="ti-angle-left" /> */}
                          <FaChevronLeft/>
                        </button>
                      </li>

                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                        ) {
                          return (
                            <li key={pageNum}>
                              <button
                                onClick={() => handlePageChange(pageNum)}
                                className={`main-btn ${
                                  pagination.page === pageNum ? 'active' : ''
                                }`}
                              >
                                {pageNum}
                              </button>
                            </li>
                          );
                        }
                        if (
                          pageNum === pagination.page - 2 ||
                          pageNum === pagination.page + 2
                        ) {
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
                          {/* <i className="ti-angle-right" /> */}
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
