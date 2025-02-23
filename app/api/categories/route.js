import mysql from 'mysql2/promise';
import { query } from '@/src/lib/db';

export async function GET(req) {
  try {
    const sql = 'SELECT id, name FROM category';
    const categories = await query(sql);
    
    return new Response(
      JSON.stringify(categories),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}