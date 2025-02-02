import { format, isBefore, startOfDay } from 'date-fns';
import { colorLookup } from '@/src/utils/helpers';
import { setSelectedEvent } from '@/src/store/slices/calendarSettingSlice';
import { useDispatch } from 'react-redux';
import { useRef } from 'react';

const CalendarViewGridItemSingleEvent = ({ data, index }) => {
  const today = startOfDay(new Date());
  const dispatch = useDispatch();
  const monthEventContainerRef = useRef(null);
  const handleOnClickBlock = () => {
    const { top, left, height, width } =
      monthEventContainerRef?.current?.getBoundingClientRect();

      dispatch(setSelectedEvent({
        ...data,
        eventUid: data?.id,
        top: top - 65,
        left: left - 248,
        height,
        width,
      }));
  };
  return (
    <div
      ref={monthEventContainerRef}
    onClick={handleOnClickBlock}
      className={`
      relative flex items-center px-2 h-5 overflow-hidden text-xs transition rounded-sm cursor-pointer hover:bg-gray-100
      ${isBefore(new Date(data.startDate), today) && 'opacity-50'}
      ${index > 0 ? 'mt-0.5' : ''}
    `}
    >
      <div
        className={`
        w-2 h-2 rounded-full mr-2
        ${colorLookup[data?.themeColor || 0]}
      `}
      />
      <div className='absolute min-w-0 pr-2 text-gray-600 truncate left-6'>
        <span>{format(new Date(data.startDate), 'K:mm aaa')}</span>
        <span className='ml-1.5'>{data.title}</span>
      </div>
    </div>
  );
};

export default CalendarViewGridItemSingleEvent;
