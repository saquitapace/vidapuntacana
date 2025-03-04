import { query } from '@/src/lib/db';

export async function GET(req) {
  const sql = 'select * from listing';
  const listings = await query(sql);
  return new Response(JSON.stringify(listings), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
