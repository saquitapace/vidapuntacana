import {
  createOrUpdateUser,
  getUserByClerkId,
} from '@/app/actions/user.action';
import { query } from '@/src/lib/db';
import { CalendarViewTypes } from '@/src/utils/types';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const viewType =
      searchParams.get('viewType') || CalendarViewTypes.MONTH_VIEW;
    const currentDate = new Date();
    const date = searchParams.get('date')
      ? new Date(searchParams.get('date'))
      : currentDate;
    let startDate, endDate;

    switch (viewType) {
      case CalendarViewTypes.DAY_VIEW:
        startDate = startOfDay(date);
        endDate = endOfDay(date);
        break;
      case CalendarViewTypes.WEEK_VIEW:
        startDate = startOfWeek(date);
        endDate = endOfWeek(date);
        break;
      case CalendarViewTypes.MONTH_VIEW:
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
        break;
      default:
        startDate = startOfDay(date);
        endDate = endOfDay(date);
    }

    const sql = `
      SELECT e.*, u.first_name, u.last_name FROM events e
      LEFT JOIN users u ON e.user_id = u.clerk_id
      WHERE (e.start_date >=? and e.end_date <= ?) 
      ORDER BY e.start_date ASC
    `;

    console.log('Query params:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const events = await query(sql, [startDate, endDate]);

    console.log('Found events:', events.length);

    return new Response(
      JSON.stringify(
        events.map((e) => ({
          id: e.id,
          startDate: e.start_date,
          endDate: e.end_date,
          title: e.title,
          description: e.description,
          type: e.type,
          status: e.status,
          location: e.location,
          themeColor: e?.theme_color,
          eventCreator: {
            firstName: e?.first_name,
            lastName: e?.last_name,
            displayName: e?.first_name + ' ' + e?.last_name,
          },
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
    console.error('Error fetching events:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const eventData = await req.json();
    const {
      title,
      description,
      start_date,
      end_date,
      type,
      status,
      themeColor = 0,
    } = eventData;

    const sql = `
      INSERT INTO events (user_id, title, description, start_date, end_date, type, status, theme_color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const dbUser = await getUserByClerkId(userId);
    console.log('dbUser ', dbUser);
    if (!dbUser) {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return { err: 'User not found', data: null };
      }

      await createOrUpdateUser({
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
      });
    }
    const result = await query(sql, [
      userId,
      title,
      description,
      new Date(start_date),
      new Date(end_date),
      type,
      status,
      themeColor,
    ]);

    return new Response(JSON.stringify({ id: result.insertId, ...eventData }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const eventData = await req.json();
    const { id, title, description, start_date, end_date, type, status } =
      eventData;

    const sql = `
      UPDATE events 
      SET title = ?, description = ?, start_date = ?, end_date = ?, type = ?, status = ?
      WHERE id = ? AND user_id = ?
    `;

    await query(sql, [
      title,
      description,
      new Date(start_date),
      new Date(end_date),
      type,
      status,
      id,
      userId,
    ]);

    return new Response(JSON.stringify(eventData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('id');

    const sql = 'DELETE FROM events WHERE id = ? AND user_id = ?';
    await query(sql, [eventId, userId]);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
