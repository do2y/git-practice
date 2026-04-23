import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import EstimateClient from '@/components/estimate/EstimateClient';
import AppErrorBoundary from '@/error/AppErrorBoundary';
import { getCurrentAuthUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Smart WMS - 견적서 작성',
};

export default async function EstimatePage() {
  const user = await getCurrentAuthUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <AppErrorBoundary>
      <EstimateClient user={user} />
    </AppErrorBoundary>
  );
}
