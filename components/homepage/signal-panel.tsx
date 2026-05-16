import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { HomepageSignalItem } from '@/lib/homepage-types';

export function SignalPanel({ items }: { items: HomepageSignalItem[] }) {
  const rankedItems = [...items].sort((a, b) => a.rank - b.rank).slice(0, 3);

  return (
    <aside
      aria-label="The Signal"
      className="rounded-[0.9rem] border border-[#6b2348] bg-[linear-gradient(180deg,rgba(22,11,18,0.96),rgba(14,8,14,0.98))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.38),0_0_40px_rgba(255,45,135,0.1)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-[1.9rem] font-black text-white">The Signal</h3>
          <p className="mt-2 text-sm leading-6 text-white/62">Real-time pulse of Austin&apos;s nightlife.</p>
          <p className="text-sm leading-6 text-white/62">Where the city&apos;s energy is highest.</p>
        </div>
        <Link href="/tonight" className="mt-1 text-xs font-semibold text-pink hover:underline">
          Trending Tonight ↗
        </Link>
      </div>

      <div className="mt-5 divide-y divide-white/8 rounded-[0.9rem] border border-white/8 bg-[rgba(255,255,255,0.02)]">
        {rankedItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-[rgba(255,255,255,0.04)]"
          >
            <span className="w-5 text-base font-black text-pink">{item.rank}</span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-black text-white">{item.district}</p>
              <p className="mt-1 text-sm text-white/64">{item.trendLabel}</p>
            </div>
            <span
              className={clsx(
                'rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]',
                item.heatLabel === 'Hot' && 'bg-pink text-white',
                item.heatLabel === 'Warm' && 'bg-[#5c243f] text-[#ffd38a]',
                item.heatLabel === 'Steady' && 'bg-[#362447] text-[#e6d5ff]',
              )}
            >
              {item.heatLabel}
            </span>
            <span className="text-white/32">›</span>
          </Link>
        ))}
      </div>

      <div className="relative mt-5 overflow-hidden rounded-[0.9rem] border border-pink/20 bg-[#0e0710] p-3.5">
        <div className="relative aspect-[268/150] w-full overflow-hidden rounded-[0.8rem] border border-white/8">
          <Image
            src="/assets/goldmaster-signal-map-crop.png"
            alt="Real AustiNights signal map — hotspots across downtown, East Austin, Rainey, South Congress"
            fill
            sizes="(min-width: 1024px) 340px, 100vw"
            className="object-cover"
          />

          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              aria-label={`Signal hotspot ${item.district}`}
              title={item.district}
              className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70"
              style={{ left: item.mapX, top: item.mapY }}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
