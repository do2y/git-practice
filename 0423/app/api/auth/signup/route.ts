import { NextResponse } from 'next/server';
import { createUser, findUserByEmail, isValidEmail, normalizeEmail } from '@/lib/auth';

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    await createUser({ name, email, password });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created. Please sign in.',
      },
      { status: 201 }
    );
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: string }).code)
        : '';

    if (code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { message: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create account.' },
      { status: 500 }
    );
  }
}
