// GET /api/inventory/[id] — 단건 조회 (계약내용 모달용)
import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import { getCurrentAuthUser } from '@/lib/auth';
import pool from '@/lib/db';

interface InventoryRow extends RowDataPacket {
  id: number;
  product_initial: string;
  product_name: string;
  category: string;
  status: string;
  location: string;
  storage_period: string;
  inbound_date: string;
  outbound_due_date: string;
  expected_amount: number;
  contract_detail?: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ message: '잘못된 ID입니다.' }, { status: 400 });
    }

    const [rows] = await pool.query<InventoryRow[]>(
      'SELECT * FROM inventory_items WHERE id = ?',
      [numericId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: '해당 물품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const row = rows[0];
    return NextResponse.json({
      id: row.id,
      productInitial: row.product_initial,
      productName: row.product_name,
      category: row.category,
      status: row.status,
      location: row.location,
      storagePeriod: row.storage_period,
      inboundDate: row.inbound_date,
      outboundDueDate: row.outbound_due_date,
      expectedAmount: Number(row.expected_amount).toLocaleString('ko-KR') + '원',
      contractDetail: row.contract_detail || '',
    });
  } catch {
    return NextResponse.json({ message: '계약 정보 조회 실패' }, { status: 500 });
  }
}
