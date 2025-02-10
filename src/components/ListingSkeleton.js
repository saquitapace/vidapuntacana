const ListingSkeleton = () => {
  return (
    <div className="listing-item listing-grid-item-two mb-30">
      <div className="listing-thumbnail">
        <div className="animate-pulse bg-gray-200 h-[200px] w-full"></div>
      </div>
      <div className="listing-content">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ListingSkeleton; 