import { query } from '@/src/lib/db';
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { lid } = params;

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
      return new Response(JSON.stringify({ error: 'Listing not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
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
    // Execute queries in parallel
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

    // const primaryCategory =
    //   categories.find((cat) => cat.id === listing.primary_category) || null;
    console.log('primaryCategory', primaryCategory);
    return new Response(
      JSON.stringify({
        id: listing.id,
        lid: listing.lid,
        title: listing.title,
        description: listing.description,
        name: listing.name,
        address: listing.address,
        phone: listing.phone,
        primaryCategory: primaryCategory
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
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching listing:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
