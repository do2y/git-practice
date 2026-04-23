'use client';

// UserInventoryTable — 재고 목록 테이블
// Local State: selectedItemId (계약내용 모달, 이 컴포넌트 안에서만 사용)
// Server State: 계약 단건 조회 (React Query — ContractModal 내부)

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { InventoryItem } from '@/lib/types';
import { fetchInventoryItem } from '@/lib/api';

// ── 계약내용 모달 ──────────────────────────────────────────────────────────
function ContractModal({ itemId, onClose }: { itemId: number; onClose: () => void }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventory', itemId],
    queryFn: () => fetchInventoryItem(itemId),
    enabled: itemId != null,
    staleTime: 60_000,
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">계약 내용</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {isLoading && <p className="status-text">불러오는 중...</p>}
          {error && <p className="status-text error-text">{error.message}</p>}
          {data && (
            <table className="modal-table">
              <tbody>
                <tr><th>상품명</th><td>{data.productName}</td></tr>
                <tr><th>분류</th><td>{data.category}</td></tr>
                <tr><th>보관 기간</th><td>{data.storagePeriod}</td></tr>
                <tr><th>입고일</th><td>{data.inboundDate}</td></tr>
                <tr><th>출고 예정일</th><td>{data.outboundDueDate}</td></tr>
                <tr><th>상태</th><td>{data.status}</td></tr>
                <tr><th>보관 위치</th><td>{data.location}</td></tr>
                <tr><th>이번달 이용료</th><td>{data.expectedAmount}</td></tr>
                <tr><th>계약 상세</th><td>{data.contractDetail}</td></tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 메인 테이블 ────────────────────────────────────────────────────────────
interface Props {
  rows: InventoryItem[];
}

export default function UserInventoryTable({ rows }: Props) {
  // Local State — 계약 모달 선택 ID (이 컴포넌트 내부에서만 사용)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  return (
    <>
      <section className="inventory-panel">
        <h3 className="inventory-panel-title">보관중인 물품</h3>

        <div className="inventory-table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>상품이름</th>
                <th>상품분류</th>
                <th>보관기간</th>
                <th>입고일</th>
                <th>출고예정일</th>
                <th>상태</th>
                <th>보관위치</th>
                <th>이번달 이용료</th>
                <th>계약내용 보기</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="product-info">
                        <div className="product-logo">{row.productInitial}</div>
                        <span>{row.productName}</span>
                      </div>
                    </td>
                    <td>{row.category}</td>
                    <td>{row.storagePeriod}</td>
                    <td>{row.inboundDate}</td>
                    <td>{row.outboundDueDate}</td>
                    <td>{row.status}</td>
                    <td>{row.location}</td>
                    <td>{row.expectedAmount}</td>
                    <td>
                      <button
                        className="view-button"
                        onClick={() => setSelectedItemId(row.id)}
                      >
                        보기
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="empty-row">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="inventory-panel-footer">
          <a href="/dashboard">모든 상품 보기</a>
        </div>
      </section>

      {selectedItemId !== null && (
        <ContractModal
          itemId={selectedItemId}
          onClose={() => setSelectedItemId(null)}
        />
      )}
    </>
  );
}
