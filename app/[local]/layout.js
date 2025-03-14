import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import ReduxProvider from '@/src/providers/ReduxProvider';
import NotificationProvider from '@/src/providers/NotificationProvider';
import { NextIntlClientProvider } from 'next-intl';

export const metadata = {
  title: 'Vidapuntacana',
  description: 'Vidapuntacana',
  image: '/logo.jpeg',
};

export default async function LocaleLayout({ children, params: { local } }) {
  let messages;
  try {
    messages = (await import(`../../messages/${local}.json`)).default;
  } catch (error) {
    // If the locale messages fail to load, use an empty object
    messages = {};
  }
  return (
    <html lang={local}>
      <body>
        <ClerkProvider>
          <NextIntlClientProvider locale={local} messages={messages}>
            <NotificationProvider>
              <ReduxProvider>{children}</ReduxProvider>
            </NotificationProvider>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
