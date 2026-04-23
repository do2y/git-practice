import { NextResponse } from 'next/server';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const estimateId = url.searchParams.get('estimate_id');

    let query = 'SELECT * FROM estimate_items';
    const queryParams: number[] = [];

    if (estimateId) {
      query += ' WHERE estimate_id = ?';
      queryParams.push(parseInt(estimateId, 10));
    }

    query += ' ORDER BY id ASC';

    const [rows] = await pool.query<RowDataPacket[]>(query, queryParams);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('[GET /api/estimate-items]', error);
    return NextResponse.json({ message: '조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      estimate_id: number;
      item_name: string;
      quantity_text: string;
      warehouse_name: string;
      storage_type: string;
      remark?: string;
    };

    const { estimate_id, item_name, quantity_text, warehouse_name, storage_type, remark } = body;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO estimate_items (estimate_id, item_name, quantity_text, warehouse_name, storage_type, remark)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [estimate_id, item_name, quantity_text, warehouse_name, storage_type, remark || null]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/estimate-items]', error);
    return NextResponse.json({ message: '추가에 실패했습니다.' }, { status: 500 });
  }
}
