'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomTabBar, type BottomTab } from '@/components/bottom-tab-bar';

// Route wrapper doctrine:
// BottomTabBar follows the approved mockup's dark/pink premium nav system.

function activeTabForPath(pathname: string): BottomTab {
  if (pathname === '/tonight' || pathname === '/events') return 'tonight';
  if (pathname === '/venues' || pathname === '/guides') return 'gems';
  if (pathname === '/membership') return 'business';
  return 'home';
}

export function RouteBottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const active = activeTabForPath(pathname);

  return (
    <BottomTabBar
      active={active}
      onHome={() => router.push('/')}
      onTonight={() => router.push('/tonight')}
      onGems={() => router.push('/guides')}
      onBusiness={() => router.push('/membership')}
    />
  );
}
