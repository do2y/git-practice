'use client';

import type { EstimateStateReturn } from '@/hooks/useEstimateState';

interface Props {
  state: EstimateStateReturn;
}

export default function EstimateActions({ state }: Props) {
  const { savedEstimateId, handleUpdateStatus, updateStatusMutation, estimateDetailQuery } = state;

  const currentStatus = estimateDetailQuery.data?.status;
  const isPending = updateStatusMutation.isPending;

  if (!savedEstimateId) return null;

  return (
    <div className="estimate-actions">
      <button
        type="button"
        className="estimate-action-btn estimate-action-btn--proceed"
        onClick={() => handleUpdateStatus('진행')}
        disabled={isPending || currentStatus === '진행'}
      >
        진행
      </button>
      <button
        type="button"
        className="estimate-action-btn estimate-action-btn--cancel"
        onClick={() => handleUpdateStatus('취소')}
        disabled={isPending || currentStatus === '취소'}
      >
        취소
      </button>
    </div>
  );
}
