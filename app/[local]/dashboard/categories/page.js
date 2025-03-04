'use client';
import DataTable from '@/src/components/DataTable';
import Drawer from '@/src/components/Drawer';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNotifications } from 'reapop';
import '../styles.css';
import CategoryForm from '@/src/forms/AddCategory';
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { notify } = useNotifications();

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      notify('Failed to load categories', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (data) => {
    try {
      const { success } = await addCategory(data);
      if (success) {
        setIsDrawerOpen(false);
        fetchCategories();
        notify('Category Added!', 'success', {
          position: 'top-center',
          dismissAfter: 3000,
        });
      }
    } catch (error) {
      console.error('Error adding category:', error);
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
      // Implement the delete API call here
      // For now, we'll just filter the categories
      setCategories(categories.filter((cat) => cat.id !== id));
      notify('Category deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting category:', error);
      notify('Failed to delete category', 'error');
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
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
              onClick={() => {}} // Implement edit functionality
              className='action-button-small blue'
            >
              <FiEdit size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Drawer
        width='500px'
        isOpen={isDrawerOpen}
        position='right'
        onClose={() => setIsDrawerOpen(false)}
        title='Add Category'
      >
        <CategoryForm onSubmit={handleSubmit} />
      </Drawer>

      <div className='page-content'>
        <div className='page-header'>
          <h1 className='page-title'>Categories</h1>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className='action-button blue'
          >
            <AiOutlinePlus className='action-button-icon' />
            Add Category
          </button>
        </div>

        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          emptyMessage='No categories found. Create your first category!'
        />
      </div>
    </>
  );
};

export default CategoriesPage;
