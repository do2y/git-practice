import { NextResponse } from 'next/server';
import type { ResultSetHeader } from 'mysql2';
import pool from '@/lib/db';
import type { EstimateFormData } from '@/types/estimate';
import type { EstimateItemFormData } from '@/types/estimate-item';

async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS estimates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      item_name VARCHAR(100) NOT NULL,
      contact_number VARCHAR(30) NOT NULL,
      product_name VARCHAR(100) NOT NULL,
      product_quantity VARCHAR(50) NOT NULL,
      region_name VARCHAR(100) NOT NULL,
      item_type VARCHAR(50) NOT NULL,
      pallet_count VARCHAR(30) NOT NULL,
      caution_text TEXT,
      status VARCHAR(30) DEFAULT '작성중',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS estimate_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      estimate_id INT NOT NULL,
      item_name VARCHAR(100) NOT NULL,
      quantity_text VARCHAR(100) NOT NULL,
      warehouse_name VARCHAR(100) NOT NULL,
      storage_type VARCHAR(50) NOT NULL,
      remark VARCHAR(100),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as { form: EstimateFormData; items: EstimateItemFormData[] };
    const { form, items } = body;

    await ensureTables();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO estimates
        (item_name, contact_number, product_name, product_quantity, region_name, item_type, pallet_count, caution_text)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        form.item_name,
        form.contact_number,
        form.product_name,
        form.product_quantity,
        form.region_name,
        form.item_type,
        form.pallet_count,
        form.caution_text || null,
      ]
    );

    const estimateId = result.insertId;

    for (const item of items) {
      await pool.query(
        `INSERT INTO estimate_items
          (estimate_id, item_name, quantity_text, warehouse_name, storage_type, remark)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [estimateId, item.item_name, item.quantity_text, item.warehouse_name, item.storage_type, item.remark || null]
      );
    }

    return NextResponse.json({ success: true, id: estimateId }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/estimates]', error);
    return NextResponse.json({ message: '저장에 실패했습니다.' }, { status: 500 });
  }
}
