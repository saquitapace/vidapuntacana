import { getPreviewEvents } from '@/app/actions/event.action';

export async function GET(req) {
  try {
    const data = await getPreviewEvents();
    if (data?.err) {
      throw new Error('Something went wrong');
    }
    return new Response(JSON.stringify(data?.data ?? []), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ err: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
