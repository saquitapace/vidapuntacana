import { insertContactUsDetails } from '@/app/actions/contact.action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNotifications } from 'reapop';
import * as z from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });
  const { notify } = useNotifications();
  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    try {
      const response = await insertContactUsDetails(data);
      if (response.err) {
        throw new Error(response.err);
      }
      notify({
        title: 'Contact Details Saved!',
        message:
          'Your contact details have been successfully saved. We will get back to you shortly.',
        dismissible: true,
        dismissAfter: 3000,
      });
      reset();
    } catch (error) {
      setError(
        typeof error === 'string'
          ? error
          : error?.message ?? 'Something went wrong'
      );
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='row'>
        <div className='col-lg-6'>
          <div className='form_group'>
            {errors.firstName && (
              <p className='text-red-400 mb-2'>{errors.firstName.message}</p>
            )}
            <input
              type='text'
              className='form_control'
              placeholder='First Name'
              {...register('firstName')}
            />
          </div>
        </div>
        <div className='col-lg-6'>
          <div className='form_group'>
            {errors.lastName && (
              <p className='text-red-400 mb-2'>{errors.lastName.message}</p>
            )}
            <input
              type='text'
              className='form_control'
              placeholder='Last Name'
              {...register('lastName')}
            />
          </div>
        </div>
        <div className='col-lg-6'>
          <div className='form_group'>
            {errors.phone && (
              <p className='text-red-400 mb-2'>{errors.phone.message}</p>
            )}
            <input
              type='text'
              className='form_control'
              placeholder='Phone'
              {...register('phone')}
            />
          </div>
        </div>
        <div className='col-lg-6'>
          <div className='form_group'>
            {errors.email && (
              <p className='text-red-400 mb-2'>{errors.email.message}</p>
            )}
            <input
              type='email'
              className='form_control'
              placeholder='Email'
              {...register('email')}
            />
          </div>
        </div>
        <div className='col-lg-12'>
          <div className='form_group'>
            {errors.subject && (
              <p className='text-red-400 mb-2'>{errors.subject.message}</p>
            )}
            <input
              type='text'
              className='form_control'
              placeholder='Subject'
              {...register('subject')}
            />
          </div>
        </div>
        <div className='col-lg-12'>
          <div className='form_group'>
            {errors.message && (
              <p className='text-red-400 mb-2'>{errors.message.message}</p>
            )}
            <textarea
              className='form_control'
              placeholder='Your Message'
              {...register('message')}
            />
          </div>
          {error && <p className='text-red-400 mb-2'>{error}</p>}
        </div>
        <div className='col-lg-12'>
          <div className='form_group'>
            <button className='main-btn' type='submit'>
              {isLoading ? 'Sending ...' : 'Send'} Message
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
