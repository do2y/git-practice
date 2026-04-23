'use client';

// UserInquiryForm — 문의 접수 모달
// Local State: form 입력값 (이름, 이메일, 내용) — 이 컴포넌트 내부에서만 사용
// Server State: inquiryMutation (React Query Mutation) — 부모에서 props로 전달

import { useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { InquiryFormData } from '@/lib/types';

interface Props {
  mutation: UseMutationResult<{ success: boolean }, Error, InquiryFormData>;
  onClose: () => void;
}

export default function UserInquiryForm({ mutation, onClose }: Props) {
  // Local State — 문의 폼 입력값
  const [form, setForm] = useState<InquiryFormData>({
    name: '',
    email: '',
    message: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">문의하기</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {mutation.isSuccess ? (
            <p className="modal-success-text">
              문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-field">
                <label className="modal-label">이름</label>
                <input
                  className="modal-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">이메일</label>
                <input
                  className="modal-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">문의 내용</label>
                <textarea
                  className="modal-textarea"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="문의 내용을 입력하세요"
                  required
                />
              </div>
              {mutation.isError && (
                <p className="status-text error-text">{mutation.error?.message}</p>
              )}
              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={onClose}>
                  취소
                </button>
                <button
                  type="submit"
                  className="modal-btn-submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? '접수 중...' : '문의 접수'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
