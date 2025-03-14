import {
  deleteListingById,
  getListingDetails,
} from '@/app/actions/listing.action';

export async function GET(req, { params }) {
  try {
    const { lid } = params;
    if (!lid) {
      return new Response(JSON.stringify({ error: 'lid is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const result = await getListingDetails(lid);

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: result.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { lid } = params;
    if (!lid) {
      return new Response(JSON.stringify({ error: 'lid is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const result = await deleteListingById(lid);
    console.log('result', result);
    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: result.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      message: 'Listing deleted successfully',
      data: result?.data || null 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
