// GET /api/inventory  — 재고 목록 조회
// POST /api/inventory — 상품 입고 신청 (Optimistic Update 후 Query Invalidation 트리거용)
import { NextResponse } from 'next/server';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
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

function mapRow(row: InventoryRow) {
  return {
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
  };
}

export async function GET() {
  try {
    const user = await getCurrentAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const [rows] = await pool.query<InventoryRow[]>(
      'SELECT * FROM inventory_items ORDER BY id DESC'
    );
    // 개발 중 로딩 상태 확인용 지연 (운영에서는 제거)
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json(rows.map(mapRow));
  } catch {
    return NextResponse.json({ message: '재고 목록 조회 실패' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      productInitial, productName, category, status,
      location, storagePeriod, inboundDate, outboundDueDate, expectedAmount,
    } = body;

    if (
      !productInitial || !productName || !category || !status ||
      !location || !storagePeriod || !inboundDate || !outboundDueDate || !expectedAmount
    ) {
      return NextResponse.json(
        { message: '모든 항목을 입력해야 합니다.' },
        { status: 400 }
      );
    }

    if (Number(expectedAmount) >= 10_000_000) {
      return NextResponse.json(
        { message: '금액이 너무 커서 등록에 실패했습니다.' },
        { status: 400 }
      );
    }

    await pool.query<ResultSetHeader>(
      `INSERT INTO inventory_items
         (product_initial, product_name, category, status, location,
          storage_period, inbound_date, outbound_due_date, expected_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productInitial, productName, category, status, location,
        storagePeriod, inboundDate, outboundDueDate, Number(expectedAmount),
      ]
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: '재고 등록 실패' }, { status: 500 });
  }
}
