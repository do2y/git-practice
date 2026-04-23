'use client';

// Global UI State — Zustand
// selectedMenu, searchKeyword는 여러 컴포넌트가 동시에 참조하는 전역 UI 상태
// 서버 데이터가 아니므로 React Query가 아닌 Zustand로 관리
import { create } from 'zustand';

interface UIState {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;

  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

const useUIStore = create<UIState>((set) => ({
  selectedMenu: '메인페이지',
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),

  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}));

export default useUIStore;
