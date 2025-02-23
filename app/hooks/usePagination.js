import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const usePagination = () => {
  const router = useRouter();
  const { query } = router;

  const [pagination, setPagination] = useState({
    page: parseInt(query?.page) || 1,
    limit: parseInt(query?.limit) || 6,
  });
  const [searchTerm, setSearchTerm] = useState(query?.search || '');

  useEffect(() => {
    const { page, limit, search } = query || {page : 1, limit : 6 , search : ''};
    if (page) setPagination(prev => ({ ...prev, page: parseInt(page) }));
    if (limit) setPagination(prev => ({ ...prev, limit: parseInt(limit) }));
    if (search) setSearchTerm(search);
  }, [query]);

  useEffect(() => {
    const { page, limit } = pagination;
    router.push({
      pathname: router.pathname,
      query: { ...query, page, limit, search: searchTerm },
    });
  }, [pagination, searchTerm]);

  return { pagination, setPagination, searchTerm, setSearchTerm };
};

export default usePagination; 