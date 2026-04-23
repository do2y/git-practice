'use client';

// AppErrorBoundary — 렌더링 오류 전체 화면 보호
//
// status-panel의 에러 텍스트와 역할 구분:
//   status-panel     → React Query 네트워크/API 오류
//   AppErrorBoundary → 컴포넌트 렌더링 자체가 throw한 오류 (null 접근, 구조 불일치 등)
//
// 사용법: <AppErrorBoundary><UserInventoryTable /></AppErrorBoundary>
// → 테이블이 터져도 카드, 사이드바는 정상 동작

import React from 'react';
import ErrorFallback from '@/components/ErrorFallback';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('AppErrorBoundary caught:', error, info);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          message={this.state.error?.message}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}

export default AppErrorBoundary;
