'use client';

// UserActionPanel — 히어로 배너 + 사용자 액션 모달 (문의하기 / 상품 입고 신청)
//
// Local State: showInquiry, showInbound (모달 열림 상태 — 이 컴포넌트 내부에서만 사용)
// Global UI State: selectedMenu (Zustand에서 직접 읽음 — 배너 제목 표시용)
// Server State: requestMutation, inquiryMutation (props로 전달받음)

import { useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { InboundFormData, InquiryFormData } from '@/lib/types';
import useUIStore from '@/store/uiStore';
import UserInquiryForm from './UserInquiryForm';
import InboundRequestModal from './InboundRequestModal';

interface Props {
  requestMutation: UseMutationResult<{ success: boolean }, Error, InboundFormData>;
  inquiryMutation: UseMutationResult<{ success: boolean }, Error, InquiryFormData>;
}

export default function UserActionPanel({ requestMutation, inquiryMutation }: Props) {
  const selectedMenu = useUIStore((s) => s.selectedMenu);

  // Local State — 모달 열림/닫힘 (이 컴포넌트 내부에서만 필요)
  const [showInquiry, setShowInquiry] = useState(false);
  const [showInbound, setShowInbound] = useState(false);

  return (
    <>
      <section className="hero-banner">
        <h2 className="hero-title">{selectedMenu}</h2>
        <div className="button-group">
          <button
            type="button"
            className="hero-button"
            onClick={() => setShowInquiry(true)}
          >
            문의하기
          </button>
          <button
            type="button"
            className="hero-button"
            onClick={() => setShowInbound(true)}
          >
            상품 입고 신청
          </button>
        </div>
      </section>

      {showInquiry && (
        <UserInquiryForm
          mutation={inquiryMutation}
          onClose={() => setShowInquiry(false)}
        />
      )}

      {showInbound && (
        <InboundRequestModal
          mutation={requestMutation}
          onClose={() => setShowInbound(false)}
        />
      )}
    </>
  );
}
