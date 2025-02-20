import React from 'react';
import moment from 'moment';
import './EventModal.css';

const EventModal = ({ event, isOpen, onClose, onEdit }) => {
  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay">
      {/* Backdrop with blur */}
      <div 
        className="event-modal-backdrop"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="event-modal-container">
        <div className="event-modal">
          {/* Close button */}
          <button
            onClick={onClose}
            className="event-modal-close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="event-modal-content">
            <div className="event-modal-header">
              <h3 className="event-modal-title">
                {event.title}
              </h3>
              
              <div className="event-modal-details">
                <div className="event-detail-item">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{moment(event.start).format('MMMM D, YYYY h:mm A')} - {moment(event.end).format('h:mm A')}</span>
                </div>

                {event.location && (
                  <div className="event-detail-item">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                )}

                {event.description && (
                  <div className="event-description">
                    <h4>Description</h4>
                    <p>{event.description}</p>
                  </div>
                )}

                {event.eventCreator && (
                  <div className="event-detail-item">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Created by {event.eventCreator.displayName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="event-modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="btn-primary"
              >
                Edit Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal; 