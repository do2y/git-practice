import type { MenuGroup, SummaryCardData } from './types';

export const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'HOME',
    items: [{ label: '메인페이지', icon: '○', type: 'main' }]
  },
  {
    title: '입고 및 계약',
    items: [
      { label: '견적서 작성', icon: '◻', type: 'sub' },
      { label: '계약 현황', icon: '◻', type: 'sub' },
      { label: '입고 현황', icon: '◻', type: 'sub' }
    ]
  },
  {
    title: '출고',
    items: [
      { label: '출고 요청', icon: '•', type: 'sub' },
      { label: '출고 현황', icon: '•', type: 'sub' }
    ]
  },
  {
    title: '기타',
    items: [
      { label: '공지사항', icon: '≡', type: 'sub' },
      { label: '문의사항', icon: '≡', type: 'sub' },
      { label: '마이페이지', icon: '≡', type: 'sub' }
    ]
  }
];

export const SUMMARY_CARD_MAP: Record<string, SummaryCardData[]> = {
  '메인페이지': [
    {
      title: '보관중인 물품',
      value: '0',
      subText: '출고대기 0 / 냉동 0 / 냉장 0 / 일반 0',
      icon: '□'
    },
    {
      title: '예상 비용',
      value: '0원',
      subText: '현재까지',
      icon: '≡'
    }
  ]
};
