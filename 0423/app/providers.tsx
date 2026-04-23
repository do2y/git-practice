'use client';

// providers.tsx — 전역 Provider 연결
// React Query, 추후 추가될 Provider를 여기서 한곳에 관리
// layout.tsx에서 이 컴포넌트로 children을 감싸 전역 적용

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient는 컴포넌트 내 useState로 생성
  // → 요청마다 새 인스턴스가 생성되지 않도록 보장
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10_000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
