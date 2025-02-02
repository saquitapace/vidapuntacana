import { createOrUpdateUser } from '@/app/actions/user.action';
import { auth } from '@clerk/nextjs';

export async function POST(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userData = await req.json();
    const { email, clerkId, ...fields } = userData;

    if (!email || !clerkId) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Create or update user in database
    const user = await createOrUpdateUser({
      email,
      clerkId,
      ...fields,
    });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in user API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const updates = await req.json();
    const user = await updateUser(userId, updates);

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in user API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
