import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import UserDashboardClient from '@/components/UserDashboardClient';
import AppErrorBoundary from '@/error/AppErrorBoundary';
import { getCurrentAuthUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Smart WMS Dashboard',
};

export default async function DashboardPage() {
  const user = await getCurrentAuthUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <AppErrorBoundary>
      <UserDashboardClient user={user} />
    </AppErrorBoundary>
  );
}
