import Link from 'next/link';
import React from 'react';
import styles from './FeaturedListing.module.css';

const FeaturedListing = ({
  photos,
  title,
  phone,
  status,
  address,
  primaryCategory,
  lid,
  ...rest
}) => {
  return (
    <div className='col-lg-4 col-md-6 col-sm-12'>
      <div className='listing-item listing-grid-one mb-45 wow fadeInUp'>
        <div className='listing-thumbnail'>
          <div className={styles['image-wrapper']}>
            <img
              src={
                Array.isArray(photos) && photos.length > 0
                  ? photos[0]
                  : '/assets/business_profile_photos/profile-photo-12345.jpg'
              }
              alt='Listing Image'
              className={styles['listing-image']}
              style={{
                width: '330px',
                height: '330px',
              }}
            />
          </div>
          <span className='featured-btn'>Featured</span>
          <div className='thumbnail-meta d-flex justify-content-between align-items-center'>
            <div className='meta-icon-title d-flex align-items-center'>
              <div className='icon'>
                <i className='flaticon-chef'></i>
              </div>
              <div className='title'>
                <h6>{primaryCategory}</h6>
              </div>
            </div>
            <span className={`status st-${status.toLowerCase()}`}>
              {status}
            </span>
          </div>
        </div>
        <div className='listing-content'>
          <h3 className='title'>
            <Link href={`/en/listing-details/${lid}`}>{title}</Link>
          </h3>
          {/* we dont need reviews for now */}
          {/* <div className='ratings'>
            <ul className='ratings ratings-three'>
              <li className='star'>
                <i className='flaticon-star-1'></i>
              </li>
              <li className='star'>
                <i className='flaticon-star-1'></i>
              </li>
              <li className='star'>
                <i className='flaticon-star-1'></i>
              </li>
              <li className='star'>
                <i className='flaticon-star-1'></i>
              </li>
              <li className='star'>
                <i className='flaticon-star-1'></i>
              </li>
              <li>
                <span>
                  <a href='#'>(02 Reviews)</a>
                </span>
              </li>
            </ul>
          </div> */}
          {/* we dont need price for now */}
          {/* <span className='price'>$05.00 - $80.00</span> */}
          <span className='phone-meta'>
            <i className='ti-tablet'></i>
            <a href={`tel:${phone}`}>{phone}</a>
          </span>
          <div className='listing-meta'>
            <ul>
              <li>
                <span>
                  <i className='ti-location-pin truncate'></i>
                  {address}
                </span>
              </li>
              <li>
                <span>
                  <i className='ti-heart'></i>
                  <a href='#'>Save</a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListing;
