'use client';

import CalendarLayout from '@/src/components/Calendar/CalendarLayout';
import CalendarViewGrid from '@/src/components/Calendar/CalendarView/Grid/Grid';
import TimelineWrapper from '@/src/components/Calendar/CalendarView/Timeline/TimelineWrapper';
import EventDetailModal from '@/src/components/Modal/EventDetailModal';
import {
  setCalendarViewType,
  setSelectedEvent,
} from '@/src/store/slices/calendarSettingSlice';
import { fetchEvents } from '@/src/store/slices/calendarSlice';
import { CalendarViewTypes } from '@/src/utils/types';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function CalendarView() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  const { targetDate, calendarViewType, selectedEvent } = useSelector(
    (state) => state.calendarSetting
  );
  const { loading } = useSelector((state) => state.calendar);
  // const { loading } = useSelector((state) => state.ca);

  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      dispatch(fetchEvents(calendarViewType, targetDate));
    }
  }, [dispatch, user?.id, calendarViewType, targetDate, isSignedIn]);
  const dayQueryLookUp = {
    day: CalendarViewTypes.DAY_VIEW,
    week: CalendarViewTypes.WEEK_VIEW,
    month: CalendarViewTypes.MONTH_VIEW,
    year: CalendarViewTypes.YEAR_VIEW,
  };

  useEffect(() => {
    const viewType = params.viewType?.[0];
    if (viewType && dayQueryLookUp[viewType]) {
      dispatch(setCalendarViewType(dayQueryLookUp[viewType]));
    }
  }, [params.viewType, dispatch]);

  const selectedCalendarView = (calendarViewType) => {
    if (loading) {
      switch (calendarViewType) {
        case CalendarViewTypes.DAY_VIEW: {
          return (
            <div className='animate-pulse w-full'>
              <div className='flex'>
                {/* Time column */}
                <div className='min-w-56 flex flex-col'>
                  {Array(24)
                    .fill()
                    .map((_, i) => (
                      <div
                        key={i}
                        className='h-12 border-t flex items-center px-2'
                      >
                        <div className='w-16 h-4 bg-gray-200 rounded'></div>
                      </div>
                    ))}
                </div>
                {/* Events column */}
                <div className='flex-1'>
                  {Array(6)
                    .fill()
                    .map((_, i) => (
                      <div key={i} className='h-24 border-b border-gray-100'>
                        <div className='h-20 m-2 bg-gray-200 rounded'></div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          );
        }
        case CalendarViewTypes.WEEK_VIEW: {
          return (
            <div className='animate-pulse w-full'>
              <div className='grid grid-cols-7 gap-4 mb-4'>
                {Array(7)
                  .fill()
                  .map((_, i) => (
                    <div key={i} className='h-8 bg-gray-200 rounded'></div>
                  ))}
              </div>
              <div className='flex'>
                <div className='min-w-56 flex flex-col'>
                  {Array(24)
                    .fill()
                    .map((_, i) => (
                      <div
                        key={i}
                        className='h-12 border-t flex items-center px-2'
                      >
                        <div className='w-16 h-4 bg-gray-200 rounded'></div>
                      </div>
                    ))}
                </div>
                <div className='flex-1 grid grid-cols-7 gap-1'>
                  {Array(7)
                    .fill()
                    .map((_, dayIndex) => (
                      <div key={dayIndex} className='flex flex-col'>
                        {Array(4)
                          .fill()
                          .map((_, eventIndex) => (
                            <div
                              key={eventIndex}
                              className='h-24 border-b border-gray-100'
                            >
                              <div className='h-20 m-1 bg-gray-200 rounded'></div>
                            </div>
                          ))}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          );
        }
        case CalendarViewTypes.MONTH_VIEW: {
          return (
            <div className='animate-pulse w-full h-full'>
              <div className='grid grid-cols-7 gap-4 h-full'>
                {Array(35)
                  .fill()
                  .map((_, i) => (
                    <div key={i} className='border rounded-lg p-2'>
                      <div className='h-6 bg-gray-200 rounded mb-2'></div>
                      {Array(2)
                        .fill()
                        .map((_, j) => (
                          <div
                            key={j}
                            className='h-8 bg-gray-200 rounded mb-2'
                          ></div>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          );
        }
        default:
          return null;
      }
    }

    switch (calendarViewType) {
      case CalendarViewTypes.DAY_VIEW:
      case CalendarViewTypes.WEEK_VIEW: {
        return <TimelineWrapper />;
      }
      case CalendarViewTypes.MONTH_VIEW: {
        return <CalendarViewGrid />;
      }
      default:
        return null;
    }
  };

  const handleCloseModal = () => {
    dispatch(setSelectedEvent({ eventUid: '' }));
    router.push(`/calendar/${params.viewType?.[0] || 'day'}`);
  };

  if (!isLoaded) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }
  console.log('freeze selectedevent', selectedEvent);
  return (
    <div className='relative'>
      <main>
        <CalendarLayout>
          <div
            className={`
              flex
              ${
                calendarViewType === CalendarViewTypes.DAY_VIEW ||
                calendarViewType === CalendarViewTypes.WEEK_VIEW
                  ? 'flex-col pr-3'
                  : ''
              }
              ${
                calendarViewType === CalendarViewTypes.MONTH_VIEW
                  ? 'h-full'
                  : ''
              }
            `}
          >
            {selectedCalendarView(calendarViewType)}
          </div>
          {/* Event Detail Modal */}
          {Boolean(selectedEvent?.id) && (
            <>
              <div className='absolute top-0 left-0 w-full h-full z-1' />
              <EventDetailModal
                selectedEvent={{
                  ...selectedEvent,
                }}
                onCloseModal={handleCloseModal}
              />
            </>
          )}
        </CalendarLayout>
      </main>
    </div>
  );
}
