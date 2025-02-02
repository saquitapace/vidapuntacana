import { format, isSameDay } from 'date-fns';
import { useRef } from 'react';
import { MdClose, MdDelete, MdEdit, MdToday } from 'react-icons/md';
import { colorLookup } from '../../utils/helpers';
import IconButton from '../Common/Button/IconButton';

/*
  When a user clicks on an event, the eventUid is passed to the page component
  After receiving the selected EventUid, it looks for the event in the eventDB using the uid,
  and then, the event is passed to the event-detail modal
*/
const EventDetailModal = ({ selectedEvent, onCloseModal }) => {
  const eventDetailModalRef = useRef(null);

  const parseEventDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isSameDay(start, end)) {
      return `${format(start, 'eeee, MMMM d ⋅ h:mmaaa')} – ${format(
        end,
        'h:mmaaa'
      )}`;
    } else {
      return `${format(start, 'MMMM d, yyyy h:mmaaa')} – ${format(
        end,
        'MMMM d, yyyy h:mmaaa'
      )}`;
    }
  };

  return (
    <div
      ref={eventDetailModalRef}
      style={{
        top: selectedEvent.top,
        left: selectedEvent.left,
      }}
      className='absolute z-50 p-4 bg-white rounded-lg shadow-lg min-w-[280px] max-w-sm'
    >
      {/* Modal Header */}
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center gap-2'>
          <div
            className={`h-4 w-4 rounded-sm ${
              colorLookup[selectedEvent?.themeColor || 0]
            }`}
          />
          <h2 className='text-lg font-semibold'>{selectedEvent?.title}</h2>
        </div>
        <div className='flex gap-2'>
          <IconButton
            size='small'
            imgComponent={<MdEdit size='20px' className='text-gray-500' />}
            onClickHandler={() => {}}
          />
          <IconButton
            size='small'
            imgComponent={<MdDelete size='20px' className='text-gray-500' />}
            onClickHandler={() => {}}
          />
          <IconButton
            size='small'
            imgComponent={<MdClose size='20px' className='text-gray-500' />}
            onClickHandler={onCloseModal}
          />
        </div>
      </div>

      {/* Modal Content */}
      <div className='mb-4'>
        <div className='text-sm text-gray-700 mb-2'>
          <span className='font-medium'>Date & Time:</span>{' '}
          {parseEventDate(selectedEvent?.startDate, selectedEvent?.endDate)}
        </div>
        <div className='flex items-center text-sm text-gray-700'>
          <MdToday className='text-gray-500 mr-2' />
          <span>
            <span className='font-medium'>Creator:</span>{' '}
            {selectedEvent?.eventCreator?.displayName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
