'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveEstimate, fetchEstimateDetail, updateEstimateStatus } from '@/lib/estimateApi';
import type { EstimateFormData } from '@/types/estimate';
import type { EstimateItemFormData } from '@/types/estimate-item';

const defaultForm: EstimateFormData = {
  item_name: '',
  contact_number: '',
  product_name: '',
  product_quantity: '',
  region_name: '',
  item_type: '',
  pallet_count: '',
  caution_text: '',
};

const defaultItemForm: EstimateItemFormData = {
  item_name: '',
  quantity_text: '',
  warehouse_name: '',
  storage_type: '',
  remark: '',
};

export function useEstimateState() {
  const queryClient = useQueryClient();

  // ─── Local State ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState<EstimateFormData>(defaultForm);
  const [itemForm, setItemForm] = useState<EstimateItemFormData>(defaultItemForm);
  const [items, setItems] = useState<EstimateItemFormData[]>([]);
  const [savedEstimateId, setSavedEstimateId] = useState<number | null>(null);

  // ─── Server State: 저장된 견적 상세 조회 ─────────────────────────────────
  // savedEstimateId가 생긴 이후에만 활성화
  const estimateDetailQuery = useQuery({
    queryKey: ['estimate', savedEstimateId],
    queryFn: () => fetchEstimateDetail(savedEstimateId!),
    enabled: !!savedEstimateId,
  });

  // ─── Mutation: 견적 저장 ──────────────────────────────────────────────────
  const saveEstimateMutation = useMutation({
    mutationFn: () => saveEstimate({ form, items }),
    onSuccess: (data) => {
      setSavedEstimateId(data.id);
      queryClient.invalidateQueries({ queryKey: ['estimate', data.id] });
    },
  });

  // ─── Mutation: 견적 상태 변경 ─────────────────────────────────────────────
  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => updateEstimateStatus(savedEstimateId!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimate', savedEstimateId] });
    },
  });

  // ─── 핸들러 ──────────────────────────────────────────────────────────────
  function handleFormChange(field: keyof EstimateFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleItemFormChange(field: keyof EstimateItemFormData, value: string) {
    setItemForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAddItem() {
    if (!itemForm.item_name || !itemForm.quantity_text) return;
    setItems((prev) => [...prev, { ...itemForm }]);
    setItemForm(defaultItemForm);
  }

  function handleSave() {
    saveEstimateMutation.mutate();
  }

  function handleUpdateStatus(status: string) {
    if (!savedEstimateId) return;
    updateStatusMutation.mutate(status);
  }

  return {
    // 폼 상태
    form,
    handleFormChange,
    // 품목 입력 상태
    itemForm,
    handleItemFormChange,
    // 품목 목록
    items,
    handleAddItem,
    // 저장 / 상태변경
    handleSave,
    handleUpdateStatus,
    // 뮤테이션 상태
    saveEstimateMutation,
    updateStatusMutation,
    // 저장된 견적 조회
    savedEstimateId,
    estimateDetailQuery,
  };
}

export type EstimateStateReturn = ReturnType<typeof useEstimateState>;
