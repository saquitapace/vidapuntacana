import React from 'react';
import { useFormContext } from 'react-hook-form';

function MerchantInfoStep() {
  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
        Tell us about your business
      </h2>
      <div className='space-y-6'>
        <div>
          <label
            htmlFor='businessInfo'
            className='block text-sm font-medium text-gray-700'
          >
            Business Information
          </label>
          <textarea
            id='businessInfo'
            {...register('businessInfo')}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
            placeholder='Describe your products or services, target audience, and any other relevant information about your business.'
            rows={5}
          />
          {errors.businessInfo && touchedFields?.businessInfo && (
            <p className='mt-1 text-sm text-red-600'>
              Please provide information about your business
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor='businessLink'
            className='block text-sm font-medium text-gray-700'
          >
            Business Website
          </label>
          <input
            id='businessLink'
            type='url'
            {...register('businessLink')}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
            placeholder='https://www.yourbusiness.com'
          />
          {errors.businessLink && touchedFields.businessLink && (
            <p className='mt-1 text-sm text-red-600'>
              Please enter a valid URL
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor='businessEmail'
            className='block text-sm font-medium text-gray-700'
          >
            Business Email
          </label>
          <input
            id='businessEmail'
            type='email'
            {...register('businessEmail')}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
            placeholder='contact@yourbusiness.com'
          />
          {errors.businessEmail && touchedFields.businessEmail && (
            <p className='mt-1 text-sm text-red-600'>
              Please enter a valid email address
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MerchantInfoStep;
