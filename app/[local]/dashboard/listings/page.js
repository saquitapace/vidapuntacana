'use client';

import { addListing } from '@/app/actions/listing.action';
import DataTable from '@/src/components/DataTable';
import Drawer from '@/src/components/Drawer';
import ListingForm from '@/src/forms/AddListing';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNotifications } from 'reapop';
import '../styles.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const { notify } = useNotifications();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [listingsRes, categoriesRes] = await Promise.all([
        fetch('/api/listings/preview'),
        fetch('/api/categories'),
      ]);

      const listingsData = await listingsRes.json();
      const categoriesData = await categoriesRes.json();

      setListings(listingsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      notify('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data) => {
    try {
      console.log('submitting ');
      const { error, ...res } = await addListing(data);
      console.log('res', error, res);
      if (!error) {
        setIsDrawerOpen(false);
        fetchData();
        notify('Listing Added!', 'success', {
          position: 'top-center',
          dismissAfter: 3000,
        });
      }
    } catch (error) {
      console.error('Error adding listing:', error);
      notify(
        typeof error === 'string'
          ? error
          : error?.message ?? 'Something went wrong',
        'error',
        {
          position: 'top-center',
          dismissAfter: 3000,
        }
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      // For now, we'll just filter the listings
      setListings(listings.filter((listing) => listing.id !== id));
      notify('Listing deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting listing:', error);
      notify('Failed to delete listing', 'error');
    }
  };

  const getCategoryName = useMemo(() => {
    return (categoryId) => {
      return (
        categories?.find((cat) => cat?.id === categoryId)?.name || 'Unknown'
      );
    };
  }, [categories]);

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
      },
      {
        header: 'Category',
        accessorFn: (row) => getCategoryName(row?.primary_category),
      },
      {
        header: 'Phone',
        accessorFn: (row) => `${row?.phone || 'N/A'}`,
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='table-actions'>
            <button
              onClick={() => handleDelete(row.original.id)}
              className='action-button-small red'
            >
              <FiTrash2 size={18} />
            </button>
            <button
              onClick={async () => {
                try {
                  setIsEditLoading(true);
                  const res = await fetch(`/api/listings/${row.original.lid}`);
                  const data = await res.json();
                  console.log('__data ', data);
                  setSelectedListing(data);
                  setIsDrawerOpen(true);
                } catch (error) {
                  console.log('error ', error);
                  notify('Failed to fetch listing data', 'error');
                } finally {
                  setIsEditLoading(false);
                }
              }}
              className='action-button-small blue'
              disabled={isEditLoading}
            >
              {isEditLoading ? (
                <span className='loading-spinner'></span>
              ) : (
                <FiEdit size={18} />
              )}
            </button>
          </div>
        ),
      },
    ],
    [getCategoryName, isEditLoading]
  );
  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedListing({});
  }, []);
  return (
    <>
      <Drawer
        width='500px'
        isOpen={isDrawerOpen}
        position='right'
        onClose={closeDrawer}
        title='Add Listing'
      >
        <ListingForm
          initialData={selectedListing}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
        />
      </Drawer>

      <div className='page-content'>
        <div className='page-header'>
          <h1 className='page-title'>Listings</h1>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className='action-button green'
          >
            <AiOutlinePlus className='action-button-icon' />
            Add Listing
          </button>
        </div>

        <DataTable
          columns={columns}
          data={listings}
          isLoading={isLoading}
          emptyMessage='No listings found. Create your first listing!'
        />
      </div>
    </>
  );
};
export default ListingsPage;
