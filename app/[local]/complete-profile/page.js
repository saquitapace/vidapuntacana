'use client';
import { createOrUpdateUser } from '@/app/actions/user.action';
import ArtistInfoStep from '@/src/components/Onboarding/ArtistInfoStep';
import CommonInfoStep from '@/src/components/Onboarding/CommonInfoStep';
import FinalStep from '@/src/components/Onboarding/FInalStep';
import MerchantInfoStep from '@/src/components/Onboarding/MerchantInfoStep';
import UserInfoStep from '@/src/components/Onboarding/UserInfo';
import ProgressBar from '@/src/components/ProgressBar';
import StepNavigator from '@/src/components/StepNavigator';
import UserTypeSelection from '@/src/components/UserTypeSelection';
import Layout from '@/src/layouts/Layout';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  interests: z.array(z.string()).optional().default([]),
  artistType: z.string().optional(),
  businessInfo: z.string().optional(),
  businessLink: z.string().url('Invalid URL').optional(),
  businessEmail: z.string().email('Invalid email').optional(),
});

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const t = useTranslations('Onboarding');
  const userId = user?.id;
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const methods = useForm({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      interests: [],
      artistType: '',
      businessInfo: '',
      businessLink: '',
      businessEmail: '',
    },
  });
  const handleUserTypeSelect = useCallback(
    (type) => {
      setUserType(type);
      setStep((step) => step + 1);
    },
    [step]
  );

  const steps = [
    { title: 'User Type', component: null },
    { title: 'Personal Info', component: CommonInfoStep },
    {
      title: 'Additional Info',
      component:
        userType === 'user'
          ? UserInfoStep
          : userType === 'artist'
          ? ArtistInfoStep
          : userType === 'merchant'
          ? MerchantInfoStep
          : null,
    },
    { title: 'Finish', component: FinalStep },
  ];

  const CurrentStepComponent = steps[step]?.component;
  const handleBack = useCallback(() => {
    if (step > 0) setStep((step) => step - 1);
  }, [step]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const common = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: userType,
      };
      const userFields = {
        user: {
          ...common,
          interests: data.interests,
          role: 'user',
        },
        artist: {
          ...common,
          artistType: data.artistType,
          interests: data.interests,
        },
        merchant: {
          ...common,
          businessInfo: data.businessInfo,
          businessLink: data.businessLink,
          businessEmail: data.businessEmail,
        },
      };

      const userData = userFields[userType];
      userData['profileCompleted'] = true;
      const { err, data: responseData } = await createOrUpdateUser(userData);
      if (!err) {
        setIsSubmitted(true);
        router.push('/en');
      }
      return { err };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const handleNext = useCallback(async () => {
    methods.clearErrors();

    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'phoneNumber'];
    } else if (step === 2) {
      fieldsToValidate =
        userType === 'user'
          ? ['interests']
          : userType === 'artist'
          ? ['artistType']
          : ['businessInfo', 'businessLink', 'businessEmail'];
    }

    const isValid = await methods.trigger(fieldsToValidate);

    if (isValid) {
      if (step === 2) {
        const formData = methods.getValues();
        const { err } = await handleSubmit(formData);
        if (err) {
          return;
        }
      }
      setStep((prevStep) => prevStep + 1);
      // methods.clearErrors();
    }
  }, [step, methods, userType, handleSubmit]);

  return (
    <Layout>
      <section className='pt-175 lg:pt-140 pb-150 lg:pb-120 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-center'>
            <div className='w-full max-w-4xl'>
              <div className='bg-white rounded-lg shadow-md p-5 '>
                <div className='text-center mb-8'>
                  <h2 className='text-3xl font-bold text-heading mb-3'>
                    {t('profile.complete_your_profile')}
                  </h2>
                  <p className='text-gray-600'>{t('profile.get_started')}</p>
                </div>

                <div className='p-8'>
                  <ProgressBar step={step} steps={steps} />
                  <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(handleSubmit)}>
                      {step === 0 ? (
                        <UserTypeSelection onSelect={handleUserTypeSelect} />
                      ) : (
                        CurrentStepComponent && (
                          <CurrentStepComponent userType={userType} />
                        )
                      )}
                      <StepNavigator
                        step={step}
                        steps={steps}
                        onNext={handleNext}
                        onBack={handleBack}
                        disabled={isLoading || isSubmitted}
                      />
                    </form>
                  </FormProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
