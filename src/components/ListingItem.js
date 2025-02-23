import Link from "next/link";
import styles from "./ListingItem.module.css";

const ListingItem = ({ listing }) => {
  if(listing.lid == '2306019475')
  console.log('Listing Item ' , listing);
  return (
    <div className="listing-item listing-grid-item-two mb-30 wow fadeInUp">
      <div className="listing-thumbnail">
        <div className={styles['image-wrapper']}>
          <img
          style={{
            width : '370px',
            height: '370px'
          }}
            src={Array.isArray(listing?.photos) && listing?.photos?.length > 0 
              ? listing?.photos[0] 
              : "/assets/business_profile_photos/profile-photo-12345.jpg"}
            alt={listing?.title}
            className={styles['listing-image']}
          />
        </div>
        {listing?.primaryCategory && (
          <a href="#" className="cat-btn">
            <i className="flaticon-chef" />
          </a>
        )}
        {listing?.featured && <span className="featured-btn">Featured</span>}
        <ul className="ratings ratings-four">
          {[...Array(5)].map((_, index) => (
            <li key={index} className="star">
              <i className={`flaticon-star-1 ${index < Math.floor(listing?.rating) ? 'filled' : ''}`} />
            </li>
          ))}
          <li>
            <span>
              <a href="#">({listing?.review_count || 0} Reviews)</a>
            </span>
          </li>
        </ul>
      </div>
      <div className="listing-content">
        <h3 className="title">
          <Link href={`/listing-details/${listing?.lid}`}>{listing?.title}</Link>
        </h3>
        <p>{listing.address}</p>
        <span className="phone-meta">
          <i className="ti-tablet" />
          <a href={`tel:${listing?.phone}`}>{listing?.phone}</a>
          <span className={`status ${listing.status === 'open' ? 'st-open' : 'st-close'}`}>
            {listing.status}
          </span>
        </span>
        <div className="listing-meta">
          <ul>
            <li>
              <span>
                <i className="ti-location-pin" />
                {listing?.address}
              </span>
            </li>
            {listing?.socialMedia?.website && (
              <li>
                <span>
                  <i className="ti-world" />
                  <a href={listing?.socialMedia?.website} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                </span>
              </li>
            )}
            <li>
              <span>
                <i className="ti-heart" />
                <a href="#">Save</a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListingItem; 