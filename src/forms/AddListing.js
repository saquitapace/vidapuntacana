'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiX, FiClock, FiMapPin, FiPhone, FiGlobe } from 'react-icons/fi';
import { BsInstagram, BsFacebook } from 'react-icons/bs';
import './style.css';
import { supabase } from '../lib/supabaseClient';

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

export const AddListingSchema = z.object({
  id: z.union([z.number(), z.string()]).optional().nullable(),
  lid: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  primaryCategory: z.object({
    id: z.union([z.number(), z.string()]),
    name: z.string(),
    listing_category_id: z.union([z.number(), z.string()]).optional(),
  }),
  categories: z.array(
    z.object({
      id: z.union([z.number(), z.string()]),
      name: z.string(),
    })
  ),
  tags: z.array(z.string()).optional(),
  photos: z
    .array(
      z.union([
        z.string(),
        z.object({
          id: z.union([z.number(), z.string()]).optional(),
          url: z.string().optional(),
        }),
      ])
    )
    .optional(),
  review_count: z.number().int().nonnegative().optional().default(0),
  rating: z.number().min(0).max(5).optional().default(0),
  hours: z.array(
    z.object({
      day: z.number().min(1).max(7),
      start_time: z
        .string()
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          'Valid time format required (HH:MM)'
        ),
      end_time: z
        .string()
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          'Valid time format required (HH:MM)'
        ),
    })
  ),
  socialMedia: z.object({
    id: z.union([z.number(), z.string()]).optional().nullable(),
    instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
    facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
    tripAdvisor: z.string().url('Invalid URL').optional().or(z.literal('')),
    whatsapp: z.string().optional().or(z.literal('')),
    google: z.string().url('Invalid URL').optional().or(z.literal('')),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
  }),
});

const ListingForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  console.log('inital data ', initialData);
  const defaultValues = {
    id: initialData?.id || '',
    lid: initialData?.lid || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    address: initialData.address || '',
    phone: initialData.phone || '',
    primaryCategory: initialData?.primaryCategory || {
      id: 0,
      name: '',
    },
    categories: initialData?.categories || [],
    tags: [],
    photos: initialData?.photos || [],
    review_count: initialData?.reviewCount ?? 0,
    rating: initialData?.rating ?? 0,
    hours: DAYS.map((day) => ({
      day: day.value,
      start_time:
        Object.keys(initialData?.hours ?? {}).length > 0
          ? initialData?.hours[day.value]?.open
          : '09:00',
      end_time:
        Object.keys(initialData?.hours ?? {}).length > 0
          ? initialData?.hours[day.value]?.close
          : '17:00',
    })),
    socialMedia: {
      id: initialData?.socialMedia?.id,
      instagram: initialData?.socialMedia?.instagram ?? '',
      facebook: initialData?.socialMedia?.facebook ?? '',
      tripAdvisor: initialData?.socialMedia?.tripAdvisor ?? '',
      whatsapp: initialData?.socialMedia?.whatsapp ?? '',
      google: initialData?.socialMedia?.google ?? '',
      website: initialData?.socialMedia?.website ?? '',
    },
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting: formIsSubmitting },
    setValue,
    watch,
    getValues,
  } = useForm({
    resolver: zodResolver(AddListingSchema),
    defaultValues: defaultValues,
  });
  console.log('Errors ', errors);

  const { fields: hoursFields } = useFieldArray({
    control,
    name: 'hours',
  });
  console.log('Hour fields ', hoursFields);

  const handleFormSubmit = (data) => {
    console.log('Data ', data);
    onSubmit(data);
  };

  const removeCategory = (index) => {
    const currentCategories = watch('categories') || [];
    setValue(
      'categories',
      currentCategories.filter((_, i) => i !== index)
    );
  };

  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = watch('tags') || [];
      if (!currentTags.includes(newTag.trim())) {
        setValue('tags', [...currentTags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    const currentTags = watch('tags') || [];
    setValue(
      'tags',
      currentTags.filter((_, i) => i !== index)
    );
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPreviewImage({
      file,
      preview: URL.createObjectURL(file),
    });
    console.log('field values ', getValues());
    try {
      setUploadingPhoto(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `listings/${fileName}`;

      const { data, error } = await supabase.storage
        .from('vidapuntacna-listing')
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('vidapuntacna-listing').getPublicUrl(filePath);

      const currentPhotos = watch('photos') || [];
      setValue('photos', [...currentPhotos, publicUrl]);

      setPreviewImage(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const cancelPreview = () => {
    setPreviewImage(null);
  };

  const removePhoto = (index) => {
    const currentPhotos = watch('photos') || [];
    setValue(
      'photos',
      currentPhotos.filter((_, i) => i !== index)
    );
  };

  const ErrorMessage = ({ name }) => {
    return errors[name] ? (
      <p className='error-message'>{errors[name]?.message}</p>
    ) : null;
  };

  const getCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handlePrimaryCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value, 10);

    if (categoryId) {
      const selectedCategory = categories.find((cat) => cat.id === categoryId);
      if (selectedCategory) {
        setValue('primaryCategory', selectedCategory);
      }
    } else {
      setValue('primaryCategory', { id: 0, name: '' });
    }
  };

  const handleAddCategory = () => {
    if (selectedCategoryId) {
      const categoryId = parseInt(selectedCategoryId, 10);
      const selectedCategory = categories.find((cat) => cat.id === categoryId);

      if (selectedCategory) {
        const currentCategories = watch('categories') || [];
        const categoryExists = currentCategories.some(
          (cat) => cat.id === selectedCategory.id
        );

        if (!categoryExists) {
          setValue('categories', [...currentCategories, selectedCategory]);
        }

        setSelectedCategoryId('');
      }
    }
  };

  const watchedCategories = watch('categories') || [];
  const watchedTags = watch('tags') || [];
  const watchedPhotos = watch('photos') || [];
  const watchedPrimaryCategory = watch('primaryCategory');

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='listing-form'>
        {isSubmitting ? (
          <div className='form-loading-overlay'>
            <div className='loading-spinner'></div>
          </div>
        ) : null}

        <div className='form-field'>
          <label className='form-label'>Title *</label>
          <input
            {...register('title')}
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            placeholder='Listing title'
          />
          {errors.title && (
            <p className='error-message'>{errors.title.message}</p>
          )}
        </div>

        <div className='form-field'>
          <label className='form-label'>Description *</label>
          <textarea
            {...register('description')}
            rows={4}
            className={`form-textarea ${
              errors.description ? 'input-error' : ''
            }`}
            placeholder='Description of the listing'
          />
          {errors.description && (
            <p className='error-message'>{errors.description.message}</p>
          )}
        </div>

        <div className='form-row'>
          <div className='form-field'>
            <label className='form-label'>
              <div className='label-with-icon'>
                <FiMapPin className='icon' />
                Address *
              </div>
            </label>
            <input
              {...register('address')}
              className={`form-input ${errors?.address ? 'input-error' : ''}`}
              placeholder='Physical address'
            />
            {errors.address && (
              <p className='error-message'>{errors.address.message}</p>
            )}
          </div>
        </div>
        <div className='form-row'>
          <div className='form-field'>
            <label className='form-label'>
              <div className='label-with-icon'>
                <FiPhone className='icon' />
                Phone Number *
              </div>
            </label>
            <input
              {...register('phone')}
              className={`form-input ${errors.phone ? 'input-error' : ''}`}
              placeholder='Contact phone'
            />
            {errors.phone && (
              <p className='error-message'>{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Primary Category */}
        <div className='form-field'>
          <label className='form-label'>Primary Category *</label>
          <select
            value={
              watchedPrimaryCategory?.id || initialData?.primary_category?.id
            }
            onChange={handlePrimaryCategoryChange}
            className={`form-select input-with-select ${
              errors.primaryCategory ? 'input-error' : ''
            }`}
          >
            <option value=''>Select primary category</option>
            {categories?.map((category) => (
              <option key={category?.id} value={category?.id}>
                {category?.name}
              </option>
            ))}
          </select>
          {errors.primaryCategory && (
            <p className='error-message'>{errors.primaryCategory.message}</p>
          )}
        </div>

        {/* Additional Categories */}
        <div className='form-field'>
          <label className='form-label'>Additional Categories</label>
          <div className='tag-container'>
            {watchedCategories.map((category, index) => (
              <div key={index} className='category-tag'>
                <span>{category.name}</span>
                <button
                  type='button'
                  onClick={() => removeCategory(index)}
                  className='tag-remove-button'
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className='input-with-button'>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className='form-select-addon input-with-select'
            >
              <option value=''>Select a category</option>
              {categories
                .filter((cat) => {
                  const primaryCat = watch('primaryCategory');
                  const existingCats = watch('categories') || [];
                  return (
                    cat.id !== primaryCat?.id &&
                    !existingCats.some((existing) => existing.id === cat.id)
                  );
                })
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <button
              type='button'
              onClick={handleAddCategory}
              disabled={!selectedCategoryId}
              className='add-button blue-button'
            >
              <AiOutlinePlus size={20} />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className='form-field'>
          <label className='form-label'>Tags</label>
          <div className='tag-container'>
            {watchedTags.map((tag, index) => (
              <div key={index} className='tag'>
                <span>{tag}</span>
                <button
                  type='button'
                  onClick={() => removeTag(index)}
                  className='tag-remove-button'
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className='input-with-button'>
            <input
              type='text'
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className='form-input-addon'
              placeholder='Add a tag'
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addTag())
              }
            />
            <button
              type='button'
              onClick={addTag}
              className='add-button gray-button'
            >
              <AiOutlinePlus size={20} />
            </button>
          </div>
        </div>

        {/* Photos */}
        <div className='form-field'>
          <label className='form-label'>Photos</label>
          <div className='photos-grid'>
            {watchedPhotos.map((photo, index) => (
              <div key={index} className='photo-container'>
                <img
                  src={typeof photo === 'string' ? photo : photo?.url}
                  alt={`Listing photo ${index + 1}`}
                  className='photo'
                  onError={(e) => {
                    console.log('e', e);
                    e.target.onerror = null;
                    // e.target.src = '/api/placeholder/300/200';
                  }}
                />
                <button
                  type='button'
                  onClick={() => removePhoto(index)}
                  className='photo-remove-button'
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}

            {/* Preview Image */}
            {previewImage && (
              <div className='photo-container'>
                <img
                  src={previewImage.preview}
                  alt='Upload preview'
                  className='photo'
                />
                <button
                  type='button'
                  onClick={cancelPreview}
                  className='photo-remove-button'
                >
                  <FiX size={14} />
                </button>
                {uploadingPhoto && (
                  <div className='upload-spinner-overlay'>
                    <div className='spinner'></div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='input-with-button'>
            <input
              type='file'
              accept='image/*'
              onChange={handlePhotoUpload}
              className='form-input-addon'
              disabled={uploadingPhoto}
            />
          </div>
        </div>

        {/* Hours */}
        <div className='form-field'>
          <label className='form-label'>
            <div className='label-with-icon'>
              <FiClock className='icon' />
              Business Hours *
            </div>
          </label>
          <div className='hours-container'>
            <div className='hours-list'>
              {hoursFields.map((field, index) => (
                <div key={field.id} className='hours-row'>
                  <div className='day-label'>
                    {DAYS.find((day) => day.value === field.day)?.label}
                  </div>

                  <div className='time-inputs-compact'>
                    <Controller
                      control={control}
                      name={`hours.${index}.start_time`}
                      render={({ field }) => (
                        <input {...field} type='time' className='time-input' />
                      )}
                    />
                    <span className='time-separator'>to</span>
                    <Controller
                      control={control}
                      name={`hours.${index}.end_time`}
                      render={({ field }) => (
                        <input {...field} type='time' className='time-input' />
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {errors.hours && (
            <p className='error-message'>Business hours are required</p>
          )}
        </div>

        {/* Ratings and Reviews */}
        <div className='form-row'>
          <div className='form-field'>
            <label className='form-label'>Rating (0-5)</label>
            <Controller
              control={control}
              name='rating'
              render={({ field }) => (
                <input
                  {...field}
                  type='number'
                  step='0.1'
                  min='0'
                  max='5'
                  className='form-input'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.rating && (
              <p className='error-message'>{errors.rating.message}</p>
            )}
          </div>

          <div className='form-field'>
            <label className='form-label'>Review Count</label>
            <Controller
              control={control}
              name='review_count'
              render={({ field }) => (
                <input
                  {...field}
                  type='number'
                  min='0'
                  className='form-input'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.review_count && (
              <p className='error-message'>{errors.review_count.message}</p>
            )}
          </div>
        </div>

        {/* Social Media Section */}
        <div className='social-media-section'>
          <h3 className='section-title'>Social Media & Links</h3>
          <div className='social-media-grid'>
            <div className='social-column'>
              {/* Website */}
              <div className='form-field'>
                <label className='form-label'>
                  <div className='label-with-icon'>
                    <FiGlobe className='icon' />
                    Website
                  </div>
                </label>
                <input
                  {...register('socialMedia.website')}
                  className='form-input'
                  placeholder='https://example.com'
                />
                {errors.socialMedia?.website && (
                  <p className='error-message'>
                    {errors.socialMedia.website.message}
                  </p>
                )}
              </div>

              {/* Instagram */}
              <div className='form-field'>
                <label className='form-label'>
                  <div className='label-with-icon'>
                    <BsInstagram className='icon' />
                    Instagram
                  </div>
                </label>
                <input
                  {...register('socialMedia.instagram')}
                  className='form-input'
                  placeholder='https://instagram.com/username'
                />
                {errors.socialMedia?.instagram && (
                  <p className='error-message'>
                    {errors.socialMedia.instagram.message}
                  </p>
                )}
              </div>

              {/* Facebook */}
              <div className='form-field'>
                <label className='form-label'>
                  <div className='label-with-icon'>
                    <BsFacebook className='icon' />
                    Facebook
                  </div>
                </label>
                <input
                  {...register('socialMedia.facebook')}
                  className='form-input'
                  placeholder='https://facebook.com/pagename'
                />
                {errors.socialMedia?.facebook && (
                  <p className='error-message'>
                    {errors.socialMedia.facebook.message}
                  </p>
                )}
              </div>
            </div>

            <div className='social-column'>
              {/* TripAdvisor */}
              <div className='form-field'>
                <label className='form-label'>TripAdvisor</label>
                <input
                  {...register('socialMedia.tripAdvisor')}
                  className='form-input'
                  placeholder='https://tripadvisor.com/...'
                />
                {errors.socialMedia?.tripAdvisor && (
                  <p className='error-message'>
                    {errors.socialMedia.tripAdvisor.message}
                  </p>
                )}
              </div>

              {/* Google */}
              <div className='form-field'>
                <label className='form-label'>Google Business</label>
                <input
                  {...register('socialMedia.google')}
                  className='form-input'
                  placeholder='https://google.com/maps/...'
                />
                {errors.socialMedia?.google && (
                  <p className='error-message'>
                    {errors.socialMedia.google.message}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div className='form-field'>
                <label className='form-label'>WhatsApp</label>
                <input
                  {...register('socialMedia.whatsapp')}
                  className='form-input'
                  placeholder='+1234567890'
                />
                {errors.socialMedia?.whatsapp && (
                  <p className='error-message'>
                    {errors.socialMedia.whatsapp.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className='form-actions'>
          <button
            type='button'
            onClick={onCancel}
            className='cancel-button'
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='submit-button'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className='loading-spinner small'></span>
                {initialData?.lid ? 'Updating...' : 'Creating...'}
              </>
            ) : initialData?.lid ? (
              'Update Listing'
            ) : (
              'Create Listing'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListingForm;
