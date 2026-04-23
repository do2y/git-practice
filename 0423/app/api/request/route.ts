import type { ResultSetHeader } from 'mysql2';
import { NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = await getCurrentAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS inquiry_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query<ResultSetHeader>(
      'INSERT INTO inquiry_requests (name, email, message) VALUES (?, ?, ?)',
      [String(name), String(email), String(message)]
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: 'Failed to submit inquiry.' },
      { status: 500 }
    );
  }
}
