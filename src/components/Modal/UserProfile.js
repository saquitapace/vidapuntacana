'use client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';

const UserProfileModal = ({ onCloseUserProfile }) => {
  const profileRef = useRef(null);
  const { push } = useRouter();
  const currentUser = useSelector(({ user }) => user);
  const t = useTranslations('common');

  const handleLogout = () => push('/');

  useEffect(() => {
    const checkOutsideClick = (e) => {
      if (profileRef && profileRef.current) {
        const outsideClick = !profileRef.current.contains(e.target);
        if (outsideClick) {
          onCloseUserProfile();
        }
      }
    };

    document.addEventListener('click', checkOutsideClick);

    return () => {
      document.removeEventListener('click', checkOutsideClick);
    };
  }, [profileRef, onCloseUserProfile]);

  return (
    <div
      ref={profileRef}
      className="absolute z-20 flex flex-col justify-center bg-white border rounded-md shadow-lg w-96 right-1 top-14"
    >
      <div className="flex flex-col items-center justify-center px-6 py-5">
        <Image
          src={currentUser.photoUrl}
          height="80px"
          width="80px"
          alt={t('profile.profile_picture')}
          className="rounded-full"
        />
        <p className="mt-2 font-bold tracking-medium">
          {currentUser.displayName}
        </p>
        <p className="text-sm text-gray-500">
          {currentUser.email}
        </p>
      </div>
      <hr className="border-gray-200" />
      <div className="flex flex-col px-6 py-4">
        <button
          onClick={() => push('/complete-profile')}
          className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
        >
          <i className="mr-3 ti-user"></i>
          {t('profile.edit_profile')}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-red-600 rounded-md hover:bg-red-50"
        >
          <i className="mr-3 ti-power-off"></i>
          {t('profile.logout')}
        </button>
      </div>
    </div>
  );
};

export default UserProfileModal;