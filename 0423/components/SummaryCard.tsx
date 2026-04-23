// SummaryCard — 순수 표시 컴포넌트 (상태 없음, props만 받아 렌더링)
import type { SummaryCardData } from '@/lib/types';

type Props = Pick<SummaryCardData, 'title' | 'value' | 'subText' | 'icon'>;

export default function SummaryCard({ title, value, subText, icon }: Props) {
  return (
    <article className="summary-card">
      <div className="summary-card-top">
        <h3 className="summary-card-title">{title}</h3>
        {icon && <div className="summary-card-icon-box">{icon}</div>}
      </div>
      <div className="summary-card-body">
        <p className="summary-card-value">{value}</p>
        {subText && <p className="summary-card-subtext">{subText}</p>}
      </div>
    </article>
  );
}
