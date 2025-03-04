'use server';
import { getConnection } from '@/src/lib/db';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

const AddListingSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  primaryCategory: z.object({
    id: z.number(),
    name: z.string(),
  }),
  categories: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  tags: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
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
    instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
    facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
    tripAdvisor: z.string().url('Invalid URL').optional().or(z.literal('')),
    whatsapp: z.string().optional().or(z.literal('')),
    google: z.string().url('Invalid URL').optional().or(z.literal('')),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
  }),
});
export async function addListing(listingData) {
  try {
    // Validate the data
    const validatedData = AddListingSchema.parse(listingData);

    const lid = uuidv4();

    const conn = await getConnection();

    try {
      // Start a transaction
      await conn.beginTransaction();
      console.log('jere');
      // 1. Insert into listing table
      const [listingResult] = await conn.execute(
        `INSERT INTO listing (
          lid, title, description, address, phone, 
          google_review_count, google_rating,primary_category
        ) VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
        [
          lid,
          validatedData.title,
          validatedData.description,
          validatedData.address,
          validatedData.phone,
          validatedData.review_count,
          validatedData.rating,
          validatedData.primaryCategory?.id,
        ]
      );

      // 2. Insert additional categories
      for (const category of validatedData.categories) {
        await conn.execute(
          `INSERT INTO listing_category (listing_id, category_id) VALUES (?, ?)`,
          [lid, category.id]
        );
      }
      //   lets skip tag for now
      //   // 4. Insert tags - note the change from tag objects to tag strings
      //   if (validatedData.tags && validatedData.tags.length > 0) {
      //     for (const tagName of validatedData.tags) {
      //       // First check if tag exists, if not create it
      //       let tagId;
      //       const [existingTags] = await conn.execute(
      //         `SELECT id FROM tags WHERE name = ?`,
      //         [tagName]
      //       );

      //       if (existingTags.length > 0) {
      //         tagId = existingTags[0].id;
      //       } else {
      //         // Create new tag
      //         const [newTag] = await conn.execute(
      //           `INSERT INTO tags (name) VALUES (?)`,
      //           [tagName]
      //         );
      //         tagId = newTag.insertId;
      //       }

      //       // Now link the tag to the listing
      //       await conn.execute(
      //         `INSERT INTO listing_tags (listing_id, tag_id) VALUES (?, ?)`,
      //         [lid, tagId]
      //       );
      //     }
      //   }

      // 5. Insert photos
      if (validatedData?.photos && validatedData.photos.length > 0) {
        for (const photoUrl of validatedData.photos) {
          await conn.execute(`INSERT INTO photos (lid, url) VALUES (?, ?)`, [
            lid,
            photoUrl,
          ]);
        }
      }

      // 6. Insert hours
      for (const hour of validatedData?.hours) {
        await conn.execute(
          `INSERT INTO hours (lid, day, start_time, end_time) VALUES (?, ?, ?, ?)`,
          [lid, hour.day, hour.start_time, hour.end_time]
        );
      }
      const socialMedia = validatedData?.socialMedia;
      const hasSocialMedia =
        socialMedia?.instagram ||
        socialMedia?.facebook ||
        socialMedia?.tripAdvisor ||
        socialMedia?.whatsapp ||
        socialMedia?.google ||
        socialMedia?.website;
      // 7. Insert social media
      if (hasSocialMedia) {
        await conn.execute(
          `INSERT INTO social_media (
              lid, instagram, facebook, trip_advisor, whatsapp, google, website
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            lid,
            validatedData.socialMedia.instagram || null,
            validatedData.socialMedia.facebook || null,
            validatedData.socialMedia.tripAdvisor || null,
            validatedData.socialMedia.whatsapp || null,
            validatedData.socialMedia.google || null,
            validatedData.socialMedia.website || null,
          ]
        );
      }

      await conn.commit();
      console.log('Here2');
      return { success: true, lid, message: 'Listing added successfully' };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      // Close connection
      await conn.release();
    }
  } catch (error) {
    console.log('Error:', error);
    if (error.name === 'ZodError') {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      };
    }

    return {
      success: false,
      message: 'Failed to add listing',
      error: error.message,
    };
  }
}
