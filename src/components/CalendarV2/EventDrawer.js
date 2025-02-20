import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import moment from 'moment';
import './EventDrawer.css';
import { colorLookup2 } from '@/src/utils/helpers';

const eventSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  startDate: z.string(),
  startTime: z.string(),
  endDate: z.string(),
  endTime: z.string(),
  location: z.string().optional(),
  description: z.string().optional(),
  themeColor: z.string(),
}).refine((data) => {
  const start = moment(`${data.startDate} ${data.startTime}`);
  const end = moment(`${data.endDate} ${data.endTime}`);
  return end.isAfter(start);
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

const EventDrawer = ({ isOpen, onClose, selectedDate, isLoggedIn }) => {
  const defaultValues = {
    title: '',
    startDate: selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    startTime: '09:00',
    endDate: selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    endTime: '10:00',
    location: '',
    description: '',
    themeColor: '2'
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues
  });

  const onSubmit = (data) => {
    console.log('Form data:', data);
    reset(defaultValues);
    onClose();
  };

  return (
    <div className={`event-drawer-overlay ${isOpen ? 'open' : ''}`}>
      <div className="event-drawer-backdrop" onClick={onClose}></div>
      <div className="event-drawer">
        <div className="event-drawer-header">
          <h2>Add New Event</h2>
          <button onClick={onClose} className="close-button">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="event-drawer-content">
          <div className="form-group">
            <label htmlFor="title">Event Title*</label>
            <input
              {...register('title')}
              className={errors.title ? 'error' : ''}
              placeholder="Enter event title"
            />
            {errors.title && (
              <span className="error-message">{errors.title.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date & Time*</label>
              <div className="datetime-picker">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      {...field}
                      className={`date-input ${errors.startDate ? 'error' : ''}`}
                    />
                  )}
                />
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="time"
                      {...field}
                      className={`time-input ${errors.startTime ? 'error' : ''}`}
                    />
                  )}
                />
              </div>
              {errors.startDate && (
                <span className="error-message">{errors.startDate.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>End Date & Time*</label>
              <div className="datetime-picker">
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      {...field}
                      className={`date-input ${errors.endDate ? 'error' : ''}`}
                    />
                  )}
                />
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="time"
                      {...field}
                      className={`time-input ${errors.endTime ? 'error' : ''}`}
                    />
                  )}
                />
              </div>
              {errors.endTime && (
                <span className="error-message">{errors.endTime.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              {...register('location')}
              placeholder="Add location"
              className={errors.location ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              {...register('description')}
              placeholder="Add description"
              rows="4"
              className={errors.description ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label>Theme Color</label>
            <div className="color-options">
              <Controller
                name="themeColor"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {Object.keys(colorLookup2).map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-option ${value === color ? 'selected' : ''}`}
                        style={{ backgroundColor: colorLookup2[color] }}
                        onClick={() => onChange(color)}
                      />
                    ))}
                  </>
                )}
              />
            </div>
          </div>

          <div className="drawer-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventDrawer; 