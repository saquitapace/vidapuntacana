import Calendar from '@/src/components/Calendar';
import PreLoader from '@/src/components/PreLoader';
import React, { Suspense } from 'react';

const Page = () => {
  return (
    <Suspense fallback={<PreLoader />}>
      <Calendar />
    </Suspense>
  );
};

export default Page;
