import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import pool from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    console.error('[GET /api/estimates/[id]]', error);
    return NextResponse.json({ message: '조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    const { status } = await req.json() as { status: string };

    const validStatuses = ['작성중', '진행', '취소'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: '유효하지 않은 상태입니다.' }, { status: 400 });
    }

    await pool.query(
      'UPDATE estimates SET status = ? WHERE id = ?',
      [status, numericId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PATCH /api/estimates/[id]]', error);
    return NextResponse.json({ message: '상태 변경에 실패했습니다.' }, { status: 500 });
  }
}
