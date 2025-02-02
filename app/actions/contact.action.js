'use server';
import { query } from '@/src/lib/db';

export async function insertContactUsDetails({
  firstName,
  lastName,
  subject,
  phone: phoneNumber,
  email,
  message,
}) {
  // todo: add validation
  const insertSql = `INSERT INTO contact_us (first_name , last_name, email , phone_number, subject,  message, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
  const insertParams = [
    firstName,
    lastName,
    email,
    phoneNumber,
    subject,
    message,
  ];

  try {
    await query(insertSql, insertParams);
    console.log('Contact Us details inserted successfully.');
    return { data: { message: 'Contact Us details inserted successfully.' } };
  } catch (error) {
    console.error('Error inserting Contact Us details:', error);
    return { err: error.message };
  }
}
