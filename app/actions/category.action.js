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
