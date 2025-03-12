'use server';
import { getConnection, query } from '@/src/lib/db';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

const AddListingSchema = z.object({
  id: z.union([z.number(), z.string()]).optional().nullable(),
  lid: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
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
export async function addListing(listingData) {
  try {
    const validatedData = AddListingSchema.parse(listingData);

    const lid = uuidv4();

    const conn = await getConnection();
    console.log(
      'validatedData.primaryCategory?.id',
      validatedData.primaryCategory?.id
    );
    try {
      //
      await conn.beginTransaction();
      console.log('jere');

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

export async function updateListing(listingData) {
  try {
    console.log('listingData', listingData);
    const validatedData = AddListingSchema.parse(listingData);
    const { lid } = validatedData;
    console.log();
    const conn = await getConnection();

    try {
      await conn.beginTransaction();
      console.log(
        '          validatedData.primaryCategory?.id,',
        validatedData.primaryCategory?.id
      );
      // 1. Update main listing information
      await conn.execute(
        `UPDATE listing 
         SET title = ?, description = ?, address = ?, phone = ?, 
             google_review_count = ?, google_rating = ?, primary_category = ?
         WHERE lid = ?`,
        [
          validatedData.title,
          validatedData.description,
          validatedData.address,
          validatedData.phone,
          validatedData.review_count,
          validatedData.rating,
          validatedData.primaryCategory?.id,
          lid,
        ]
      );

      // 2. Update categories - delete old ones and insert new ones
      await conn.execute(`DELETE FROM listing_category WHERE listing_id = ?`, [
        lid,
      ]);

      for (const category of validatedData?.categories) {
        await conn.execute(
          `INSERT INTO listing_category (listing_id, category_id) VALUES (?, ?)`,
          [lid, category.id]
        );
      }

      // 3. Update photos - delete old ones and insert new ones
      if (validatedData?.photos) {
        await conn.execute(`DELETE FROM photos WHERE lid = ?`, [lid]);

        for (const photoUrl of validatedData.photos) {
          const url =
            typeof photoUrl === 'string'
              ? photoUrl
              : photoUrl?.url ?? '/default.png';
          await conn.execute(`INSERT INTO photos (lid, url) VALUES (?, ?)`, [
            lid,
            url,
          ]);
        }
      }

      // 4. Update hours - delete old ones and insert new ones
      if (validatedData?.hours) {
        await conn.execute(`DELETE FROM hours WHERE lid = ?`, [lid]);

        for (const hour of validatedData.hours) {
          await conn.execute(
            `INSERT INTO hours (lid, day, start_time, end_time) VALUES (?, ?, ?, ?)`,
            [lid, hour.day, hour.start_time, hour.end_time]
          );
        }
      }

      console.log('here5');
      // 5. Update social media - check if exists first, then update or insert
      const socialMedia = validatedData?.socialMedia;
      if (socialMedia) {
        // Check if social media entry exists for this listing
        const [existingSocialMedia] = await conn.execute(
          `SELECT * FROM social_media WHERE lid = ?`,
          [lid]
        );

        if (existingSocialMedia.length > 0) {
          // Update existing social media entry
          await conn.execute(
            `UPDATE social_media 
             SET instagram = ?, facebook = ?, trip_advisor = ?, 
                 whatsapp = ?, google = ?, website = ?
             WHERE lid = ?`,
            [
              socialMedia?.instagram || null,
              socialMedia?.facebook || null,
              socialMedia?.tripAdvisor || null,
              socialMedia?.whatsapp || null,
              socialMedia?.google || null,
              socialMedia?.website || null,
              lid,
            ]
          );
        } else {
          // Create new social media entry
          await conn.execute(
            `INSERT INTO social_media (
              lid, instagram, facebook, trip_advisor, whatsapp, google, website
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              lid,
              socialMedia?.instagram || null,
              socialMedia?.facebook || null,
              socialMedia?.tripAdvisor || null,
              socialMedia?.whatsapp || null,
              socialMedia?.google || null,
              socialMedia?.website || null,
            ]
          );
        }
      }
      console.log('here_after_5');

      await conn.commit();
      return { success: true, lid, message: 'Listing updated successfully' };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
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
      message: 'Failed to update listing',
      error: error.message,
    };
  }
}

export async function getListingDetails(lid) {
  try {
    const listingSql = `
      SELECT l.*, 
             sm.id as social_media_id, 
             sm.instagram, sm.facebook, sm.trip_advisor, sm.whatsapp, sm.google, sm.website
      FROM listing l
      LEFT JOIN social_media sm ON l.lid = sm.lid
      WHERE l.lid = ?
    `;
    const [listing] = await query(listingSql, [lid]);

    if (!listing) {
      return { error: 'Listing not found', status: 404 };
    }

    const categoriesSql = `
      SELECT c.id, c.name, lc.id as listing_category_id 
      FROM category c
      JOIN listing_category lc ON c.id = lc.category_id
      WHERE lc.listing_id = ?
    `;

    const tagsSql = `
      SELECT t.id, t.name, lt.id as listing_tag_id 
      FROM tags t
      JOIN listing_tags lt ON t.id = lt.tag_id
      WHERE lt.listing_id = ?
    `;

    const photosSql = `
      SELECT id, url, lid
      FROM photos
      WHERE lid = ?
    `;

    const hoursSql = `
      SELECT id, lid, day, start_time, end_time
      FROM hours
      WHERE lid = ?
    `;

    const primaryCategorySql = `
      SELECT c.id, c.name
      FROM category c
      JOIN listing l ON l.primary_category = c.id
      WHERE l.lid = ?
    `;

    const [categories, tags, photos, hoursData, primaryCategory] =
      await Promise.all([
        query(categoriesSql, [lid]),
        query(tagsSql, [lid]),
        query(photosSql, [lid]),
        query(hoursSql, [lid]),
        query(primaryCategorySql, [lid]),
      ]);

    const formatTimeString = (timeStr) => {
      if (!timeStr) return null;
      const parts = timeStr.split(':');
      return `${parts[0]}:${parts[1]}`;
    };

    const dayMapping = {
      monday: '1',
      tuesday: '2',
      wednesday: '3',
      thursday: '4',
      friday: '5',
      saturday: '6',
      sunday: '7',
    };

    const currentDay = new Date()
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();
    const currentDayNumber = dayMapping[currentDay];

    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const isOpenNow = (openTime, closeTime, currentTime) => {
      if (!openTime || !closeTime || !currentTime) return false;

      let currentMinutes = timeToMinutes(currentTime);
      let openMinutes = timeToMinutes(openTime);
      let closeMinutes = timeToMinutes(closeTime);

      if (closeMinutes < openMinutes) {
        closeMinutes += 24 * 60;
        if (currentMinutes < openMinutes) {
          currentMinutes += 24 * 60;
        }
      }

      return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    };

    const processedHours = {};
    hoursData.forEach((hour) => {
      processedHours[hour.day] = {
        id: hour.id,
        open: formatTimeString(hour.start_time),
        close: formatTimeString(hour.end_time),
      };
    });

    let status = 'closed';
    if (processedHours[currentDayNumber]) {
      const { open, close } = processedHours[currentDayNumber];
      if (open && close && isOpenNow(open, close, currentTime)) {
        status = 'open';
      }
    }

    return {
      data: {
        id: listing.id,
        lid: listing.lid,
        title: listing.title,
        description: listing.description,
        name: listing.name,
        address: listing.address,
        phone: listing.phone,
        primaryCategory:
          primaryCategory.length > 0
            ? {
                id: primaryCategory[0]?.id,
                name: primaryCategory[0]?.name,
                listing_category_id: primaryCategory[0]?.listing_category_id,
              }
            : null,
        categories: categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          listing_category_id: cat.listing_category_id,
        })),
        tags: tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          listing_tag_id: tag.listing_tag_id,
        })),
        photos: photos.map((photo) => ({
          id: photo.id,
          url: photo.url,
        })),
        reviewCount: Number(listing?.google_review_count || 0),
        rating: Number(listing?.google_rating || 0),
        hours: processedHours,
        status,
        socialMedia: {
          id: listing.social_media_id,
          instagram: listing.instagram,
          facebook: listing.facebook,
          tripAdvisor: listing.trip_advisor,
          whatsapp: listing.whatsapp,
          google: listing.google,
          website: listing.website,
        },
      },
      status: 200,
    };
  } catch (error) {
    console.error('Error fetching listing:', error);
    return { error: 'Internal Server Error', status: 500 };
  }
}
