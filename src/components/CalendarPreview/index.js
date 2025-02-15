'use client';
import { useEffect, useState } from 'react';
import { Calendar } from './Calendar';
import { notify } from 'reapop';

const CalendarPreview = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/events-preview');

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError(typeof error === 'string' ? error : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  useEffect(() => {
    if (error) {
      notify(error, 'error', {
        dismissAfter: 3000,
      });
    }
  }, [error]);
  if (loading) {
    <div className='w-3/4 h-[500px] mb-10 grid grid-cols-7 gap-4'>
      {[...Array(7)].map((_, i) => (
        <div key={i} className='h-full bg-gray-200 rounded animate-pulse'></div>
      ))}
    </div>;
  }
  return (
    <div className='w-3/4 mb-10'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
        Event Calendar
      </h1>
      <Calendar events={events ?? []} />
    </div>
  );
};

export default CalendarPreview;
