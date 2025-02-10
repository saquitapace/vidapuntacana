import { query } from '@/src/lib/db';

export async function GET(req) {
  try {
    const sql = `
      SELECT 
        l.*,
        pc.name as primary_category,
        GROUP_CONCAT(DISTINCT c.name) as categories,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT p.url) as photos,
        sm.instagram, sm.facebook, sm.trip_advisor, sm.whatsapp, sm.google, sm.website,
        GROUP_CONCAT(DISTINCT CONCAT(h.day, ':', h.start_time, '-', h.end_time)) as hours
      FROM listing l
      INNER JOIN featured f ON l.lid = f.lid
      LEFT JOIN category pc ON l.primary_category = pc.id
      LEFT JOIN listing_category lc ON l.lid = lc.listing_id
      LEFT JOIN category c ON lc.category_id = c.id
      LEFT JOIN listing_tags lt ON l.id = lt.listing_id
      LEFT JOIN tags t ON lt.tag_id = t.id
      LEFT JOIN photos p ON l.lid = p.lid
      LEFT JOIN social_media sm ON l.lid = sm.lid
      LEFT JOIN hours h ON l.lid = h.lid
      WHERE f.is_featured = true
      GROUP BY l.id
      ORDER BY l.id
    `;

    const featuredListings = await query(sql);
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    return new Response(
      JSON.stringify(
        featuredListings?.map(listing => {
          const hours = listing.hours?.split(',').reduce((acc, timeSlot) => {
            const [day, times] = timeSlot.split(':');
            const [openTime, closeTime] = times.split('-');
            acc[day] = { open: openTime, close: closeTime };
            return acc;
          }, {}) || {};

          let status = 'closed';
          if (hours[currentDay]) {
            const { open, close } = hours[currentDay];
            if (currentTime >= open && currentTime <= close) {
              status = 'open';
            }
          }

          return {
            id: listing?.id,
            lid: listing?.lid,
            title: listing?.title,
            address: listing?.address,
            phone: listing?.phone,
            primaryCategory: listing?.primary_category,
            categories: listing?.categories?.split(',') || [],
            tags: listing?.tags?.split(',') || [],
            photos: listing?.photos?.split(',') || [],
            hours,
            status,
            socialMedia: {
              instagram: listing.instagram,
              facebook: listing.facebook,
              tripAdvisor: listing.trip_advisor,
              whatsapp: listing.whatsapp,
              google: listing.google,
              website: listing.website
            }
          };
        }) ?? []
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching featured listings:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
} 