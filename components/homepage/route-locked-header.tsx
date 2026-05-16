'use client';

import { HOMEPAGE_NAV_ITEMS } from '@/lib/homepage-mock-data';
import { LockedHeader } from './locked-header';
import { useAuthSessionState } from './use-auth-session-state';

interface RouteLockedHeaderProps {
  currentPath: string;
}

export function RouteLockedHeader({ currentPath }: RouteLockedHeaderProps) {
  const { isAuthenticated, handleSignOut } = useAuthSessionState();

  return (
    <LockedHeader
      navItems={HOMEPAGE_NAV_ITEMS}
      isAuthenticated={isAuthenticated}
      onSignOutClick={handleSignOut}
      currentPath={currentPath}
      signUpHref="/#signup"
    />
  );
}
