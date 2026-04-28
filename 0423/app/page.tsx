import { redirect } from 'next/navigation';
import { getCurrentAuthUser } from '@/lib/auth';

export default async function RootPage() {
  const user = await getCurrentAuthUser();
  redirect(user ? '/dashboard' : '/login');
}
jihyun