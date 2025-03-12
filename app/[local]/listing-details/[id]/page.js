import { getListingDetails } from '@/app/actions/listing.action';
import ListingDetails from '@/src/components/ListingDetails';
import { Suspense } from 'react';

const ListingDetailsPage = async ({ params }) => {
  const data = await getListingDetails(params.id);

  return (
    <Suspense fallback={<Loading />}>
      <ListingDetails
        notFound={data?.status === 404}
        listing={data?.data ?? {}}
      />
    </Suspense>
  );
};

export default ListingDetailsPage;
function Loading() {
  return (
    <div className='container py-20'>
      <div className='row'>
        <div className='col-lg-8'>
          {/* Title skeleton */}
          <div className='h-8 bg-gray-200 rounded animate-pulse mb-4 w-3/4'></div>

          {/* Image skeleton */}
          <div className='aspect-video bg-gray-200 rounded animate-pulse mb-6'></div>

          {/* Description skeletons */}
          <div className='space-y-3 mb-6'>
            <div className='h-4 bg-gray-200 rounded animate-pulse w-full'></div>
            <div className='h-4 bg-gray-200 rounded animate-pulse w-5/6'></div>
            <div className='h-4 bg-gray-200 rounded animate-pulse w-4/6'></div>
          </div>

          {/* Features skeleton */}
          <div className='grid grid-cols-3 gap-4 mb-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className='h-12 bg-gray-200 rounded animate-pulse'
              ></div>
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className='col-lg-4'>
          <div className='h-[400px] bg-gray-200 rounded animate-pulse'></div>
        </div>
      </div>
    </div>
  );
}
