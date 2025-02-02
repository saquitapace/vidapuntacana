import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaCheck, FaChevronUp, FaChevronDown, FaSearch } from 'react-icons/fa';

const artistTypes = [
  'Singer',
  'Actor',
  'Painter',
  'Sculptor',
  'Photographer',
  'Dancer',
  'Writer',
  'Other',
];

function ArtistInfoStep() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const selectedArtistType = watch('artistType');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTypes = artistTypes.filter((type) =>
    type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (type) => {
    setValue('artistType', type, { shouldValidate: true });
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
        What type of artist are you?
      </h2>
      <div className='space-y-4'>
        <div className='relative'>
          <button
            type='button'
            onClick={() => setIsOpen(!isOpen)}
            className='w-full flex justify-between items-center bg-white border border-gray-300 text-gray-700 rounded-md px-4 py-2 shadow-sm hover:bg-purple-50 hover:border-purple-300'
          >
            {selectedArtistType || 'Select artist type...'}
            {isOpen ? (
              <FaChevronUp className='ml-2 h-4 w-4 opacity-50' />
            ) : (
              <FaChevronDown className='ml-2 h-4 w-4 opacity-50' />
            )}
          </button>
          {isOpen && (
            <div className='absolute z-100 w-full bg-white border border-gray-200 rounded-md mt-2 shadow-lg'>
              <div className='flex items-center px-3 py-2 border-b'>
                <FaSearch className='h-4 w-4 text-gray-400' />
                <input
                  placeholder='Search artist types...'
                  className='flex-1 ml-2 bg-transparent outline-none text-sm'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className='max-h-60 overflow-auto'>
                {filteredTypes.length === 0 ? (
                  <div className='py-6 text-center text-sm text-gray-500'>
                    No artist type found.
                  </div>
                ) : (
                  filteredTypes.map((type) => (
                    <button
                      key={type}
                      type='button'
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        selectedArtistType === type
                          ? 'bg-gray-100 font-semibold'
                          : ''
                      }`}
                      onClick={() => handleSelect(type)}
                    >
                      <div className='flex items-center'>
                        <FaCheck
                          className={`mr-2 h-4 w-4 ${
                            selectedArtistType === type
                              ? 'opacity-100'
                              : 'opacity-0'
                          }`}
                        />
                        {type}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {errors.artistType && (
          <p className='mt-1 text-sm text-red-600'>
            Please select an artist type
          </p>
        )}
      </div>
    </div>
  );
}

export default ArtistInfoStep;
