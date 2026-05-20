'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomTabBar, type BottomTab } from '@/components/bottom-tab-bar';

// Route wrapper doctrine:
// BottomTabBar follows the approved mockup's dark/pink premium nav system.

function activeTabForPath(pathname: string): BottomTab {
  if (pathname === '/tonight' || pathname === '/events' || pathname === '/signal') return 'tonight';
  if (pathname === '/venues' || pathname === '/guides') return 'guides';
  if (pathname === '/membership') return 'membership';
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
      onGuides={() => router.push('/guides')}
      onMembership={() => router.push('/membership')}
    />
  );
}
