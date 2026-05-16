import Link from 'next/link';
import clsx from 'clsx';
import type { HomepageLowerModule } from '@/lib/homepage-types';

const ACCENT_MAP: Record<HomepageLowerModule['accent'], string> = {
  pink: 'from-[#ff2d87]/22 to-[#7a1144]/12 border-[#ff2d87]/35 text-[#ff8bc1]',
  amber: 'from-[#ff9d3d]/22 to-[#6e3a08]/14 border-[#ffae53]/35 text-[#ffc28a]',
  violet: 'from-[#8a52ff]/22 to-[#2c1656]/16 border-[#a37bff]/35 text-[#cfb6ff]',
  cyan: 'from-[#3ec8ff]/22 to-[#0a3b54]/16 border-[#3ec8ff]/35 text-[#a4e1ff]',
  lime: 'from-[#9ee04a]/22 to-[#2a4408]/16 border-[#9ee04a]/35 text-[#cbe89a]',
};

export function LowerModulesRow({ items }: { items: HomepageLowerModule[] }) {
  return (
    <section id="lower-modules" aria-label="Tools and modules" className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">More to explore</p>
          <h2 className="mt-2 font-display text-2xl font-black text-white md:text-3xl">
            Que Pasa &amp; the rest of Austin tonight
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-white/68">
          Community, weather, pet-friendly guides, and calendar planning — all meant to feel connected instead of dead-end routes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-label={item.title}
            className={clsx(
              'group relative flex flex-col gap-2 overflow-hidden rounded-[0.9rem] border bg-gradient-to-br p-4 text-left shadow-[0_18px_44px_rgba(0,0,0,0.32)] transition hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70',
              ACCENT_MAP[item.accent],
            )}
          >
            <span aria-hidden className="text-2xl">{item.icon}</span>
            <h3 className="font-display text-lg font-black leading-tight text-white">{item.title}</h3>
            <p className="text-[11.5px] leading-5 text-white/72">{item.caption}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/86 group-hover:text-white">
              Open <span aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
