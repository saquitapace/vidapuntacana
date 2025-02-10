import { useState, useEffect } from "react"
import FeaturedListing from "./FeaturedListing";

export const FeaturedListings = () => {
    const [featuredListings, setFeaturedListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedListings();
    }, []);

    const fetchFeaturedListings = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/listings/featured');
            const data = await response.json();
            console.log('data ', data);
            setFeaturedListings(data);
        } catch (error) {
            console.error('Error fetching featured listings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        isLoading ? (
            <div className="featured-listings">

                {Array(3).fill(null).map((_, index) => (
                    <div key={`skeleton-${index}`} className="featured-listing-skeleton">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-text"></div>
                        </div>
                    </div>
                ))}
            </div>

        ) : (
            <div className="row">
                {
                    featuredListings.map((listing, index) => (
                        <FeaturedListing key={listing.id || index} {...listing} />
                    ))
                }

            </div>
        )
    );
}