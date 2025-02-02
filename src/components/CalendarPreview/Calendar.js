import { getDaysInMonth } from 'date-fns';
import { useState } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { getEventsForDate, getFirstDayOfMonth } from '@/src/utils/helpers';
import { CalendarDay } from './CalendarDay';

export function Calendar({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className='bg-white rounded-lg shadow p-4 md:p-6 w-full'>
      <CalendarHeader
        monthName={monthName}
        year={year}
        onPreviousMonth={previousMonth}
        onNextMonth={nextMonth}
      />

      <div className='grid grid-cols-7 gap-2 mb-2'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className='text-center text-sm font-medium text-gray-600 py-2'
          >
            {day}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7 gap-2'>
        {[...Array(firstDayOfMonth)].map((_, index) => (
          <div
            key={`empty-${index}`}
            className='aspect-square bg-gray-50 rounded-lg'
          ></div>
        ))}

        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const dayEvents = getEventsForDate(events, currentDate, day);
          return <CalendarDay key={day} day={day} events={dayEvents} />;
        })}
      </div>
    </div>
  );
}
