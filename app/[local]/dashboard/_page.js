'use client';
import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import './styles.css';
import ListingForm from '../../../src/forms/AddListing';
import Drawer from '@/src/components/Drawer';
import { addListing } from '@/app/actions/listing.action';
import CategoryForm from '@/src/forms/AddCategory';
import { addCategory } from '@/app/actions/category.action';
import { useNotifications } from 'reapop';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);

  const [listings, setListings] = useState([]);

  const [activeTab, setActiveTab] = useState('categories');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState('');
  const { notify } = useNotifications();

  const openDrawer = (type, item = null) => {
    setDrawerType(type);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const getListings = async () => {
    try {
      fetch('/api/listings/preview')
        .then((res) => res.json())
        .then((data) => {
          console.log('data', data);
          setListings(data.listings);
        });
    } catch (error) {
      console.log('Error', error);
    }
  };
  const getCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };
  useEffect(() => {
    getListings();
  }, []);
  useEffect(() => {
    getCategories();
  }, []);
  const handleSubmit = async (data) => {
    try {
      console.log('data_', data);

      if (drawerType === 'category') {
        const { success } = await addCategory(data);
        if (success) {
          closeDrawer();
          notify('Category Added!', 'success', {
            position: 'top-center',
            dismissAfter: 3000,
          });
        }
      } else {
        const { error, ...res } = await addListing(data);
        console.log('error ', error, 'res', res);
        if (!error) {
          closeDrawer();
          notify('Listing Added!', 'success', {
            position: 'top-center',
            dismissAfter: 3000,
          });
        }
      }
    } catch (error) {
      console.log('Error', error);
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

  const handleDelete = (type, id) => {
    if (type === 'category') {
      setCategories(categories.filter((cat) => cat.id !== id));
      setListings(listings.filter((listing) => listing.categoryId !== id));
    } else {
      setListings(listings.filter((listing) => listing.id !== id));
    }
  };

  const getCategoryName = (categoryId) => {
    return categories.find((cat) => cat?.id === categoryId)?.name || 'Unknown';
  };

  const categoryColumns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete('category', row.original.id)}
          className='delete-btn'
        >
          <FiTrash2 size={16} />
        </button>
      ),
    },
  ];

  const listingColumns = [
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
      accessorFn: (row) => `${row?.phone}`,
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete('listing', row.original.id)}
          className='delete-btn'
        >
          <FiTrash2 size={16} />
        </button>
      ),
    },
  ];

  const categoryTable = useReactTable({
    data: categories || [],
    columns: categoryColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const listingTable = useReactTable({
    data: listings || [],
    columns: listingColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Drawer
        width='500px'
        isOpen={isDrawerOpen}
        position='right'
        onClose={closeDrawer}
        title='Add Listing'
      >
        {drawerType === 'category' ? (
          <CategoryForm onSubmit={handleSubmit} />
        ) : drawerType === 'listing' ? (
          <ListingForm
            initialData={{}}
            onSubmit={handleSubmit}
            onCancel={closeDrawer}
          />
        ) : null}
      </Drawer>
      <div className='dashboard-container'>
        <div className='dashboard-content'>
          <div className='dashboard-header'>
            <h1 className='dashboard-title'>Dashboard</h1>
            <p className='dashboard-subtitle'>
              Manage your categories and listings efficiently
            </p>
          </div>

          <div className='action-buttons'>
            <button
              onClick={() => openDrawer('category')}
              className='btn btn-blue'
            >
              <AiOutlinePlus className='btn-icon' />
              Add Category
            </button>

            <button
              onClick={() => openDrawer('listing')}
              className='btn btn-green'
            >
              <AiOutlinePlus className='btn-icon' />
              Add Listing
            </button>
          </div>

          <div className='tabs-container'>
            <nav className='tabs-nav'>
              <button
                onClick={() => setActiveTab('categories')}
                className={`tab-button ${
                  activeTab === 'categories' ? 'active' : ''
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`tab-button ${
                  activeTab === 'listings' ? 'active' : ''
                }`}
              >
                Listings
              </button>
            </nav>
          </div>

          <div className='table-container'>
            <div className='table-header'>
              <h2 className='table-title'>
                {activeTab === 'categories' ? 'Categories' : 'Listings'}
              </h2>
            </div>

            <table className='table'>
              <thead>
                {(activeTab === 'categories' ? categoryTable : listingTable)
                  .getHeaderGroups()
                  .map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
              </thead>
              <tbody>
                {(activeTab === 'categories' ? categoryTable : listingTable)
                  .getRowModel()
                  ?.rows?.map((row) => (
                    <tr key={row?.id}>
                      {row?.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
