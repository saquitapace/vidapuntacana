import { ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs';
import './sign-in.css';
import Layout from '@/src/layouts/Layout';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export default function SignInPage() {
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
                <h3 className='form-title'>{t('welcomeBack')}</h3>
                <p className='text-center mb-4'>{t('enterDetails')}</p>
                <ClerkLoading>
                  <div className='clerk-loading-skeleton'>
                    <div className='skeleton social-buttons'></div>
                    <div className='skeleton or-divider'></div>
                    <div className='skeleton input'></div>
                    <div className='skeleton input'></div>
                    <div className='skeleton button'></div>
                    <div className='skeleton footer-link'></div>
                  </div>
                </ClerkLoading>
                <ClerkLoaded>
                  <SignIn
                    fallbackRedirectUrl='/complete-profile'
                    forceRedirectUrl='/complete-profile'
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
                      },
                      text: {
                        socialButtonsBlockButton: {
                          google: t('orContinueWith') + ' Google',
                        },
                        formFieldLabel: {
                          emailAddress: t('email'),
                          password: t('password'),
                        },
                        footerActionLink: {
                          signIn: t('sign_in'),
                          signUp: t('sign_up'),
                        },
                        dividerText: t('orContinueWith'),
                      },
                    }}
                    signUpUrl={`/${locale}/sign-up`}
                    routing='path'
                    // path='/sign-in'
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
