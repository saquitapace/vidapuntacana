import mysql from 'mysql2/promise';
import { query } from '@/src/lib/db';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('categoryId');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 6;
    const page = parseInt(searchParams.get('page')) || 1;
    const offset = (page - 1) * limit;

    let countSql = `
      SELECT COUNT(DISTINCT l.id) as total
      FROM listing l
      LEFT JOIN listing_category lc ON l.lid = lc.listing_id
      LEFT JOIN category c ON lc.category_id = c.id
      LEFT JOIN listing_tags lt ON l.lid = lt.listing_id
      LEFT JOIN tags t ON lt.tag_id = t.id
    `;

    const whereConditions = [];
    const queryParams = [];

    if (category) {
      whereConditions.push('lc.category_id = ?');
      queryParams.push(category);
    }

    if (tag) {
      whereConditions.push('t.name = ?');
      queryParams.push(tag);
    }

    if (Boolean(search) && search.trim()) {
      whereConditions.push(
        '(l.title LIKE ? OR l.address LIKE ? OR l.phone LIKE ? OR c.name LIKE ?)'
      );
      const searchTerm = `%${search.trim()}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (whereConditions.length > 0) {
      countSql += ' WHERE ' + whereConditions.join(' AND ');
    }

    const [totalCount] = await query(countSql, queryParams);

    let sql = `
      SELECT 
        l.id, l.lid, l.title, l.address, l.phone, l.google_review_count as review_count, l.google_rating as rating, 
        GROUP_CONCAT(DISTINCT c.name) as categories,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT p.url) as photos,
        GROUP_CONCAT(DISTINCT CONCAT(h.day, ':', h.start_time, '-', h.end_time)) as hours,
        sm.instagram, sm.facebook, sm.trip_advisor, sm.whatsapp, sm.google, sm.website
      FROM listing l
      LEFT JOIN listing_category lc ON l.lid = lc.listing_id
      LEFT JOIN category c ON lc.category_id = c.id
      LEFT JOIN listing_tags lt ON l.lid = lt.listing_id
      LEFT JOIN tags t ON lt.tag_id = t.id
      LEFT JOIN photos p ON l.lid = p.lid
      LEFT JOIN social_media sm ON l.lid = sm.lid
      LEFT JOIN hours h ON l.lid = h.lid
    `;

    if (whereConditions.length > 0) {
      sql += ' WHERE ' + whereConditions.join(' AND ');
    }

    sql += ` GROUP BY l.id, l.lid, l.title, l.address, l.phone, 
             sm.instagram, sm.facebook, sm.trip_advisor, sm.whatsapp, 
             sm.google, sm.website 
             ORDER BY l.id LIMIT ${mysql.escape(limit)} OFFSET ${mysql.escape(
      offset
    )}`;

    const listings = await query(sql, queryParams);

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
      JSON.stringify({
        listings: listings.map((listing) => {
          const hours = parseHours(listing.hours);
          let status = 'closed';
          if (hours[currentDayNumber]) {
            const { open, close } = hours[currentDayNumber];
            if (open && close && isOpenNow(open, close, currentTime)) {
              status = 'open';
            }
          }

          return {
            id: listing.id,
            lid: listing.lid,
            title: listing.title,
            address: listing.address,
            phone: listing.phone,
            categories: listing.categories?.split(',').filter(Boolean) || [],
            tags: listing.tags?.split(',').filter(Boolean) || [],
            photos: listing.photos?.split(',').filter(Boolean) || [],
            review_count: Number(listing?.review_count || 0),
            rating: Number(listing?.rating || 0),
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
        }),
        pagination: {
          total: totalCount.total,
          page,
          limit,
          totalPages: Math.ceil(totalCount.total / limit),
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
    console.error('Error fetching listings:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
