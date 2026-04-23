'use client';

// UserSummarySection — 요약 카드 그리드
// Server State(summaryCards)를 props로 받아 렌더링
// isLoading / error 상태도 받아서 섹션 단위로 표현
import type { SummaryCardData } from '@/lib/types';
import SummaryCard from './SummaryCard';

interface Props {
  cards: SummaryCardData[];
  isLoading: boolean;
  error: Error | null;
}

export default function UserSummarySection({ cards, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <div className="summary-grid">
        {[0, 1].map((i) => (
          <div key={i} className="summary-card" style={{ opacity: 0.4 }}>
            <p className="summary-card-title">불러오는 중...</p>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="summary-grid">
        <div className="summary-card">
          <p className="status-text error-text">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          subText={card.subText}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
