import { FaUser, FaPalette, FaStore } from 'react-icons/fa';
import { Button } from './ui/Button';

export default function UserTypeSelection({ onSelect }) {
  const userTypes = [
    {
      type: 'user',
      icon: FaUser,
      title: 'Regular User',
      desc: "I'm here to explore",
    },
    {
      type: 'artist',
      icon: FaPalette,
      title: 'Artist',
      desc: 'I create and share art',
    },
    {
      type: 'merchant',
      icon: FaStore,
      title: 'Merchant',
      desc: 'I sell products or services',
    },
  ];

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
        What best describes you?
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {userTypes.map((item) => (
          <Button
            key={item.type}
            variant='outline'
            className='h-40 flex flex-col items-center justify-center text-left p-4 hover:bg-purple-50 hover:border-purple-300 transition-all'
            onClick={() => onSelect(item.type)}
          >
            <item.icon size={40} className='mb-3 text-purple-500' />
            <span className='font-semibold text-lg text-gray-800'>
              {item.title}
            </span>
            <span className='text-sm text-gray-600 mt-1'>{item.desc}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
