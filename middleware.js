import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config/i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Define public paths that don't require authentication
const publicPaths = [
  '/sign-in',
  '/sign-up',
  '/',
  '/select-role',
  '/calendar/day/',
  '/calendar/month/',
  '/calendar/week/',
  '/contact',
];

// Define paths that should bypass middleware completely
const bypassPaths = ['/api/webhooks/clerk', '/api/check-profile'];

// Static asset patterns that should bypass middleware
const staticAssetPatterns = [
  '/_next',
  '/assets',
  /\.(jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot)$/,
];

export default clerkMiddleware((auth, req) => {
  const url = new URL(req.url);
  const { pathname } = url;

  // Early return for static assets and bypass paths
  if (
    staticAssetPatterns.some((pattern) =>
      typeof pattern === 'string'
        ? pathname.startsWith(pattern)
        : pattern.test(pathname)
    ) ||
    bypassPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // Handle internationalization
  const response = intlMiddleware(req);
  const locale = pathname.split('/')[1] || defaultLocale;
  const pathWithoutLocale = pathname.replace(`/${locale}`, '');

  // Allow API routes to bypass authentication
  if (pathname.includes('api') || pathWithoutLocale.includes('api')) {
    return NextResponse.next();
  }

  // Check if it's a public path
  const isPublicPath = publicPaths.some(
    (path) =>
      pathWithoutLocale === path ||
      pathWithoutLocale === '/' ||
      pathWithoutLocale.startsWith(`${path}/`)
  );
  if (isPublicPath) {
    return response;
  }

  // Handle authentication
  const { userId, sessionClaims } = auth();

  // if (!userId) {
  //   return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
  // }

  // // Handle profile completion
  const isProfileCompleted = sessionClaims?.metadata?.profileCompleted;
  if (
    userId &&
    !isProfileCompleted &&
    pathWithoutLocale !== '/complete-profile'
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/complete-profile`, req.url)
    );
  }

  if (isProfileCompleted && pathWithoutLocale === '/complete-profile') {
    return NextResponse.redirect(new URL(`/${locale}/`, req.url));
  }

  return response;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
