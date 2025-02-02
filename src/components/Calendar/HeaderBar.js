'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setTargetDate } from '@/src/store/slices/calendarSettingSlice';
import { CalendarViewTypes } from '@/src/utils/types';

export const HeaderBar = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { targetDate, calendarViewType  , loading} = useSelector(
    (state) => state.calendarSetting
  );

  const handlePrevious = () => {
    const newDate = new Date(targetDate);
    switch (calendarViewType) {
      case CalendarViewTypes.DAY_VIEW:
        newDate.setDate(newDate.getDate() - 1);
        break;
      case CalendarViewTypes.WEEK_VIEW:
        newDate.setDate(newDate.getDate() - 7);
        break;
      case CalendarViewTypes.MONTH_VIEW:
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    dispatch(setTargetDate(newDate));
  };

  const handleNext = () => {
    const newDate = new Date(targetDate);
    switch (calendarViewType) {
      case CalendarViewTypes.DAY_VIEW:
        newDate.setDate(newDate.getDate() + 1);
        break;
      case CalendarViewTypes.WEEK_VIEW:
        newDate.setDate(newDate.getDate() + 7);
        break;
      case CalendarViewTypes.MONTH_VIEW:
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    dispatch(setTargetDate(newDate));
  };

  const handleToday = () => {
    dispatch(setTargetDate(new Date()));
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
      <div className="flex items-center space-x-4">
        <button
        disabled={loading}
          onClick={handleToday}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Today
        </button>
        <div className="flex items-center space-x-2">
          <button
            disabled={loading}
            onClick={handlePrevious}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            disabled={loading}
            onClick={handleNext}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {format(new Date(targetDate), 'MMMM yyyy')}
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        <Link
          href="/calendar/day"
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            calendarViewType === CalendarViewTypes.DAY_VIEW
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Day
        </Link>
        <Link
          href="/calendar/week"
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            calendarViewType === CalendarViewTypes.WEEK_VIEW
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Week
        </Link>
        <Link
          href="/calendar/month"
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            calendarViewType === CalendarViewTypes.MONTH_VIEW
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Month
        </Link>
      </div>
    </div>
  );
};
