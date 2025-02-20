import React from 'react';
import moment from 'moment';
import { colorLookup2 } from '@/src/utils/helpers';
import './EventList.css';

const EventList = ({ events, currentDate, onEventClick }) => {
  // Filter events for the current month
  const filteredEvents = events.filter(event => {
    const eventDate = moment(event.start);
    const currentMonth = moment(currentDate);
    return eventDate.isSame(currentMonth, 'month');
  });

  // Group filtered events by date
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = moment(event.start).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="event-list-empty">
        <div className="empty-state">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <h3>No events this month</h3>
          <p>There are no events scheduled for {moment(currentDate).format('MMMM YYYY')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-list">
      {sortedDates.map(date => (
        <div key={date} className="event-list-day">
          <div className="event-list-date">
            <div className="date-header">
              <span className="day-name">{moment(date).format('dddd')}</span>
              <span className="date-number">{moment(date).format('MMMM D')}</span>
            </div>
          </div>
          
          <div className="event-list-items">
            {groupedEvents[date]
              .sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf())
              .map(event => (
                <div 
                  key={event.id} 
                  className="event-list-item"
                  onClick={() => onEventClick(event)}
                  style={{
                    borderLeft: `4px solid ${colorLookup2[event?.themeColor || '2']}`,
                  }}
                >
                  <div className="event-time">
                    {moment(event.start).format('h:mm A')}
                  </div>
                  <div 
                    className="event-marker"
                    style={{ 
                      backgroundColor: colorLookup2[event?.themeColor || '2'],
                      opacity: 0.15 // Add subtle background
                    }}
                  ></div>
                  <div className="event-details">
                    <div className="event-title" style={{ 
                      color: colorLookup2[event?.themeColor || '2']
                    }}>
                      {event.title}
                    </div>
                    {event.location && (
                      <div className="event-location">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                          />
                        </svg>
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList; 