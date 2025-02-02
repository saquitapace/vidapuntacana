import { useFormContext } from 'react-hook-form';
import { Button } from './ui/Button';
import { useLocale } from 'next-intl';

export default function StepNavigator({
  step,
  steps,
  onNext,
  onBack,
  nextLabel,
  prevLabel,
}) {
  const locale = useLocale();

  const handleNext = () => {
    if (step === steps.length - 1) {
      window.location.href = `/${locale}`;
    } else {
      onNext();
    }
  };
  const isSecondLastStep = step === steps.length - 2;

  return (
    <div className='flex justify-between mt-8'>
      {step > 0 && (
        <Button
          variant='outline'
          onClick={onBack}
          className='text-purple-600 border-purple-300 hover:bg-purple-50'
        >
          {prevLabel ?? 'Back'}
        </Button>
      )}
      {step < steps.length && step > 0 && (
        <Button
          type={isSecondLastStep ? 'submit' : 'button'}
          onClick={handleNext}
          className='bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
        >
          {nextLabel ?? 'Next'}
        </Button>
      )}
    </div>
  );
}
