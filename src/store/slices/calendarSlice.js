import { createSlice } from '@reduxjs/toolkit';
import { CalendarViewTypes } from '../../utils/types';
import {
  getBaseDayViewEvents,
  getBaseWeekViewEvents,
  getBaseMonthViewEvents,
  getClosestIndexForDayViewEvents,
} from '../../utils/helpers';

const initialState = {
  dayViewEvents: getBaseDayViewEvents(),
  weekViewEvents: getBaseWeekViewEvents(),
  monthViewEvents: getBaseMonthViewEvents(new Date()),
  loading: false,
  error: null,
};

const insertEventToDayViewContainer = (container, events) => {
  if (!events || !Array.isArray(events)) return container;

  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    const [hour, minute] = getClosestIndexForDayViewEvents(eventDate);

    if (event.isAllDay) {
      container.wholeDayEvents.push(event);
    } else if (container.hours[hour] && container.hours[hour][minute]) {
      container.hours[hour][minute].events.push(event);
    }
  });

  return container;
};

const insertEventToWeekViewContainer = (container, events) => {
  if (!events || !Array.isArray(events)) return container;

  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    const dayOfWeek = eventDate.getDay();
    const [hour, minute] = getClosestIndexForDayViewEvents(eventDate);

    if (event.isAllDay) {
      if (container.wholeDayEvents[dayOfWeek]) {
        container.wholeDayEvents[dayOfWeek].events.push(event);
      }
    } else if (
      container.days[dayOfWeek] &&
      container.days[dayOfWeek][hour] &&
      container.days[dayOfWeek][hour][minute]
    ) {
      container.days[dayOfWeek][hour][minute].events.push(event);
    }
  });

  return container;
};

const calculateIncomingRowMatrix = (monthEvents) => {
  const incomingRowsMatrix = {};

  Object.keys(monthEvents).forEach((date) => {
    const events = monthEvents[date].events;

    events.forEach((event) => {
      if (event.endDate) {
        const eventEnd = new Date(event.endDate);
        const duration = Math.ceil(
          (eventEnd - new Date(event.startDate)) / (1000 * 60 * 60 * 24)
        );

        if (duration > 1) {
          incomingRowsMatrix[event.id] = duration - 1;
        }
      }
    });
  });

  return { ...monthEvents, incomingRowsMatrix };
};

const insertEventToMonthViewContainer = (container, events) => {
  if (!events || !Array.isArray(events)) return container;

  events.forEach((event) => {
    const eventStart = new Date(event.startDate);
    const month = eventStart.getMonth();
    const date = eventStart.getDate();

    if (container[month] && container[month][date]) {
      // Add event to the correct date
      container[month][date].events.push(event);

      // Calculate incoming rows matrix if needed
      if (event.endDate) {
        const eventEnd = new Date(event.endDate);
        const duration = Math.ceil(
          (eventEnd - eventStart) / (1000 * 60 * 60 * 24)
        );

        if (duration > 1) {
          container[month][date].incomingRowsMatrix[event.id] = duration - 1;
        }
      }
    }
  });

  // Calculate incoming rows matrix for each month
  Object.keys(container).forEach((month) => {
    container[month] = calculateIncomingRowMatrix(container[month]);
  });

  return container;
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCalendarEvents: (state, { payload }) => {
      const { calendarViewType, events } = payload;

      switch (calendarViewType) {
        case CalendarViewTypes.DAY_VIEW:
          state.dayViewEvents = insertEventToDayViewContainer(
            getBaseDayViewEvents(),
            events
          );
          break;

        case CalendarViewTypes.WEEK_VIEW:
          state.weekViewEvents = insertEventToWeekViewContainer(
            getBaseWeekViewEvents(),
            events
          );
          break;

        case CalendarViewTypes.MONTH_VIEW:
          state.monthViewEvents = insertEventToMonthViewContainer(
            getBaseMonthViewEvents(new Date()),
            events
          );
          break;
      }
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
    resetCalendarEvents: (state) => {
      state.dayViewEvents = getBaseDayViewEvents();
      state.weekViewEvents = getBaseWeekViewEvents();
      state.monthViewEvents = getBaseMonthViewEvents(new Date());
      state.error = null;
    },
  },
});

export const fetchEvents =
  (calendarViewType, targetDate) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(
        `/api/events?viewType=${calendarViewType}&date=${targetDate}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const events = await response.json();

      dispatch(setCalendarEvents({ calendarViewType, events }));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const { setCalendarEvents, setLoading, setError, resetCalendarEvents } =
  calendarSlice.actions;

export default calendarSlice.reducer;
