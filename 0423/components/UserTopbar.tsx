'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/api';
import type { AuthUser } from '@/lib/types';
import useUIStore from '@/store/uiStore';

interface UserTopbarProps {
  user: AuthUser;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

export default function UserTopbar({ user }: UserTopbarProps) {
  const router = useRouter();
  const searchKeyword = useUIStore((s) => s.searchKeyword);
  const setSearchKeyword = useUIStore((s) => s.setSearchKeyword);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  async function handleLogout() {
    setLogoutError('');
    setIsLoggingOut(true);

    try {
      await logoutUser();
      router.replace('/login');
      router.refresh();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Sign-out failed.');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="topbar topbar-with-user">
      <div className="topbar-left">
        <button type="button" className="menu-toggle-button">
          Menu
        </button>
        <div className="topbar-search-box">
          <input
            type="text"
            placeholder="Search"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
          />
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-user-meta">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
          {logoutError && <span className="topbar-error">{logoutError}</span>}
        </div>

        <div className="topbar-avatar">{getInitials(user.name) || 'U'}</div>

        <button
          type="button"
          className="topbar-logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Signing out...' : 'Logout'}
        </button>
      </div>
    </header>
  );
}
