import { query } from '@/src/lib/db';

export async function GET(req, { params }) {
  try {
    const { lid } = params;

    const sql = `
      SELECT 
        l.*,
        GROUP_CONCAT(DISTINCT c.name) as categories,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT p.url) as photos,
        sm.instagram, sm.facebook, sm.trip_advisor, sm.whatsapp, sm.google, sm.website,
        GROUP_CONCAT(DISTINCT CONCAT(h.day, ':', h.start_time, '-', h.end_time)) as hours
      FROM listing l
      LEFT JOIN listing_category lc ON l.id = lc.listing_id
      LEFT JOIN category c ON lc.category_id = c.id
      LEFT JOIN listing_tags lt ON l.id = lt.listing_id
      LEFT JOIN tags t ON lt.tag_id = t.id
      LEFT JOIN photos p ON l.lid = p.lid
      LEFT JOIN social_media sm ON l.lid = sm.lid
      LEFT JOIN hours h ON l.lid = h.lid
      WHERE l.lid = ?
      GROUP BY l.id
    `;

    const [listing] = await query(sql, [lid]);

    if (!listing) {
      return new Response(JSON.stringify({ error: 'Listing not found' }), { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    // Parse hours into a structured format
    const hoursArray = listing.hours?.split(',') || [];
    const structuredHours = hoursArray.reduce((acc, hour) => {
      const [day, time] = hour.split(':');
      const [start, end] = time.split('-');
      acc[day] = { start, end };
      return acc;
    }, {});

    return new Response(
      JSON.stringify({
        id: listing.id,
        lid: listing.lid,
        name: listing.name,
        address: listing.address,
        phone: listing.phone,
        categories: listing.categories?.split(',') || [],
        tags: listing.tags?.split(',') || [],
        photos: listing.photos?.split(',') || [],
        hours: structuredHours,
        socialMedia: {
          instagram: listing.instagram,
          facebook: listing.facebook,
          tripAdvisor: listing.trip_advisor,
          whatsapp: listing.whatsapp,
          google: listing.google,
          website: listing.website
        }
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
      }
    });
  }
} 