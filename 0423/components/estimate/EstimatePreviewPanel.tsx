'use client';

import EstimateActions from './EstimateActions';
import type { EstimateStateReturn } from '@/hooks/useEstimateState';

interface Props {
  state: EstimateStateReturn;
}

export default function EstimatePreviewPanel({ state }: Props) {
  const {
    savedEstimateId,
    estimateDetailQuery,
    handleSave,
    saveEstimateMutation,
  } = state;

  const estimate = estimateDetailQuery.data;
  const isSaving = saveEstimateMutation.isPending;
  const saveError = saveEstimateMutation.error;

  return (
    <div className="estimate-preview-panel">
      <div className="estimate-preview-header">
        <h2 className="estimate-panel-title">견적서 미리보기</h2>

        {!savedEstimateId && (
          <button
            type="button"
            className="estimate-complete-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '견적서 완료'}
          </button>
        )}

        {saveError && (
          <p className="estimate-error-text">{saveError.message}</p>
        )}
      </div>

      {!estimate ? (
        <div className="estimate-preview-empty">
          <p>견적서를 완료하면 미리보기가 표시됩니다.</p>
        </div>
      ) : (
        <div className="estimate-preview-body">
          <div className="estimate-preview-section">
            <h3 className="estimate-preview-section-title">견적서</h3>
            <dl className="estimate-preview-info">
              <div className="estimate-preview-row">
                <dt>품목명</dt>
                <dd>{estimate.item_name}</dd>
              </div>
              <div className="estimate-preview-row">
                <dt>연락처</dt>
                <dd>{estimate.contact_number}</dd>
              </div>
              <div className="estimate-preview-row">
                <dt>상품명</dt>
                <dd>{estimate.product_name}</dd>
              </div>
              <div className="estimate-preview-row">
                <dt>수량</dt>
                <dd>{estimate.product_quantity}</dd>
              </div>
              <div className="estimate-preview-row">
                <dt>지역</dt>
                <dd>{estimate.region_name}</dd>
              </div>
              <div className="estimate-preview-row">
                <dt>품목유형</dt>
                <dd>{estimate.item_type}</dd>
              </div>
              <div className="estimate-preview-row">
                <dt>pallet 수</dt>
                <dd>{estimate.pallet_count}</dd>
              </div>
              <div className="estimate-preview-row">
                <dt>상태</dt>
                <dd>
                  <span className={`status-badge status-badge--${estimate.status}`}>
                    {estimate.status}
                  </span>
                </dd>
              </div>
            </dl>

            {estimate.items && estimate.items.length > 0 && (
              <div className="estimate-preview-items">
                <h4 className="estimate-preview-items-title">품목 목록</h4>
                <table className="estimate-preview-table">
                  <thead>
                    <tr>
                      <th>품목명</th>
                      <th>수량</th>
                      <th>창고</th>
                      <th>보관유형</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimate.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.item_name}</td>
                        <td>{item.quantity_text}</td>
                        <td>{item.warehouse_name}</td>
                        <td>{item.storage_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {estimate.caution_text && (
            <div className="estimate-preview-section">
              <h3 className="estimate-preview-section-title">주의사항</h3>
              <p className="estimate-preview-caution">{estimate.caution_text}</p>
            </div>
          )}

          <EstimateActions state={state} />
        </div>
      )}
    </div>
  );
}
