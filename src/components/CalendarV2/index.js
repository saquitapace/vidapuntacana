'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { colorLookup2 } from '@/src/utils/helpers';
import Layout from '@/src/layouts/Layout';
import './Calendar.css';
import EventModal from './EventModal';
import EventList from './EventList';
import EventDrawer from './EventDrawer';

const localizer = momentLocalizer(moment);

const transformEvents = (events) => {
  if (!events) return [];
  
  return events.map((event) => {
    const start = moment.utc(event.startDate);
    let end = moment.utc(event.endDate);
    
    if (start.isSame(end)) {
      end = moment(start).add(1, 'hour');
    }

    return {
      ...event,
      start: start.local().toDate(),
      end: end.local().toDate(),
      title: event.title || 'Untitled Event'
    };
  });
};

const CustomToolbar = ({ onNavigate, onView, label, view, views, isMobile, isLoggedIn, onAddEvent }) => {
  return (
    <div className="calendar-toolbar">
      <div className="toolbar-title">
        <h2>{label}</h2>
      </div>
      
      <div className="toolbar-controls">
        <div className="toolbar-navigation">
          <button onClick={() => onNavigate('PREV')}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => onNavigate('TODAY')}>Today</button>
          <button onClick={() => onNavigate('NEXT')}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="toolbar-actions">
          {isLoggedIn && (
            <button onClick={onAddEvent} className="add-event-button">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Event</span>
            </button>
          )}
          
          {!isMobile && (
            <div className="toolbar-views">
              {views.map(viewName => (
                <button
                  key={viewName}
                  onClick={() => onView(viewName)}
                  className={view === viewName ? 'active' : ''}
                >
                  {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MyCalendar = ({ events, isLoggedIn }) => {
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only render after component is mounted
  if (!mounted) {
    return null;
  }

  const handleViewChange = (newView) => {
    setIsTransitioning(true);
    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentView(newView);
      setIsLoading(false);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 100);
  };

  const handleNavigate = (action) => {
    setIsLoading(true);
    
    switch (action) {
      case 'PREV':
        setCurrentDate(moment(currentDate).subtract(1, currentView).toDate());
        break;
      case 'NEXT':
        setCurrentDate(moment(currentDate).add(1, currentView).toDate());
        break;
      case 'TODAY':
        setCurrentDate(new Date());
        break;
      default:
        setCurrentDate(moment(action).toDate());
    }
    
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleAddEvent = () => {
    setIsDrawerOpen(true);
  };

  const transformedEvents = transformEvents(events);
  const shouldShowListView = isMobile && currentView === 'month';

  return (
    <Layout hideExtra={true}>
      <div style={{ 
        height: isMobile ? '100vh' : 'calc(100vh - 100px)',
        padding: isMobile ? '0' : '24px',
        marginBlockStart: isMobile ? '0' : '4rem',
        backgroundColor: '#f1f5f9'
      }}>
        <CustomToolbar
          onNavigate={handleNavigate}
          onView={handleViewChange}
          label={moment(currentDate).format('MMMM YYYY')}
          view={currentView}
          views={isMobile ? ['month', 'day'] : ['month', 'week', 'day']}
          isMobile={isMobile}
          isLoggedIn={isLoggedIn}
          onAddEvent={handleAddEvent}
        />

        <div className={`calendar-container ${isTransitioning ? 'transitioning' : ''} ${isLoading ? 'loading' : ''}`}>
          {isLoading && (
            <div className="calendar-loader">
              <div className="loader-spinner"></div>
            </div>
          )}
          
          {shouldShowListView ? (
            <EventList 
              events={transformedEvents}
              currentDate={currentDate}
              onEventClick={setSelectedEvent}
            />
          ) : (
            <Calendar
              localizer={localizer}
              events={transformedEvents}
              startAccessor="start"
              endAccessor="end"
              selectable
              date={currentDate}
              onNavigate={handleNavigate}
              views={isMobile ? ['day'] : ['month', 'week', 'day']}
              view={currentView}
              onView={handleViewChange}
              step={30}
              timeslots={2}
              style={{ height: 'calc(100% - 64px)' }}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: colorLookup2[event?.themeColor || '2'],
                },
              })}
              dayPropGetter={(date) => ({
                style: {
                  backgroundColor: 'white',
                },
              })}
              onSelectEvent={setSelectedEvent}
              components={{
                toolbar: () => null,
              }}
            />
          )}
        </div>
        
        {mounted && selectedEvent && (
          <EventModal
            event={selectedEvent}
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={() => {
              console.log('Edit event:', selectedEvent);
              setSelectedEvent(null);
            }}
          />
        )}
        
        <EventDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          selectedDate={currentDate}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </Layout>
  );
};

export default MyCalendar;