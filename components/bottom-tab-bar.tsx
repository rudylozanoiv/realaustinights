'use client';

import clsx from 'clsx';

export type BottomTab = 'home' | 'tonight' | 'gems' | 'business';

interface BottomTabBarProps {
  active?: BottomTab | null;
  onHome: () => void;
  onTonight: () => void;
  onGems: () => void;
  onBusiness: () => void;
}

const TABS: { key: BottomTab; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'tonight', label: 'Tonight', icon: '🎯' },
  { key: 'gems', label: 'Gems', icon: '💎' },
  { key: 'business', label: 'Business', icon: '💼' },
];

// Visual doctrine:
// BottomTabBar should match the approved Real AustiNights mockup system — dark shell,
// white editorial inactive type, pink/magenta active nav accent, muted rose glow.
// Old placeholder-site palette choices are not visual authority.

export function BottomTabBar({
  active,
  onHome,
  onTonight,
  onGems,
  onBusiness,
}: BottomTabBarProps) {
  const handlers: Record<BottomTab, () => void> = {
    home: onHome,
    tonight: onTonight,
    gems: onGems,
    business: onBusiness,
  };

  return (
    // lg:hidden (not md:hidden) — iPhone landscape is 844px wide, above Tailwind's md
    // breakpoint (768px), which was stripping the nav entirely in landscape.
    // z-50 so the bar sits above sidebar/overlay elements at mobile viewports.
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[rgba(9,14,29,0.82)] shadow-[0_-8px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid h-[60px] grid-cols-4">
        {TABS.map(t => {
          const isActive = active === t.key;
          return (
            <li key={t.key}>
              <button
                type="button"
                onClick={handlers[t.key]}
                aria-label={t.label}
                aria-current={isActive ? 'page' : undefined}
                className={clsx(
                  'relative flex h-full w-full flex-col items-center justify-center gap-0.5 overflow-hidden transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70',
                  isActive
                    ? 'bg-white/[0.03] text-pink before:absolute before:inset-x-3 before:top-1.5 before:h-0.5 before:rounded-full before:bg-pink before:shadow-[0_0_10px_rgba(255,105,180,0.55)]'
                    : 'text-white/68 hover:bg-white/[0.03] hover:text-white/90',
                )}
              >
                <span
                  aria-hidden
                  className={clsx('text-xl leading-none transition-opacity', isActive ? 'opacity-100' : 'opacity-80')}
                >
                  {t.icon}
                </span>
                <span className="font-display text-[10px] font-bold uppercase tracking-wide">
                  {t.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
