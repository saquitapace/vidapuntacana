'use client';

import { configureStore } from '@reduxjs/toolkit';
import calendarSettingReducer from './slices/calendarSettingSlice';
import calendarReducer from './slices/calendarSlice';

const isClient = typeof window !== 'undefined';

const makeStore = () => {
  return configureStore({
    reducer: {
      calendarSetting: calendarSettingReducer,
      calendar: calendarReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

let store = makeStore();
export default store;
// For server-side rendering, create a new store for each request
if (!isClient) {
  store = makeStore();
}
