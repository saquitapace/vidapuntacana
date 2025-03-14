'use client';
import { addCategory, deleteCategory, updateCategory } from '@/app/actions/category.action';
import DataTable from '@/src/components/DataTable';
import { DeleteModal } from '@/src/components/DeleteModal';
import Drawer from '@/src/components/Drawer';
import CategoryForm from '@/src/forms/AddCategory';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNotifications } from 'reapop';
import '../styles.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { notify } = useNotifications();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      let result;
      if (selectedCategory) {
        result = await updateCategory(selectedCategory.id, data);
      } else {
        result = await addCategory(data);
      }
      
      if (result.success) {
        setIsDrawerOpen(false);
        setSelectedCategory(null);
        fetchCategories();
        notify(result.message, 'success', {
          position: 'top-center',
          dismissAfter: 3000,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error saving category:', error);
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

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteCategory(categoryToDelete.id);
      if (result.success) {
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
        notify(result.message, 'success', {
          position: 'top-center',
          dismissAfter: 3000,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
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
      setIsDeleting(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
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
              onClick={() => handleDeleteClick(row.original)}
              className='action-button-small red'
              disabled={isDeleting && categoryToDelete?.id === row.original.id}
            >
              {isDeleting && categoryToDelete?.id === row.original.id ? (
                <span className="loading-spinner-small"></span>
              ) : (
                <FiTrash2 size={18} />
              )}
            </button>
            <button
              onClick={() => handleEdit(row.original)}
              className='action-button-small blue'
            >
              <FiEdit size={18} />
            </button>
          </div>
        ),
      },
    ],
    [isDeleting, categoryToDelete]
  );

  return (
    <>
      <Drawer
        width='500px'
        isOpen={isDrawerOpen}
        position='right'
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedCategory(null);
        }}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
      >
        <CategoryForm onSubmit={handleSubmit} initialData={selectedCategory} />
      </Drawer>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        title="Delete Category"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

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
