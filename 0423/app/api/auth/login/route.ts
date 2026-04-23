import { NextResponse } from 'next/server';
import {
  authenticateUser,
  isValidEmail,
  normalizeEmail,
  setAuthCookie,
  signAuthToken,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = await signAuthToken(user);
    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully.',
      user,
    });

    return setAuthCookie(response, token);
  } catch {
    return NextResponse.json({ message: 'Failed to sign in.' }, { status: 500 });
  }
}
