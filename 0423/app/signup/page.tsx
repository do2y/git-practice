import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SignupForm from '@/components/SignupForm';
import { getCurrentAuthUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Sign Up | Smart WMS',
};

export default async function SignupPage() {
  const user = await getCurrentAuthUser();

  if (user) {
    redirect('/dashboard');
  }

  return <SignupForm />;
}
