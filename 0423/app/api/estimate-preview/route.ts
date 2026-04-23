import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'id가 필요합니다.' }, { status: 400 });
    }

    const numericId = parseInt(id, 10);

    const [estimates] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM estimates WHERE id = ?',
      [numericId]
    );

    if (!estimates[0]) {
      return NextResponse.json({ message: '견적을 찾을 수 없습니다.' }, { status: 404 });
    }

    const [items] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM estimate_items WHERE estimate_id = ? ORDER BY id ASC',
      [numericId]
    );

    return NextResponse.json({ ...estimates[0], items });
  } catch (error) {
    console.error('[GET /api/estimate-preview]', error);
    return NextResponse.json({ message: '조회에 실패했습니다.' }, { status: 500 });
  }
}
