import { NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentAuthUser();

  if (!user) {
    return NextResponse.json(
      { message: 'Authentication required.' },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, user });
}
