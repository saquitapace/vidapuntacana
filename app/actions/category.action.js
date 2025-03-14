'use server';
import { getConnection } from '@/src/lib/db';

export const addCategory = async (category) => {
  try {
    const conn = await getConnection();
    try {
      if (
        category?.name?.trim() === '' ||
        category?.name === null ||
        category?.name === undefined
      ) {
        return { success: false, message: 'Category name is required' };
      }
      await conn.beginTransaction();
      const [result] = await conn.execute(
        `INSERT INTO category (name) VALUES (?)`,
        [category?.name]
      );
      await conn.commit();
      return { success: true, message: 'Category added successfully' };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    return { success: false, message: 'Failed to add category' };
  }
};

export const updateCategory = async (id, category) => {
  try {
    if (!id) {
      return { success: false, message: 'Category ID is required' };
    }

    if (
      category?.name?.trim() === '' ||
      category?.name === null ||
      category?.name === undefined
    ) {
      return { success: false, message: 'Category name is required' };
    }

    const conn = await getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.execute(
        `UPDATE category SET name = ? WHERE id = ?`,
        [category.name, id]
      );

      await conn.commit();

      if (result.affectedRows === 0) {
        return { success: false, message: 'Category not found' };
      }

      return { success: true, message: 'Category updated successfully' };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, message: 'Failed to update category' };
  }
};

export const deleteCategory = async (id) => {
  try {
    if (!id) {
      return { success: false, message: 'Category ID is required' };
    }

    const conn = await getConnection();
    try {
      await conn.beginTransaction();

      const [primaryCategoryCheck] = await conn.execute(
        `SELECT COUNT(*) as count FROM listing WHERE primary_category = ?`,
        [id]
      );

      if (primaryCategoryCheck[0].count > 0) {
        return {
          success: false,
          message:
            'Cannot delete category as it is used as a primary category in one or more listings',
        };
      }

      const [associationCheck] = await conn.execute(
        `SELECT COUNT(*) as count FROM listing_category WHERE category_id = ?`,
        [id]
      );

      if (associationCheck[0].count > 0) {
        return {
          success: false,
          message:
            'Cannot delete category as it is associated with one or more listings',
        };
      }

      const [result] = await conn.execute(`DELETE FROM category WHERE id = ?`, [
        id,
      ]);

      await conn.commit();

      if (result.affectedRows === 0) {
        return { success: false, message: 'Category not found' };
      }

      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, message: 'Failed to delete category' };
  }
};
