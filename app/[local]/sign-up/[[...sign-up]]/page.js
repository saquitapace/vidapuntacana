'use client';
import { ClerkLoaded, ClerkLoading, SignUp } from '@clerk/nextjs';
import './sign-up.css';
import Layout from '@/src/layouts/Layout';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export default function SignUpPage() {
  const t = useTranslations('Auth');
  const tCommon = useTranslations('Common');
  const locale = useLocale();

  return (
    <Layout>
      <div className='login-wrapper'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-6'>
              <div className='login-form-box'>
                <h3 className='form-title'>{t('signup_title')}</h3>
                <p className='text-center mb-4'>{t('signup_subtitle')}</p>
                <ClerkLoading>
                  <div className='clerk-loading-skeleton'>
                    <div className='skeleton social-buttons' aria-label={t('socialButtons')}></div>
                    <div className='skeleton or-divider' aria-label={t('orDivider')}></div>
                    <div className='skeleton input' aria-label={t('email')}></div>
                    <div className='skeleton input' aria-label={t('password')}></div>
                    <div className='skeleton button' aria-label={t('continueButton')}></div>
                    <div className='skeleton footer-link' aria-label={t('footerText')}></div>
                  </div>
                </ClerkLoading>
                <ClerkLoaded>
                  <SignUp
                    fallbackRedirectUrl={`/${locale}/complete-profile`}
                    forceRedirectUrl={`/${locale}/complete-profile`}
                    appearance={{
                      elements: {
                        rootBox: 'clerk-form',
                        card: 'clerk-container',
                        headerTitle: 'clerk-title',
                        headerSubtitle: 'clerk-subtitle',
                        cardBox: 'clerk-card',
                        socialButtonsBlockButton: 'clerk-social-button',
                        formButtonPrimary: 'clerk-primary-button',
                        formFieldInput: 'clerk-input',
                        footerActionLink: 'clerk-link',
                        dividerLine: 'clerk-divider',
                        dividerText: 'clerk-divider-text',
                        formFieldLabel: 'clerk-label',
                      },
                      text: {
                        socialButtonsBlockButton: {
                          google: t('orContinueWith') + ' Google',
                        },
                        formFieldLabel: {
                          emailAddress: t('email'),
                          password: t('password'),
                          firstName: t('firstName') || 'First Name',
                          lastName: t('lastName') || 'Last Name',
                        },
                      
                        footerActionLink: {
                          signIn: t('sign_in'),
                          signUp: t('sign_up'),
                        },
                        dividerText: t('auth.or_continue_with'),
                      },
                    }}
                    routing='path'
                    path={`/${locale}/sign-up`}
                  />
                </ClerkLoaded>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
