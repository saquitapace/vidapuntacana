'use server';
import { query } from '@/src/lib/db';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createOrUpdateUser, getUserByClerkId } from './user.action';

export const createEvent = async (eventData) => {
  const { userId } = auth();
  if (!userId) {
    return { err: 'Unauthorized', data: null };
  }

  const {
    title,
    description,
    start_date,
    end_date,
    type,
    status,
    location,
    theme_color,
  } = eventData;

  if (
    !title ||
    !description ||
    !start_date ||
    !end_date ||
    !type ||
    !status ||
    !location
  ) {
    return { err: 'All fields are required', data: null };
  }

  const fields = [
    'user_id',
    'title',
    'description',
    'location',
    'start_date',
    'end_date',
    'type',
    'status',
  ];
  const values = [
    userId,
    title,
    description,
    location,
    new Date(start_date),
    new Date(end_date),
    type,
    status,
  ];

  if (theme_color) {
    fields.push('theme_color');
    values.push(theme_color);
  }

  const sql = `
    INSERT INTO events (${fields.join(', ')})
    VALUES (${fields.map(() => '?').join(', ')})
  `;

  try {
    const dbUser = await getUserByClerkId(userId);
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
    await query(sql, values);
    console.log('created event');
    return {
      err: null,
      data: { message: 'Event created successfully', event: eventData },
    };
  } catch (error) {
    console.log('Error creating event', error);
    return { err: 'Something went wrong', data: null };
  }
};

export const getPreviewEvents = async () => {
  const sql = 'SELECT id,title,start_date,end_Date,theme_color FROM events';
  try {
    const events = await query(sql);
    console.log('__events', events);
    return {
      err: null,
      data: events,
    };
  } catch (error) {
    return { err: 'Something went wrong', data: null };
  }
};

export const getAllEvents = async () => {
  const sql = `SELECT e.*, u.first_name, u.last_name FROM events e
      LEFT JOIN users u ON e.user_id = u.clerk_id`;
      const events = await query(sql);
      return  events.map((e) => ({
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

}