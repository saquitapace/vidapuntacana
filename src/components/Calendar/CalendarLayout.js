'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CreateEventModal from '../Modal/CreateEventModal';
import { HeaderBar } from './HeaderBar';
import PanelLeft from './Panel/PanelLeft';
import { useAuth } from '@clerk/nextjs';

const CalendarLayout = ({ children }) => {
  const { isLoaded, isSignedIn, userId } = useAuth();

  const params = useParams();
  const { isCreateEventModalOpen } = useSelector(
    (state) => state.calendarSetting
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const viewType = params.viewType || [];
    if (viewType.length > 1 && viewType[1] === 'edit') {
      setIsEditModalOpen(true);
    } else {
      setIsEditModalOpen(false);
    }
  }, [params]);

  return (
    <div className='relative flex flex-col w-screen max-h-screen min-h-screen'>
      <HeaderBar />
      <div className='flex flex-1'>
        <PanelLeft />
        <div className='relative flex-auto'>{children}</div>
      </div>
      {isCreateEventModalOpen && <CreateEventModal />}
      {isEditModalOpen && <CreateEventModal isEdit />}
    </div>
  );
};

export default CalendarLayout;
