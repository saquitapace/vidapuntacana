import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
// import { useTranslation } from 'react-i18next';

function FinalStep({ userType }) {
  const { watch } = useFormContext();
  const userData = watch();
  // const { t } = useTranslation();

  const infoFields = [
    { label: 'First Name', value: userData.firstName },
    { label: 'Last Name', value: userData.lastName },
    { label: 'Phone Number', value: userData.phoneNumber },
    ...(userType === 'user'
      ? [
          {
            label: 'Interests',
            value: userData.interests?.join(', ') || 'None selected',
          },
        ]
      : []),
    ...(userType === 'artist'
      ? [{ label: 'Artist Type', value: userData.artistType }]
      : []),
    ...(userType === 'merchant'
      ? [
          { label: 'Business Information', value: userData.businessInfo },
          { label: 'Business Website', value: userData.businessLink },
          { label: 'Business Email', value: userData.businessEmail },
        ]
      : []),
  ];

  return (
    <div className='space-y-8'>
      <div className='text-center'>
        <FaCheckCircle className='mx-auto h-16 w-16 text-green-500' />
        <h2 className='mt-4 text-3xl font-bold text-gray-800'>
          {/* {t('welcome')}  */}
          aboard!
        </h2>
        <p className='mt-2 text-xl text-gray-600'>
          Your account has been successfully created.
        </p>
      </div>
      <div className='bg-white rounded-lg p-6 shadow-md'>
        <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
          Your Information
        </h3>
        <dl className='grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2'>
          {infoFields.map((item, index) => (
            <div key={index}>
              <dt className='text-sm font-medium text-gray-600'>
                {item.label}
              </dt>
              <dd className='mt-1 text-lg text-gray-900'>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default FinalStep;
