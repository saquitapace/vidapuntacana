'use client';
import ListingDetailsRight from '@/src/components/ListingDetailsRight';
import Layout from '@/src/layouts/Layout';
import Link from 'next/link';
import { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import NotFound from './NotFound';

const ListingDetails = ({ listing, notFound }) => {
  if (notFound) {
    return <NotFound />;
  }

  const [accordionActive, setAccordionActive] = useState('collapseOne');
  const activeAccortion = (value) => (value === accordionActive ? true : false);

  const uniqueCategories = Array.from(
    new Set(listing?.categories?.map((cat) => cat?.name) ?? [])
  );
  const uniqueTags = Array.from(
    new Set(listing?.tags?.map((tag) => tag?.name) ?? [])
  );

  return (
    <Layout>
      {/*====== Start Breadcrumbs section ======*/}
      <section className='page-breadcrumbs page-breadcrumbs-one pt-120 pb-70'>
        <div className='container'>
          <div className='breadcrumbs-wrapper-one'>
            <div className='row align-items-center'>
              <div className='col-lg-5 col-md-12'>
                <div className='listing-info-name'>
                  <div className='info-name d-flex'>
                    <div className='thumb'>
                      <img
                        src={
                          listing?.photos?.[0]?.url ??
                          'assets/images/listing/info-1.jpg'
                        }
                        alt='thumb image'
                      />
                    </div>
                    <div className='content'>
                      <span className='cat-btn'>
                        {listing?.primaryCategory?.name ?? 'Uncategorized'}
                      </span>
                      <h3>{listing?.title ?? 'Unnamed Location'}</h3>
                      <p className='tag'>
                        {uniqueCategories.map((cat, index) => (
                          <span key={index}>
                            {index > 0 && ', '}
                            <a href='#'>{cat}</a>
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-4 col-md-6'>
                <div className='listing-info-content'>
                  <div className='content'>
                    <ul className='ratings ratings-three'>
                      {[...Array(5)].map((_, index) => (
                        <li key={index}>
                          <i
                            className={`flaticon-star-1 ${
                              index < Math.round(listing?.rating ?? 0)
                                ? 'active'
                                : ''
                            }`}
                          />
                        </li>
                      ))}
                      <li>
                        <span>
                          <a href='#'>({listing?.reviewCount ?? 0} Reviews)</a>
                        </span>
                      </li>
                    </ul>
                    <div className='listing-meta'>
                      <ul>
                        <li>
                          <span>
                            <i className='ti-location-pin' />
                            {listing?.address ?? 'Address not available'}
                          </span>
                        </li>
                        <li>
                          <span>
                            <i className='ti-tablet' />
                            <a href={`tel:${listing?.phone}`}>
                              {listing?.phone ?? 'Phone not available'}
                            </a>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-3 col-md-6'>
                <div className='button'>
                  <Link className='icon-btn' href='/listing-grid'>
                    <i className='ti-heart' />
                  </Link>
                  <Link className='icon-btn' href='/listing-grid'>
                    <i className='ti-share' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Breadcrumbs section ======*/}
      {/*====== Start Listing Details section ======*/}
      <section className='listing-details-section pt-120 pb-90'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-8'>
              <div className='listing-details-wrapper listing-details-wrapper-one'>
                <div className='listing-content mb-50 wow fadeInUp'>
                  <h3 className='title'>
                    {listing?.title ?? 'Unnamed Location'}
                  </h3>
                  <p>{listing?.description ?? 'No description available.'}</p>
                </div>
                <div className='listing-features-box mb-50 wow fadeInUp'>
                  <h4 className='title'>Our Features</h4>
                  <div className='row'>
                    <div className='col-lg-4 col-md-6 col-sm-12'>
                      <div className='icon-box icon-box-one'>
                        <div className='icon'>
                          <i className='ti-credit-card' />
                        </div>
                        <div className='info'>
                          <h6>Card Payment</h6>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4 col-md-6 col-sm-12'>
                      <div className='icon-box icon-box-one'>
                        <div className='icon'>
                          <i className='ti-paint-bucket' />
                        </div>
                        <div className='info'>
                          <h6>Air-conditioned</h6>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4 col-md-6 col-sm-12'>
                      <div className='icon-box icon-box-one'>
                        <div className='icon'>
                          <i className='ti-rss-alt' />
                        </div>
                        <div className='info'>
                          <h6>Wireless Internet</h6>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4 col-md-6 col-sm-12'>
                      <div className='icon-box icon-box-one'>
                        <div className='icon'>
                          <i className='ti-trash' />
                        </div>
                        <div className='info'>
                          <h6>Serves Alcohol</h6>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4 col-md-6 col-sm-12'>
                      <div className='icon-box icon-box-one'>
                        <div className='icon'>
                          <i className='ti-car' />
                        </div>
                        <div className='info'>
                          <h6>Parking Street</h6>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4 col-md-6 col-sm-12'>
                      <div className='icon-box icon-box-one'>
                        <div className='icon'>
                          <i className='ti-credit-card' />
                        </div>
                        <div className='info'>
                          <h6>Outdoor Seating</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='listing-gallery-box wow fadeInUp'>
                  <h4 className='title'>Photo Showcase</h4>
                  <div className='row'>
                    {listing?.photos?.map((photo, index) => (
                      <div key={index} className='col-md-6 col-sm-12'>
                        <div className='gallery-item mb-30'>
                          <a href={photo.url} className='img-popup'>
                            <img
                              src={photo.url}
                              alt={`gallery image ${index + 1}`}
                            />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='listing-tag-box mb-50 wow fadeInUp'>
                  <h4 className='title'>Popular Tag</h4>
                  {uniqueTags.map((tag, index) => (
                    <a key={index} href='#'>
                      {tag}
                    </a>
                  ))}
                </div>
                <div className='listing-faq-box mb-50 wow fadeInUp'>
                  <h4 className='title'>Asked Question</h4>
                  <Accordion
                    className='faq-accordian'
                    defaultActiveKey='collapseOne'
                  >
                    <div className='card'>
                      <Accordion.Toggle
                        as='a'
                        className='card-header'
                        eventKey='collapseOne'
                        onClick={() => setAccordionActive('collapseOne')}
                        aria-expanded={activeAccortion('collapseOne')}
                      >
                        How do I Make a regular Table Booking?
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey='collapseOne'>
                        <div className='card-body'>
                          <p>
                            Musutrum orci montes hac at neque mollis taciti
                            parturient vehicula interdum viverra cubilia ipsum
                            ut duis amet nullam sit ut ornare mattis urna.
                            Parturient. Aptent erat blandit dolor porta eros
                            mollis hendrerit leo viverra pellentesque fusce.
                          </p>
                        </div>
                      </Accordion.Collapse>
                    </div>
                    <div className='card'>
                      <Accordion.Toggle
                        as='a'
                        className='card-header'
                        eventKey='collapseTwo'
                        onClick={() => setAccordionActive('collapseTwo')}
                        aria-expanded={activeAccortion('collapseTwo')}
                      >
                        {`How can I be certain my booking's been received?`}
                      </Accordion.Toggle>
                      <Accordion.Collapse
                        eventKey='collapseTwo'

                        // data-parent="#listingFaq"
                      >
                        <div className='card-body'>
                          <p>
                            Musutrum orci montes hac at neque mollis taciti
                            parturient vehicula interdum viverra cubilia ipsum
                            ut duis amet nullam sit ut ornare mattis urna.
                            Parturient. Aptent erat blandit dolor porta eros
                            mollis hendrerit leo viverra pellentesque fusce.
                          </p>
                        </div>
                      </Accordion.Collapse>
                    </div>
                    <div className='card'>
                      <Accordion.Toggle
                        as='a'
                        className='card-header'
                        eventKey='collapseThree'
                        onClick={() => setAccordionActive('collapseThree')}
                        aria-expanded={activeAccortion('collapseThree')}
                      >
                        How much do I have to pay for my booking?
                      </Accordion.Toggle>
                      <Accordion.Collapse
                        eventKey='collapseThree'

                        // data-parent="#listingFaq"
                      >
                        <div className='card-body'>
                          <p>
                            Musutrum orci montes hac at neque mollis taciti
                            parturient vehicula interdum viverra cubilia ipsum
                            ut duis amet nullam sit ut ornare mattis urna.
                            Parturient. Aptent erat blandit dolor porta eros
                            mollis hendrerit leo viverra pellentesque fusce.
                          </p>
                        </div>
                      </Accordion.Collapse>
                    </div>
                    <div className='card'>
                      <Accordion.Toggle
                        as='a'
                        className='card-header'
                        eventKey='collapseFour'
                        onClick={() => setAccordionActive('collapseFour')}
                        aria-expanded={activeAccortion('collapseFour')}
                      >
                        {` What happens restaurant and they don't have my booking?`}
                      </Accordion.Toggle>
                      <Accordion.Collapse
                        eventKey='collapseFour'

                        // data-parent="#listingFaq"
                      >
                        <div className='card-body'>
                          <p>
                            Musutrum orci montes hac at neque mollis taciti
                            parturient vehicula interdum viverra cubilia ipsum
                            ut duis amet nullam sit ut ornare mattis urna.
                            Parturient. Aptent erat blandit dolor porta eros
                            mollis hendrerit leo viverra pellentesque fusce.
                          </p>
                        </div>
                      </Accordion.Collapse>
                    </div>
                  </Accordion>
                </div>
                <div className='listing-review-box mb-50 wow fadeInUp'>
                  <h4 className='title'>Customer Review</h4>
                  <ul className='review-list'>
                    <li className='review'>
                      <div className='thumb'>
                        <img
                          src='assets/images/listing/review-1.jpg'
                          alt='review image'
                        />
                      </div>
                      <div className='review-content'>
                        <h5>Moriana Steve</h5>
                        <span className='date'>Sep 02, 2021</span>
                        <p>
                          Musutrum orci montes hac at neque mollis taciti
                          parturient vehicula interdum verra cubilia ipsum duis
                          amet nullam sit ut ornare mattis urna.{' '}
                        </p>
                        <div className='content-meta d-flex align-items-center justify-content-between'>
                          <ul className='ratings ratings-three'>
                            <li>
                              <span className='av-rate'>4.5</span>
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                          </ul>
                          <a href='#' className='reply'>
                            <i className='ti-share-alt' />
                            Reply
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className='review'>
                      <div className='thumb'>
                        <img
                          src='assets/images/listing/review-2.jpg'
                          alt='review image'
                        />
                      </div>
                      <div className='review-content'>
                        <h5>Moriana Steve</h5>
                        <span className='date'>Sep 02, 2021</span>
                        <p>
                          Musutrum orci montes hac at neque mollis taciti
                          parturient vehicula interdum verra cubilia ipsum duis
                          amet nullam sit ut ornare mattis urna.{' '}
                        </p>
                        <div className='content-meta d-flex align-items-center justify-content-between'>
                          <ul className='ratings ratings-three'>
                            <li>
                              <span className='av-rate'>4.5</span>
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                          </ul>
                          <a href='#' className='reply'>
                            <i className='ti-share-alt' />
                            Reply
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className='review'>
                      <div className='thumb'>
                        <img
                          src='assets/images/listing/review-3.jpg'
                          alt='review image'
                        />
                      </div>
                      <div className='review-content'>
                        <h5>Moriana Steve</h5>
                        <span className='date'>Sep 02, 2021</span>
                        <p>
                          Musutrum orci montes hac at neque mollis taciti
                          parturient vehicula interdum verra cubilia ipsum duis
                          amet nullam sit ut ornare mattis urna.{' '}
                        </p>
                        <div className='content-meta d-flex align-items-center justify-content-between'>
                          <ul className='ratings ratings-three'>
                            <li>
                              <span className='av-rate'>4.5</span>
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                            <li className='star'>
                              <i className='flaticon-star-1' />
                            </li>
                          </ul>
                          <a href='#' className='reply'>
                            <i className='ti-share-alt' />
                            Reply
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className='listing-review-form mb-30 wow fadeInUp'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <h4 className='title'>Write a Review</h4>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-rating'>
                        <ul className='ratings'>
                          <li>
                            <span>Rate Here:</span>
                          </li>
                          <li className='star'>
                            <i className='flaticon-star-1' />
                          </li>
                          <li className='star'>
                            <i className='flaticon-star-1' />
                          </li>
                          <li className='star'>
                            <i className='flaticon-star-1' />
                          </li>
                          <li className='star'>
                            <i className='flaticon-star-1' />
                          </li>
                          <li className='star'>
                            <i className='flaticon-star-1' />
                          </li>
                        </ul>
                        <span>(02 Reviews)</span>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <div className='form_group'>
                          <textarea
                            className='form_control'
                            placeholder='Write Message'
                            name='message'
                          />
                        </div>
                      </div>
                      <div className='col-lg-6'>
                        <div className='form_group'>
                          <input
                            type='text'
                            className='form_control'
                            placeholder='Your name'
                            name='name'
                            required=''
                          />
                        </div>
                      </div>
                      <div className='col-lg-6'>
                        <div className='form_group'>
                          <input
                            type='email'
                            className='form_control'
                            placeholder='Email here'
                            name='email'
                            required=''
                          />
                        </div>
                      </div>
                      <div className='col-lg-12'>
                        <div className='form_group'>
                          <div className='single-checkbox d-flex'>
                            <input
                              type='checkbox'
                              id='check4'
                              name='checkbox'
                            />
                            <label htmlFor='check4'>
                              <span>
                                Save my name, email, and website in this browser
                                for the next time i comment.
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className='col-lg-12'>
                        <div className='form_group'>
                          <button className='main-btn icon-btn'>
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <ListingDetailsRight listing={listing} />
          </div>
        </div>
      </section>
      {/*====== End Listing Details section ======*/}
    </Layout>
  );
};

export default ListingDetails;
