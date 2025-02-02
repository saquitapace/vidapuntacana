const { FaChevronLeft, FaChevronRight } = require("react-icons/fa");

export function CalendarHeader({ monthName, year, onPreviousMonth, onNextMonth }) {
    return (
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>
          {monthName} {year}
        </h2>
        <div className='flex space-x-2'>
          <button
            onClick={onPreviousMonth}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <FaChevronLeft className='w-5 h-5 text-gray-600' />
          </button>
          <button
            onClick={onNextMonth}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <FaChevronRight className='w-5 h-5 text-gray-600' />
          </button>
        </div>
      </div>
    );
  }