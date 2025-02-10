import { query } from '@/src/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') || 6;
    const page = searchParams.get('page') || 1;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT 
        l.id, l.lid, l.title, l.address, l.phone, 
        GROUP_CONCAT(DISTINCT c.name) as categories,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT p.url) as photos,
        sm.instagram, sm.facebook, sm.trip_advisor, sm.whatsapp, sm.google, sm.website
      FROM listing l
      LEFT JOIN listing_category lc ON l.lid = lc.listing_id
      LEFT JOIN category c ON lc.category_id = c.id
      LEFT JOIN listing_tags lt ON l.lid = lt.listing_id
      LEFT JOIN tags t ON lt.tag_id = t.id
      LEFT JOIN photos p ON l.lid = p.lid
      LEFT JOIN social_media sm ON l.lid = sm.lid
    `;

    const whereConditions = [];
    const queryParams = [];

    if (category) {
      whereConditions.push('c.name = ?');
      queryParams.push(category);
    }

    if (tag) {
      whereConditions.push('t.name = ?');
      queryParams.push(tag);
    }

    if (search) {
      whereConditions.push('(l.ttle LIKE ? OR l.address LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (whereConditions.length > 0) {
      sql += ' WHERE ' + whereConditions.join(' AND ');
    }

    sql += ' GROUP BY l.id, l.lid, l.title, l.address, l.phone, sm.instagram, sm.facebook, sm.trip_advisor, sm.whatsapp, sm.google, sm.website ORDER BY l.id LIMIT 6';
    // todo add pagination
    // queryParams.push(Number(limit), Number(offset));
    // console.log('qyer params ' , queryParams);
    const listings = await query(sql, queryParams);

    return new Response(
      JSON.stringify(
        listings.map(listing => ({
          id: listing.id,
          lid: listing.lid,
          title: listing.title,
          address: listing.address,
          phone: listing.phone,
          categories: listing.categories?.split(',') || [],
          tags: listing.tags?.split(',') || [],
          photos: listing.photos?.split(',') || [],
          socialMedia: {
            instagram: listing.instagram,
            facebook: listing.facebook,
            tripAdvisor: listing.trip_advisor,
            whatsapp: listing.whatsapp,
            google: listing.google,
            website: listing.website
          }
        }))
      ),
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
      }
    });
  }
}