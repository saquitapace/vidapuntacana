const ListingDetailsRight = ({ listing }) => {
  const getDayName = (dayNumber) => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[dayNumber - 1];
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes}${period}`;
  };

  return (
    <div className='col-lg-4'>
      <div className='sidebar-widget-area'>
        <div className='widget reservation-form-widget mb-30 wow fadeInUp'>
          <h4 className='widget-title'>Reservation</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className='form_group'>
              <input
                type='text'
                className='form_control'
                placeholder='Name'
                name='name'
                required=''
              />
              <i className='ti-user' />
            </div>
            <div className='form_group'>
              <input
                type='text'
                className='form_control'
                placeholder='Phone'
                name='phone'
                required=''
              />
              <i className='ti-mobile' />
            </div>
            <div className='form_group'>
              <select defaultValue={1} className='wide'>
                <option disabled selected>
                  Guest
                </option>
                <option data-display={1}>Guest 01</option>
                <option data-display={2}>Guest 02</option>
                <option data-display={2}>Guest 02</option>
                <option data-display={2}>Guest 02</option>
              </select>
            </div>
            <div className='form_group'>
              <select defaultValue={1}>
                <option disabled selected>
                  Date
                </option>
                <option data-display={1}>01.11.2021</option>
                <option data-display={2}>01.11.2021</option>
                <option data-display={3}>01.11.2021</option>
                <option data-display={4}>01.11.2021</option>
              </select>
            </div>
            <div className='form_group'>
              <select defaultValue={1} className='wide'>
                <option disabled selected>
                  Time
                </option>
                <option data-display={1}>08.00AM-10.00AM</option>
                <option data-display={2}>11.00AM-12.00PM</option>
                <option data-display={3}>01.00PM-02.00PM</option>
                <option data-display={4}>02.00PM-03.00PM</option>
              </select>
            </div>
            <div className='form_group'>
              <button className='main-btn icon-btn'>Book Now</button>
            </div>
          </form>
        </div>
        <div className='widget contact-info-widget mb-30 wow fadeInUp'>
          <div className='contact-info-widget-wrap'>
            <div className='contact-map'>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  listing?.address ?? ''
                )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              />
              <a href='#' className='support-icon'>
                <i className='flaticon-headphone' />
              </a>
            </div>
            <div className='contact-info-content'>
              <h4 className='widget-title'>Contact Info</h4>
              <div className='info-list'>
                {listing?.phone && (
                  <p>
                    <i className='ti-tablet' />
                    <a href={`tel:${listing.phone}`}>{listing.phone}</a>
                  </p>
                )}
                {listing?.address && (
                  <p>
                    <i className='ti-location-pin' />
                    {listing.address}
                  </p>
                )}
                {listing?.socialMedia?.website && (
                  <p>
                    <i className='ti-world' />
                    <a href={listing.socialMedia.website}>
                      {listing.socialMedia.website}
                    </a>
                  </p>
                )}
              </div>
              <ul className='social-link'>
                {listing?.socialMedia?.facebook && (
                  <li>
                    <a href={listing.socialMedia.facebook}>
                      <i className='ti-facebook' />
                    </a>
                  </li>
                )}
                {listing?.socialMedia?.instagram && (
                  <li>
                    <a href={listing.socialMedia.instagram}>
                      <i className='ti-instagram' />
                    </a>
                  </li>
                )}
                {listing?.socialMedia?.tripAdvisor && (
                  <li>
                    <a href={listing.socialMedia.tripAdvisor}>
                      <i className='ti-world' />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className='widget business-hour-widget mb-30 wow fadeInUp'>
          <h4 className='widget-title'>Business Hour</h4>
          <ul className='time-info'>
            {Object.entries(listing?.hours ?? {}).map(([day, hours]) => (
              <li key={day}>
                <span className='day'>{getDayName(parseInt(day))}</span>
                <span className='time'>
                  {hours.open && hours.close
                    ? `${formatTime(hours.open)} - ${formatTime(hours.close)}`
                    : 'Closed'}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className='widget newsletter-widget mb-30 wow fadeInUp'>
          <div
            className='newsletter-widget-wrap bg_cover'
            style={{
              backgroundImage: 'url(assets/images/newsletter-widget-1.jpg)',
            }}
          >
            <i className='flaticon-email-1' />
            <h3>Subscribe Our Newsletter</h3>
            <button className='main-btn icon-btn'>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListingDetailsRight;
