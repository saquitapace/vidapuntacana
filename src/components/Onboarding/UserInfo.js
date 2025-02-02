'use client';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

const interests = [
  'Music',
  'Movies',
  'Books',
  'Sports',
  'Cooking',
  'Travel',
  'Photography',
  'Gaming',
  'Fashion',
  'Technology',
];

function UserInfoStep() {
  const t = useTranslations('CompleteProfile');
  const tCommon = useTranslations('Common');
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const selectedInterests = watch('interests') || [];

  const toggleInterest = (interest) => {
    const updatedInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setValue('interests', updatedInterests, { shouldValidate: true });
  };

  const filteredInterests = interests.filter((interest) =>
    interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {t('selectInterests')}
      </h2>
      <div className="space-y-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {selectedInterests.length > 0
              ? `${selectedInterests.length} ${t('selected')}`
              : t('selectInterests') + '...'}
            <span className="ml-2 text-gray-500">&#x25BC;</span>
          </button>
          {open && (
            <div className="z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4">
              <div className="flex items-center border rounded-md px-3 py-2 mb-2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 12h4m-2-2v4m4-6a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <input
                  placeholder={t('searchInterests')}
                  className="flex-1 ml-2 bg-transparent outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-auto">
                {filteredInterests.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-500">
                    {t('noInterestFound')}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        className="w-full flex items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 focus:outline-none focus:bg-purple-50"
                        onClick={() => toggleInterest(interest)}
                      >
                        <svg
                          className={`h-4 w-4 mr-2 ${
                            selectedInterests.includes(interest)
                              ? 'text-purple-500'
                              : 'text-transparent'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {interest}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {errors.interests && (
          <p className="mt-1 text-sm text-red-600">
            {t('requiredField')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('selectedInterests')}:
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedInterests.map((interest) => (
            <span
              key={interest}
              className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserInfoStep;
