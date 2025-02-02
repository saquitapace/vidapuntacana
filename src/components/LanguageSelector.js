'use client';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const changeLanguage = (languageCode) => {
    const currentPath = pathname;
    const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${languageCode}`);
    router.push(newPath);
  };

  const currentLocale = pathname.split('/')[1] || 'en';

  return (
    <div className='inline-block ml-4'>
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={currentLocale}
        className='px-3 py-2 border not-nice-select border-gray-300 rounded-md bg-transparent text-gray-700 cursor-pointer focus:outline-none focus:border-gray-500'
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
