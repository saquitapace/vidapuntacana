const { colorLookup } = require("@/src/utils/helpers");

export function CalendarDay({ day, events }) {
    return (
      <div className='aspect-square bg-gray-50 rounded-lg p-1 hover:bg-gray-100 transition-colors'>
        <div className='text-sm font-medium text-gray-700 mb-1 p-1'>{day}</div>
        <div className='space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]'>
          {events.map((event) => {
            const startDate = new Date(event?.start_date || event?.date);
            const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div
                key={event.id}
                className={`text-xs p-0.5 text-black rounded truncate ${
                  colorLookup[Number(event?.theme_color || 0)] || 'bg-blue-100 text-blue-800'
                }`}
                title={`${event.title} - ${startTime}`}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-[10px] opacity-75">{startTime}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }