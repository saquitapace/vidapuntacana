import { createSlice } from '@reduxjs/toolkit';

export const CalendarViewTypes = {
  DAY_VIEW: 'DAY_VIEW',
  WEEK_VIEW: 'WEEK_VIEW',
  MONTH_VIEW: 'MONTH_VIEW',
};

const initialState = {
  targetDate: new Date(),
  calendarViewType: CalendarViewTypes.MONTH_VIEW,
  isCreateEventModalOpen: false,
  selectedEvent: {
    eventUid: '',
    top: 0,
    left: 0,
    height: 0,
    width: 0,
  },
  createEventBasis: {
    startDate: new Date(),
    endDate: new Date(),
  },
};

export const calendarSettingSlice = createSlice({
  name: 'calendarSetting',
  initialState,
  reducers: {
    setTargetDate: (state, action) => {
      state.targetDate = action.payload;
    },
    setCalendarViewType: (state, action) => {
      state.calendarViewType = action.payload;
    },
    setCreateEventBasis: (state, action) => {
      state.createEventBasis = action.payload;
    },
    setIsCreateEventModalOpen: (state, action) => {
      state.isCreateEventModalOpen = action.payload;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    resetCalendarSettings: (state) => {
      state.targetDate = new Date();
      state.calendarViewType = CalendarViewTypes.DAY_VIEW;
      state.isCreateEventModalOpen = false;
      state.selectedEvent = {
        eventUid: '',
        top: 0,
        left: 0,
        height: 0,
        width: 0,
      };
      state.createEventBasis = {
        startDate: new Date(),
        endDate: new Date(),
      };
    },
  },
});

export const {
  setTargetDate,
  setCalendarViewType,
  setCreateEventBasis,
  setIsCreateEventModalOpen,
  setSelectedEvent,
  resetCalendarSettings,
} = calendarSettingSlice.actions;

export default calendarSettingSlice.reducer;
