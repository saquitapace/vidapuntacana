'use server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_AIVEN_HOST
      : process.env.DB_HOST || 'localhost',
  user:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_AIVEN_USER
      : process.env.DB_USER || 'vivo_user',
  password:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_AIVEN_PASSWORD
      : process.env.DB_PASSWORD || 'vivo_password',
  database:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_AIVEN_DB
      : process.env.DB_NAME || 'vivopuntacana',
  port:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_AIVEN_PORT
      : process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql, params) {
  try {
    console.log('sql ', sql, params);
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
}

export async function transaction(callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Error getting connection:', error);
    throw error;
  }
}
