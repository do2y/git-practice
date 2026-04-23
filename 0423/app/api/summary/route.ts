// GET /api/summary?menu=메인페이지 — 메뉴별 요약 카드 조회
// inventory_items 테이블을 집계하여 메뉴 관점에 맞는 카드 구성을 반환
import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import { getCurrentAuthUser } from '@/lib/auth';
import pool from '@/lib/db';

interface SummaryRow extends RowDataPacket {
  totalCount: number;
  storing: number;
  outboundWaiting: number;
  outboundDone: number;
  frozen: number;
  refrigerated: number;
  normal: number;
  totalAmount: number;
  locationCount: number;
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const menu = searchParams.get('menu') || '메인페이지';

    const [[summary]] = await pool.query<SummaryRow[]>(`
      SELECT
        COUNT(*)                                              AS totalCount,
        SUM(CASE WHEN status   = '보관'     THEN 1 ELSE 0 END) AS storing,
        SUM(CASE WHEN status   = '출고 대기' THEN 1 ELSE 0 END) AS outboundWaiting,
        SUM(CASE WHEN status   = '출고 완료' THEN 1 ELSE 0 END) AS outboundDone,
        SUM(CASE WHEN category = '냉동'     THEN 1 ELSE 0 END) AS frozen,
        SUM(CASE WHEN category = '냉장'     THEN 1 ELSE 0 END) AS refrigerated,
        SUM(CASE WHEN category = '일반'     THEN 1 ELSE 0 END) AS normal,
        SUM(expected_amount)                                  AS totalAmount,
        COUNT(DISTINCT location)                              AS locationCount
      FROM inventory_items
    `);

    const fmt = (n: number) => Number(n || 0).toLocaleString('ko-KR');
    const s = summary;

    const cardMap: Record<string, { title: string; value: string; subText?: string; icon: string }[]> = {
      '메인페이지': [
        {
          title: '보관중인 물품',
          value: String(s.totalCount || 0),
          subText: `출고대기 ${s.outboundWaiting || 0} / 냉동 ${s.frozen || 0} / 냉장 ${s.refrigerated || 0} / 일반 ${s.normal || 0}`,
          icon: '□',
        },
        {
          title: '예상 비용',
          value: fmt(s.totalAmount) + '원',
          subText: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) + ' 현재까지',
          icon: '≡',
        },
      ],
      '견적서 작성': [
        { title: '전체 물품', value: String(s.totalCount || 0), icon: '□' },
        { title: '예상 총 비용', value: fmt(s.totalAmount) + '원', icon: '≡' },
      ],
      '계약 현황': [
        { title: '보관 중', value: String(s.storing || 0), icon: '□' },
        { title: '출고 대기', value: String(s.outboundWaiting || 0), icon: '≡' },
      ],
      '입고 현황': [
        {
          title: '보관 중',
          value: String(s.storing || 0),
          subText: `냉동 ${s.frozen || 0} / 냉장 ${s.refrigerated || 0} / 일반 ${s.normal || 0}`,
          icon: '□',
        },
        { title: '이용 금액', value: fmt(s.totalAmount) + '원', icon: '≡' },
      ],
      '출고 요청': [
        { title: '출고 대기', value: String(s.outboundWaiting || 0), icon: '□' },
        { title: '출고 완료', value: String(s.outboundDone || 0), icon: '≡' },
      ],
      '출고 현황': [
        { title: '출고 대기', value: String(s.outboundWaiting || 0), icon: '□' },
        { title: '출고 완료', value: String(s.outboundDone || 0), icon: '≡' },
      ],
      '공지사항': [
        { title: '전체 물품', value: String(s.totalCount || 0), icon: '□' },
        { title: '보관 위치 수', value: String(s.locationCount || 0), icon: '≡' },
      ],
      '문의사항': [
        { title: '전체 물품', value: String(s.totalCount || 0), icon: '□' },
        { title: '예상 비용', value: fmt(s.totalAmount) + '원', icon: '≡' },
      ],
      '마이페이지': [
        { title: '내 보관 물품', value: String(s.totalCount || 0), icon: '□' },
        { title: '이번달 이용료', value: fmt(s.totalAmount) + '원', icon: '≡' },
      ],
    };

    const cards = cardMap[menu] ?? cardMap['메인페이지'];
    return NextResponse.json({ main: cards });
  } catch {
    return NextResponse.json({ message: '카드 요약 조회 실패' }, { status: 500 });
  }
}
