import { eachDayOfInterval, format, getDate, setHours } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDateRange } from '@/src/utils/helpers';
import { CalendarViewTypes } from '@/src/utils/types';
import Timeline from './Timeline';
import TimelineHeader from './TimelineHeader';
import { setSelectedEvent } from '@/src/store/slices/calendarSettingSlice';

const TimelineWrapper = () => {
  const timelineHeaderRef = useRef(null);
  const timelineRef = useRef(null);
  const dispatch = useDispatch();

  const { targetDate, calendarViewType, loading } = useSelector(
    (state) => state.calendarSetting
  );
  const { dayViewEvents, weekViewEvents } = useSelector(
    (state) => state.calendar
  );
  const [targetDateRange, setTargetDateRange] = useState([]);
  const [timelineMaxHeight, setTimelineMaxHeight] = useState(
    'calc(100vh - (65px + 43px)'
  );

  const onClickTimelineBlock = (payload) => {
    dispatch(setSelectedEvent(payload));
  };

  useEffect(() => {
    const getDayList = (targetDate, calendarViewType) => {
      switch (calendarViewType) {
        case CalendarViewTypes.DAY_VIEW: {
          return [new Date(targetDate)];
        }

        case CalendarViewTypes.WEEK_VIEW: {
          const [start, end] = getDateRange(calendarViewType, targetDate);
          return eachDayOfInterval({
            start,
            end,
          });
        }
      }
    };
    if (targetDate !== null) {
      setTargetDateRange(getDayList(targetDate, calendarViewType));
    }
  }, [targetDate, calendarViewType]);

  useEffect(() => {
    // if (timelineHeaderRef?.current?.getBoundingClientRect) {
    const height = timelineHeaderRef?.current?.getBoundingClientRect().height;

    setTimelineMaxHeight(`calc(100vh - (65px + ${height}px))`);
    // }
  }, [targetDate, dayViewEvents, weekViewEvents, timelineHeaderRef]);

  return (
    <div className='flex flex-col w-full'>
      {/* Timeline Header */}
      <TimelineHeader
        ref={timelineHeaderRef}
        dates={targetDateRange}
        wholeDayEvents={
          calendarViewType === CalendarViewTypes.DAY_VIEW
            ? { 0: dayViewEvents.wholeDayEvents || [] }
            : weekViewEvents.wholeDayEvents || {}
        }
        calendarViewType={calendarViewType}
        onClickTimelineBlock={onClickTimelineBlock}
      />
      {/* <h1 className='text-2xl font-semibold text-center'>TimelineWrapper</h1> */}
      <div
        ref={timelineRef}
        style={{
          maxHeight: timelineMaxHeight,
        }}
        className='flex flex-auto overflow-y-scroll'
      >
        {/* Left Time Divider */}
        <div className='min-w-56'>
          {Array(24)
            .fill()
            .map((v, i) => {
              const date = setHours(new Date(), i);
              return (
                <div
                  key={i}
                  className='flex items-start justify-between h-12 text-gray-500 text-xxs'
                >
                  <span className='relative text-right -top-2'>
                    {i !== 0 ? format(date, 'h aa') : ''}
                  </span>
                  <div className='relative w-2 h-12 border-t -top-px' />
                </div>
              );
            })}
        </div>

        {/* Timeline */}
        {calendarViewType === CalendarViewTypes.DAY_VIEW &&
          Object.keys(dayViewEvents).length > 0 && (
            <Timeline
              calendarViewType={calendarViewType}
              data={dayViewEvents}
              onClickTimelineBlock={onClickTimelineBlock}
            />
          )}
        {calendarViewType === CalendarViewTypes.WEEK_VIEW &&
          Object.keys(weekViewEvents).length > 0 && (
            <Timeline
              calendarViewType={calendarViewType}
              data={weekViewEvents}
              onClickTimelineBlock={onClickTimelineBlock}
            />
          )}
      </div>
    </div>
  );
};

export default TimelineWrapper;
