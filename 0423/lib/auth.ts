import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth-cookie';
import pool from '@/lib/db';
import type { AuthTokenPayload, AuthUser } from '@/lib/types';

export { AUTH_COOKIE_NAME } from '@/lib/auth-cookie';

const TOKEN_TTL_SECONDS = 60 * 60 * 24;

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || 'change-this-jwt-secret-in-env';
  return new TextEncoder().encode(secret);
}

function toAuthUser(row: Pick<UserRow, 'id' | 'name' | 'email' | 'role'>): AuthUser {
  return {
    userId: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
  };
}

function isAuthPayload(payload: unknown): payload is AuthTokenPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as Partial<AuthTokenPayload>;

  return (
    typeof candidate.userId === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.role === 'string'
  );
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function ensureUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(191) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_email (email)
    )
  `);
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  await ensureUsersTable();

  const [rows] = await pool.query<UserRow[]>(
    `
      SELECT id, name, email, password_hash, role
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [normalizeEmail(email)]
  );

  return rows[0] ?? null;
}

export async function createUser({
  name,
  email,
  password,
  role = 'user',
}: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<AuthUser> {
  await ensureUsersTable();

  const trimmedName = name.trim();
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = await bcrypt.hash(password, 10);

  const [result] = await pool.query<ResultSetHeader>(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `,
    [trimmedName, normalizedEmail, passwordHash, role]
  );

  return {
    userId: result.insertId,
    name: trimmedName,
    email: normalizedEmail,
    role,
  };
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return null;
  }

  return toAuthUser(user);
}

export async function signAuthToken(user: AuthUser) {
  return new SignJWT({
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    if (!isAuthPayload(payload)) {
      return null;
    }

    return {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TOKEN_TTL_SECONDS,
  });

  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
