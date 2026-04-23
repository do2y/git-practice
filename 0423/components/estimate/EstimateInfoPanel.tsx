'use client';

import type { EstimateStateReturn } from '@/hooks/useEstimateState';

interface Props {
  state: EstimateStateReturn;
}

export default function EstimateInfoPanel({ state }: Props) {
  const { form, items } = state;

  return (
    <div className="estimate-info-panel">
      <h3 className="estimate-info-title">현재 입력 정보</h3>
      <dl className="estimate-info-list">
        <div className="estimate-info-row">
          <dt>품목명</dt>
          <dd>{form.item_name || '-'}</dd>
        </div>
        <div className="estimate-info-row">
          <dt>연락처</dt>
          <dd>{form.contact_number || '-'}</dd>
        </div>
        <div className="estimate-info-row">
          <dt>상품명</dt>
          <dd>{form.product_name || '-'}</dd>
        </div>
        <div className="estimate-info-row">
          <dt>수량</dt>
          <dd>{form.product_quantity || '-'}</dd>
        </div>
        <div className="estimate-info-row">
          <dt>지역</dt>
          <dd>{form.region_name || '-'}</dd>
        </div>
        <div className="estimate-info-row">
          <dt>품목유형</dt>
          <dd>{form.item_type || '-'}</dd>
        </div>
        <div className="estimate-info-row">
          <dt>pallet 수</dt>
          <dd>{form.pallet_count || '-'}</dd>
        </div>
        <div className="estimate-info-row">
          <dt>품목 수</dt>
          <dd>{items.length}건</dd>
        </div>
      </dl>
    </div>
  );
}
