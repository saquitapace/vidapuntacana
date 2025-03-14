'use client';

import { addListing, updateListing } from '@/app/actions/listing.action';
import DataTable from '@/src/components/DataTable';
import Drawer from '@/src/components/Drawer';
import ListingForm from '@/src/forms/AddListing';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNotifications } from 'reapop';
import '../styles.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3 className="delete-modal-title">Confirm Deletion</h3>
        <p className="delete-modal-message">
          Are you sure you want to delete this listing? This action cannot be undone.
        </p>
        <div className="delete-modal-actions">
          <button 
            onClick={onClose} 
            className="delete-modal-button cancel"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="delete-modal-button delete"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { notify } = useNotifications();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setIsSubmitting(true);
      console.log('submitting ');
      if (selectedListing?.lid) {
        console.log('updating data ', data);
        const { success, message, error, errors } = await updateListing(data);
        if (success) {
          notify('Listing Updated!', 'success', {
            position: 'top-center',
            dismissAfter: 3000,
          });
          fetchData();
          setIsDrawerOpen(false);
        } else {
          notify(message || 'Failed to update listing', 'error', {
            position: 'top-center',
            dismissAfter: 3000,
          });
        }
        return;
      }

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (lid) => {
    setListingToDelete(lid);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/listings/${listingToDelete}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        setListings(listings.filter((listing) => listing.lid !== listingToDelete));
        notify('Listing deleted successfully', 'success', {
          position: 'top-center',
          dismissAfter: 3000,
        });
      } else {
        throw new Error(data.error || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      notify(error.message || 'Failed to delete listing', 'error', {
        position: 'top-center',
        dismissAfter: 3000,
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setListingToDelete(null);
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
              onClick={() => handleDelete(row.original.lid)}
              className='action-button-small red'
            >
              <FiTrash2 size={18} />
            </button>
            <button
              onClick={async () => {
                try {
                  setEditingId(row.original.lid);
                  const res = await fetch(`/api/listings/${row.original.lid}`);
                  const data = await res.json();
                  console.log('__data ', data);
                  setSelectedListing(data);
                  setIsDrawerOpen(true);
                } catch (error) {
                  console.log('error ', error);
                  notify('Failed to fetch listing data', 'error');
                  setIsDrawerOpen(false);
                } finally {
                  setEditingId(null);
                }
              }}
              className='action-button-small blue'
              disabled={editingId === row.original.lid}
            >
              {editingId === row.original.lid ? (
                <span className='loading-spinner small'></span>
              ) : (
                <FiEdit size={18} />
              )}
            </button>
          </div>
        ),
      },
    ],
    [getCategoryName, editingId]
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
        title={`${
          Object.keys(selectedListing ?? {}).length > 0 ? 'Update ' : 'Add'
        } Listing`}
      >
        <ListingForm
          initialData={selectedListing}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
          isSubmitting={isSubmitting}
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

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setListingToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};
export default ListingsPage;
