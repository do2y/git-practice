'use client';

import type { EstimateStateReturn } from '@/hooks/useEstimateState';

interface Props {
  state: EstimateStateReturn;
}

export default function EstimateForm({ state }: Props) {
  const { form, handleFormChange, itemForm, handleItemFormChange, handleAddItem } = state;

  return (
    <div className="estimate-form-panel">
      <h2 className="estimate-panel-title">상세정보 입력</h2>

      <div className="estimate-form-body">
        <div className="estimate-field">
          <label className="estimate-label">품목명</label>
          <input
            className="estimate-input"
            type="text"
            placeholder="품목명 입력"
            value={form.item_name}
            onChange={(e) => handleFormChange('item_name', e.target.value)}
          />
        </div>

        <div className="estimate-field">
          <label className="estimate-label">연락처</label>
          <input
            className="estimate-input"
            type="text"
            placeholder="010-0000-0000"
            value={form.contact_number}
            onChange={(e) => handleFormChange('contact_number', e.target.value)}
          />
        </div>

        <div className="estimate-field">
          <label className="estimate-label">상품명</label>
          <input
            className="estimate-input"
            type="text"
            placeholder="상품명 입력"
            value={form.product_name}
            onChange={(e) => handleFormChange('product_name', e.target.value)}
          />
        </div>

        <div className="estimate-field">
          <label className="estimate-label">상품수량</label>
          <input
            className="estimate-input"
            type="text"
            placeholder="예: 100개"
            value={form.product_quantity}
            onChange={(e) => handleFormChange('product_quantity', e.target.value)}
          />
        </div>

        <div className="estimate-field">
          <label className="estimate-label">지역</label>
          <input
            className="estimate-input"
            type="text"
            placeholder="예: 서울"
            value={form.region_name}
            onChange={(e) => handleFormChange('region_name', e.target.value)}
          />
        </div>

        <div className="estimate-field">
          <label className="estimate-label">품목</label>
          <select
            className="estimate-input"
            value={form.item_type}
            onChange={(e) => handleFormChange('item_type', e.target.value)}
          >
            <option value="">선택</option>
            <option value="일반">일반</option>
            <option value="냉장">냉장</option>
            <option value="냉동">냉동</option>
          </select>
        </div>

        <div className="estimate-field">
          <label className="estimate-label">pallet 수</label>
          <input
            className="estimate-input"
            type="text"
            placeholder="예: 5"
            value={form.pallet_count}
            onChange={(e) => handleFormChange('pallet_count', e.target.value)}
          />
        </div>

        <div className="estimate-field">
          <label className="estimate-label">주의사항</label>
          <textarea
            className="estimate-textarea"
            placeholder="주의사항을 입력하세요"
            value={form.caution_text}
            onChange={(e) => handleFormChange('caution_text', e.target.value)}
          />
        </div>
      </div>

      <div className="estimate-item-form-section">
        <h3 className="estimate-item-form-title">품목 추가</h3>

        <div className="estimate-field">
          <label className="estimate-label">품목명</label>
          <input
            className="estimate-input"
            type="text"
            placeholder="품목명"
            value={itemForm.item_name}
            onChange={(e) => handleItemFormChange('item_name', e.target.value)}
          />
        </div>

        <div className="estimate-field">
          <label className="estimate-label">수량</label>
          <input
            className="estimate-input"
            type="text"
            placeholder="예: 50box"
            value={itemForm.quantity_text}
            onChange={(e) => handleItemFormChange('quantity_text', e.target.value)}
          />
        </div>

        <div className="estimate-field">
          <label className="estimate-label">창고</label>
          <input
            className="estimate-input"
            type="text"
            placeholder="예: A-01"
            value={itemForm.warehouse_name}
            onChange={(e) => handleItemFormChange('warehouse_name', e.target.value)}
          />
        </div>

        <div className="estimate-field">
          <label className="estimate-label">보관유형</label>
          <select
            className="estimate-input"
            value={itemForm.storage_type}
            onChange={(e) => handleItemFormChange('storage_type', e.target.value)}
          >
            <option value="">선택</option>
            <option value="일반">일반</option>
            <option value="냉장">냉장</option>
            <option value="냉동">냉동</option>
          </select>
        </div>

        <div className="estimate-field">
          <label className="estimate-label">비고</label>
          <input
            className="estimate-input"
            type="text"
            placeholder="비고 (선택)"
            value={itemForm.remark}
            onChange={(e) => handleItemFormChange('remark', e.target.value)}
          />
        </div>

        <button
          type="button"
          className="estimate-add-btn"
          onClick={handleAddItem}
          disabled={!itemForm.item_name || !itemForm.quantity_text}
        >
          추가하기
        </button>
      </div>
    </div>
  );
}
