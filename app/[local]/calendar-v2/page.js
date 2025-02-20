import { getAllEvents } from '@/app/actions/event.action';
import Calendar from '@/src/components/Calendar';
import MyCalendar from '@/src/components/CalendarV2';
import PreLoader from '@/src/components/PreLoader';
import React, { Suspense } from 'react';

const Page = async () => {
    const events = await getAllEvents()
  return (
    <Suspense fallback={<PreLoader />}>
      <MyCalendar events={events} isLoggedIn={true}/>
    </Suspense>
  );
};

export default Page;
