import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './CategoryForm.css';

const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters' })
    .max(50, { message: 'Category name cannot exceed 50 characters' }),
});

const CategoryForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  });

  return (
    <div className='category-form-container'>
      <h2>Add New Category</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group'>
          <label htmlFor='name'>
            Category Name <span className='required'>*</span>
          </label>
          <input
            id='name'
            type='text'
            {...register('name')}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && (
            <p className='error-message'>{errors.name.message}</p>
          )}
        </div>

        <button type='submit' className='submit-button' disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
