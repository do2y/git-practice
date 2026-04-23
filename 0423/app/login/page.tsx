import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { getCurrentAuthUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Login | Smart WMS',
};

export default async function LoginPage() {
  const user = await getCurrentAuthUser();

  if (user) {
    redirect('/dashboard');
  }

  return <LoginForm />;
}
