'use client';

// useUserDashboardState — 사용자 대시보드 전담 상태 관리 훅
//
// 상태 계층 구조:
//   Local State     → 모달 열림/닫힘, 폼 입력값 (각 컴포넌트 내부 useState)
//   Lifecycle       → useEffect: 브라우저 탭 제목 동기화
//   Global UI State → Zustand: selectedMenu, searchKeyword
//   Server State    → React Query: inventoryQuery, summaryQuery, requestMutation
//
// 이 훅은 Server State + Lifecycle만 담당
// UI 컴포넌트는 반환값(데이터 + 핸들러)만 props로 전달받아 사용

import { useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createInventoryItem,
  fetchInventoryRows,
  fetchSummaryCards,
  submitInquiry,
} from '@/lib/api';
import type { InboundFormData, InquiryFormData, InventoryItem } from '@/lib/types';
import useUIStore from '@/store/uiStore';

function normalizeText(value: string | number | undefined): string {
  return String(value ?? '').toLowerCase().trim();
}

export function useUserDashboardState() {
  const queryClient = useQueryClient();

  // Global UI State — Zustand에서 직접 구독 (props 없이)
  const selectedMenu = useUIStore((s) => s.selectedMenu);
  const searchKeyword = useUIStore((s) => s.searchKeyword);

  // Component Lifecycle — 메뉴 변경 시 브라우저 탭 제목 갱신
  useEffect(() => {
    document.title = `Smart WMS - ${selectedMenu}`;
  }, [selectedMenu]);

  // ─── Server State: 재고 목록 ───────────────────────────────────────────────
  const inventoryQuery = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventoryRows,
    staleTime: 10_000,
  });

  // ─── Server State: 메뉴별 요약 카드 ──────────────────────────────────────
  // queryKey에 selectedMenu 포함 → 메뉴 바뀌면 자동 재조회
  const summaryQuery = useQuery({
    queryKey: ['summaryCards', selectedMenu],
    queryFn: () => fetchSummaryCards(selectedMenu),
    staleTime: 10_000,
  });

  // ─── Mutation: 상품 입고 신청 ─────────────────────────────────────────────
  const requestMutation = useMutation({
    mutationFn: createInventoryItem,

    // Optimistic Update — 서버 응답 전에 목록에 즉시 반영
    onMutate: async (newItem: InboundFormData) => {
      await queryClient.cancelQueries({ queryKey: ['inventory'] });
      const previousInventory = queryClient.getQueryData<InventoryItem[]>(['inventory']);

      queryClient.setQueryData<InventoryItem[]>(['inventory'], (old) => [
        {
          id: Date.now(),
          ...newItem,
          expectedAmount:
            Number(newItem.expectedAmount).toLocaleString('ko-KR') + '원',
        },
        ...(old ?? []),
      ]);

      return { previousInventory };
    },

    // 실패 시 롤백
    onError: (_err, _newItem, context) => {
      if (context?.previousInventory) {
        queryClient.setQueryData(['inventory'], context.previousInventory);
      }
    },

    // Query Invalidation — 서버 기준 최신 데이터로 재조회
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['summaryCards', selectedMenu] });
    },
  });

  // ─── Mutation: 문의 접수 ──────────────────────────────────────────────────
  const inquiryMutation = useMutation({
    mutationFn: (formData: InquiryFormData) => submitInquiry(formData),
  });

  // ─── 파생 데이터: 검색어 기반 필터링 ────────────────────────────────────
  const summaryCards = useMemo(
    () => summaryQuery.data?.main ?? [],
    [summaryQuery.data]
  );

  const filteredInventoryRows = useMemo(() => {
    const rows = inventoryQuery.data ?? [];
    const keyword = normalizeText(searchKeyword);
    if (!keyword) return rows;
    return rows.filter((row) =>
      [
        row.productName,
        row.category,
        row.storagePeriod,
        row.inboundDate,
        row.outboundDueDate,
        row.status,
        row.location,
        row.expectedAmount,
      ].some((field) => normalizeText(field).includes(keyword))
    );
  }, [inventoryQuery.data, searchKeyword]);

  return {
    summaryCards,
    filteredInventoryRows,
    inventoryQuery,
    summaryQuery,
    requestMutation,
    inquiryMutation,
  };
}
