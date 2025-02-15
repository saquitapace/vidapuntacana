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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchListings();
  }, [pagination.page, debouncedSearchTerm]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/listings?page=${pagination.page}&limit=${pagination.limit}&search=${debouncedSearchTerm}`
      );
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
                          onChange={(e) => setSearchTerm(e.target.value)}
                          required=""
                        />
                        <i className="ti-search" />
                      </div>
                      <div className="form_group">
                        <select className="wide" defaultValue={1}>
                          <option disabled selected="Category">
                            Category
                          </option>
                          <option value={1}>Museums</option>
                          <option value={2}>Restaurant</option>
                          <option value={3}>Party Center</option>
                          <option value={4}>Fitness Zone</option>
                          <option value={5}>Game Field</option>
                          <option value={6}>Job &amp; Feeds</option>
                          <option value={7}>Shooping</option>
                          <option value={8}>Art Gallery</option>
                        </select>
                      </div>
                      <div className="form_group">
                        <select className="wide" defaultValue={1}>
                          <option disabled selected="Location">
                            Location
                          </option>
                          <option value={1}>Dhaka</option>
                          <option value={2}>Delhi</option>
                          <option value={3}>lahore</option>
                          <option value={4}>Rome</option>
                          <option value={5}>New york</option>
                          <option value={6}>Pris</option>
                          <option value={7}>Bern</option>
                          <option value={8}>Bangkok</option>
                        </select>
                      </div>
                      <div className="form_group">
                        <select className="wide" defaultValue={1}>
                          <option disabled selected="By Country">
                            By Country
                          </option>
                          <option value={1}>Bangladesh</option>
                          <option value={2}>India</option>
                          <option value={3}>Pakistan</option>
                          <option value={4}>Italy</option>
                          <option value={5}>America</option>
                          <option value={6}>London</option>
                          <option value={7}>Swizerland</option>
                          <option value={8}>Thailand</option>
                        </select>
                      </div>
                      <div className="form_group">
                        <select className="wide" defaultValue={1}>
                          <option disabled selected="By place">
                            By place
                          </option>
                          <option value={1}>Dhaka</option>
                          <option value={2}>Delhi</option>
                          <option value={3}>lahore</option>
                          <option value={4}>Rome</option>
                          <option value={5}>New york</option>
                          <option value={6}>Pris</option>
                          <option value={7}>Bern</option>
                          <option value={8}>Bangkok</option>
                        </select>
                      </div>
                    </div>
                    <div className="price-range-widget">
                      <h4 className="widget-title">Around Distance: 50 km</h4>
                      <RangeSlider />

                      <select className="wide" defaultValue={1}>
                        <option disabled selected="Default price">
                          Default price
                        </option>
                        <option value={1}>$10-$30</option>
                        <option value={2}>$30-$70</option>
                        <option value={3}>$70-$100</option>
                        <option value={4}>$100-$130</option>
                        <option value={5}>$130-$150</option>
                      </select>
                    </div>
                    <div className="form_group">
                      <button className="main-btn icon-btn">Search Now</button>
                    </div>
                  </form>
                </div>
                <div className="widget newsletter-widget mb-30 wow fadeInUp">
                  <div
                    className="newsletter-widget-wrap bg_cover"
                    style={{
                      backgroundImage:
                        "url(assets/images/newsletter-widget-1.jpg)",
                    }}
                  >
                    <i className="flaticon-email-1" />
                    <h3>Subscribe Our Newsletter</h3>
                    <button className="main-btn icon-btn">Subscribe</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="listing-search-filter mb-40">
                <div className="row">
                  <div className="col-md-8">
                    <div className="filter-left d-flex align-items-center">
                      <div className="show-text">
                        <span>Showing Result 1-09</span>
                      </div>
                      {/* <div className="sorting-dropdown">
                        <select defaultValue={1}>
                          <option disabled selected="Default Sorting">
                            Default Sorting
                          </option>
                          <option value={1}>Museums</option>
                          <option value={2}>Restaurant</option>
                          <option value={3}>Party Center</option>
                          <option value={4}>Fitness Zone</option>
                          <option value={5}>Game Field</option>
                        </select>
                      </div> */}
                    </div>
                  </div>
                  <div className="col-md-4">
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
