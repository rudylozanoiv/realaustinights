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
      className="fixed inset-x-0 bottom-0 z-50 border-t-[3px] border-navy bg-cream shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden"
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
                  'flex h-full w-full flex-col items-center justify-center gap-0.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal',
                  isActive
                    ? 'bg-teal-light text-teal [text-shadow:0_0_8px_rgba(0,122,122,0.4)]'
                    : 'text-ink-mid hover:bg-cream',
                )}
              >
                <span aria-hidden className="text-xl leading-none">{t.icon}</span>
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
