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
        closeMinutes += 24 * 60; // Add 24 hours
        if (currentMinutes < openMinutes) {
          currentMinutes += 24 * 60;
        }
      }

      return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    };

    const parseHours = (hoursString) => {
      if (!hoursString) return {};

      return hoursString.split(',').reduce((acc, timeSlot) => {
        if (!timeSlot) return acc;

        const [day, timeRange] = timeSlot.split(':', 2);
        if (!timeRange) return acc;

        const fullTimeRange = timeSlot.substring(timeSlot.indexOf(':') + 1);
        const [openTime, closeTime] = fullTimeRange
          .split('-')
          .map((time) => time.trim());

        acc[day] = {
          open: formatTimeString(openTime),
          close: formatTimeString(closeTime),
        };

        return acc;
      }, {});
    };

    return new Response(
      JSON.stringify(
        featuredListings?.map((listing) => {
          const hours = parseHours(listing?.hours);

          let status = 'closed';
          if (hours[currentDayNumber]) {
            const { open, close } = hours[currentDayNumber];
            if (open && close && isOpenNow(open, close, currentTime)) {
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
            categories: listing?.categories?.split(',').filter(Boolean) || [],
            tags: listing?.tags?.split(',').filter(Boolean) || [],
            photos: listing?.photos?.split(',').filter(Boolean) || [],
            hours,
            status,
            socialMedia: {
              instagram: listing.instagram,
              facebook: listing.facebook,
              tripAdvisor: listing.trip_advisor,
              whatsapp: listing.whatsapp,
              google: listing.google,
              website: listing.website,
            },
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
      },
    });
  }
}
