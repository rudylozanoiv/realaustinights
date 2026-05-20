import Link from 'next/link';
import clsx from 'clsx';
import type { HomepageLowerModule } from '@/lib/homepage-types';

const ACCENT_RING: Record<HomepageLowerModule['accent'], string> = {
  pink: 'hover:border-pink/40 hover:bg-[rgba(255,45,135,0.06)] hover:text-white',
  amber: 'hover:border-[#ffae53]/40 hover:bg-[rgba(255,174,83,0.06)] hover:text-white',
  violet: 'hover:border-[#a37bff]/40 hover:bg-[rgba(163,123,255,0.06)] hover:text-white',
  cyan: 'hover:border-[#3ec8ff]/40 hover:bg-[rgba(62,200,255,0.06)] hover:text-white',
  lime: 'hover:border-[#9ee04a]/40 hover:bg-[rgba(158,224,74,0.06)] hover:text-white',
};

export function TopModulesPillStrip({ items }: { items: HomepageLowerModule[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Editorial sections"
      className="flex flex-wrap items-center gap-2"
    >
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          aria-label={item.title}
          className={clsx(
            'group inline-flex min-w-[132px] flex-1 items-center gap-2.5 rounded-[0.95rem] border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2 text-left text-white/78 shadow-[0_8px_18px_rgba(0,0,0,0.16)] backdrop-blur-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70 sm:flex-none sm:rounded-full sm:px-3.5 sm:py-1.5 lg:min-w-0 lg:flex-none',
            ACCENT_RING[item.accent],
          )}
        >
          <span aria-hidden className="text-[15px] leading-none">{item.icon}</span>
          <span className="flex min-w-0 flex-col">
            {item.eyebrow ? (
              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-white/40">{item.eyebrow}</span>
            ) : null}
            <span className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-white/86">{item.title}</span>
          </span>
          {item.honestyLabel ? (
            <span className="ml-auto hidden rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] text-white/46 sm:inline-flex group-hover:text-white/68">
              {item.honestyLabel}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
