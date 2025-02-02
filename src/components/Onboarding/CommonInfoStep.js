import React from 'react';
import { useFormContext } from 'react-hook-form';

function CommonInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fields = [
    { id: 'firstName', label: 'First Name', placeholder: 'John' },
    { id: 'lastName', label: 'Last Name', placeholder: 'Doe' },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      placeholder: '+1 (555) 123-4567',
      type: 'tel',
    },
  ];

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
        Tell us about yourself
      </h2>
      <div className='space-y-6'>
        {fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className='block text-sm font-medium text-gray-700'
            >
              {field.label}
            </label>
            <input
              id={field.id}
              {...register(field.id)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
              placeholder={field.placeholder}
              type={field.type || 'text'}
            />
            {errors[field.id] && (
              <p className='mt-1 text-sm text-red-600'>
                {errors[field.id].message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommonInfoStep;
