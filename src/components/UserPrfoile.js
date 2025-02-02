'use client';
import { useAuth, UserButton, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { IoNotificationsOutline, IoChatbubbleOutline } from 'react-icons/io5';

const NotificationIcon = ({ notifications = 4 }) => {
  return (
    <div className='relative'>
      <IoNotificationsOutline className='w-6 h-6 text-gray-700 fill-gray-700' />
      {notifications > 0 && (
        <span className='absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full'>
          {notifications}
        </span>
      )}
    </div>
  );
};

const MessageIcon = ({ messages = 4 }) => {
  return (
    <div className='relative'>
      <IoChatbubbleOutline className='w-6 h-6 text-gray-700 fill-gray-700' />

      {messages > 0 && (
        <span className='absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full'>
          {messages}
        </span>
      )}
    </div>
  );
};

const UserPrfoile = () => {
  const locale = useLocale();
  const { isLoaded, isSignedIn, userId } = useAuth();
  console.log('isLoaded ', isLoaded, isSignedIn, userId);
  return (
    <div>
      <li className='user-btn'>
        {isLoaded && isSignedIn ? (
          <>
            <ClerkLoading>
              <div className='w-[2.75rem] h-[2.75rem] bg-gray-300 overflow-hidden rounded-full animate-pulse'></div>
            </ClerkLoading>
            <ClerkLoaded>
              <div className='flex items-center justify-center gap-x-5'>
                <NotificationIcon />
                <MessageIcon />
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        'w-[2.75rem] h-[2.75rem] rounded-full overflow-hidden',
                    },
                  }}
                />
              </div>
            </ClerkLoaded>
          </>
        ) : (
          <>
            <Link className='icon' href={`/${locale}/sign-in`}>
              <i className='flaticon-avatar'></i>
            </Link>
          </>
        )}
      </li>
    </div>
  );
};

export default UserPrfoile;
