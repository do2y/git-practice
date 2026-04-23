'use client';

import type { EstimateStateReturn } from '@/hooks/useEstimateState';

interface Props {
  state: EstimateStateReturn;
}

export default function EstimateItemTable({ state }: Props) {
  const { items } = state;

  return (
    <div className="estimate-table-panel">
      <div className="estimate-table-header">
        <h2 className="estimate-panel-title">품목 목록</h2>
        <span className="estimate-item-count">{items.length}건</span>
      </div>

      <div className="estimate-table-wrap">
        <table className="estimate-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>품목명</th>
              <th>수량</th>
              <th>창고</th>
              <th>보관유형</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="estimate-table-empty">
                  추가된 품목이 없습니다.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.item_name}</td>
                  <td>{item.quantity_text}</td>
                  <td>{item.warehouse_name}</td>
                  <td>
                    <span className={`storage-badge storage-badge--${item.storage_type}`}>
                      {item.storage_type}
                    </span>
                  </td>
                  <td className="estimate-table-remark">{item.remark || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
