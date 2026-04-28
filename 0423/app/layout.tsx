// layout.tsx — 루트 레이아웃 (서버 컴포넌트)
// 전역 CSS, Providers, 공통 HTML 구조를 여기서 설정
import type { Metadata } from 'next';
import Providers from './providers';
import '../styles/style.css';
import '../styles/estimate.css';

export const metadata: Metadata = {
  title: '럭키짱레전드충무공마제스티스페셜리스트울트라성모',
  description: '스마트 창고 관리 시스템 — 사용자 대시보드',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
