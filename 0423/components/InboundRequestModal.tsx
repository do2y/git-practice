'use client';

// InboundRequestModal — 상품 입고 신청 모달
// Local State: form 입력값 — 이 컴포넌트 내부에서만 사용
// Server State: requestMutation (React Query Mutation) — 부모에서 props로 전달
// Optimistic Update: mutate 호출 → useUserDashboardState의 onMutate에서 즉시 반영

import { useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { InboundFormData } from '@/lib/types';

interface Props {
  mutation: UseMutationResult<{ success: boolean }, Error, InboundFormData>;
  onClose: () => void;
}

const INITIAL_FORM: InboundFormData = {
  productInitial: '',
  productName: '',
  category: '일반',
  status: '보관',
  location: '',
  storagePeriod: '',
  inboundDate: '',
  outboundDueDate: '',
  expectedAmount: '',
};

export default function InboundRequestModal({ mutation, onClose }: Props) {
  // Local State — 입고 신청 폼 입력값
  const [form, setForm] = useState<InboundFormData>(INITIAL_FORM);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">상품 입고 신청</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-grid">
              <div className="modal-field">
                <label className="modal-label">상품 이니셜</label>
                <input
                  className="modal-input"
                  name="productInitial"
                  value={form.productInitial}
                  onChange={handleChange}
                  placeholder="예: 장"
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">상품명</label>
                <input
                  className="modal-input"
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  placeholder="상품명을 입력하세요"
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">보관 위치</label>
                <input
                  className="modal-input"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="예: 서울-A-10-47"
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">보관 기간</label>
                <input
                  className="modal-input"
                  name="storagePeriod"
                  value={form.storagePeriod}
                  onChange={handleChange}
                  placeholder="예: 30일"
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">입고일</label>
                <input
                  className="modal-input"
                  type="date"
                  name="inboundDate"
                  value={form.inboundDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">출고 예정일</label>
                <input
                  className="modal-input"
                  type="date"
                  name="outboundDueDate"
                  value={form.outboundDueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">예상 이용료 (원)</label>
                <input
                  className="modal-input"
                  type="number"
                  name="expectedAmount"
                  value={form.expectedAmount}
                  onChange={handleChange}
                  placeholder="숫자만 입력"
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">분류</label>
                <select
                  className="modal-input"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="일반">일반</option>
                  <option value="냉장">냉장</option>
                  <option value="냉동">냉동</option>
                </select>
              </div>
              <div className="modal-field">
                <label className="modal-label">상태</label>
                <select
                  className="modal-input"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="보관">보관</option>
                  <option value="출고 대기">출고 대기</option>
                  <option value="출고 완료">출고 완료</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="modal-btn-cancel" onClick={onClose}>
                취소
              </button>
              <button type="submit" className="modal-btn-submit">
                신청
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
