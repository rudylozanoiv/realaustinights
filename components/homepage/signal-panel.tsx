import Link from 'next/link';
import clsx from 'clsx';
import type { HomepageSignalItem } from '@/lib/homepage-types';

function signalHrefForDistrict(district?: string) {
  if (!district) return '/signal';
  const slug = district.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `/signal?district=${slug}`;
}

// HONESTY SWEEP 2026-06-27: heatChipClass + heatRowClass removed — they existed only to style the
// fabricated heatLabel (Hot/Warm/Steady) chips and row tint. Gated off /tonight to match the befb632
// /signal sweep (fabricated heat/trend hidden until real source-fed signal data exists).

export function SignalPanel({ items }: { items: HomepageSignalItem[] }) {
  const sorted = [...items].sort((a, b) => a.rank - b.rank);
  const lead = sorted[0];
  const supporting = sorted.slice(1, 3);

  return (
    <aside
      aria-label="The Signal"
      className="rounded-[1rem] border border-[#5f2443] bg-[linear-gradient(180deg,rgba(24,12,20,0.96),rgba(14,8,14,0.98))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.34),0_0_28px_rgba(255,45,135,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink/72">District pulse</p>
            <span className="rounded-full border border-pink/30 bg-pink/10 px-2 py-[2px] text-[9px] font-black uppercase tracking-[0.18em] text-pink">
              Preview
            </span>
          </div>
          <h3 className="mt-1 font-display text-[1.65rem] font-black text-white">The Signal</h3>
          <p className="mt-1.5 text-[13px] leading-5 text-white/58">Preview snapshot of Austin&apos;s district energy.</p>
        </div>
        <Link href="/signal" className="mt-1 shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-pink/88 hover:text-pink">
          View Signal Preview ↗
        </Link>
      </div>

      {lead ? (
        <Link
          href={signalHrefForDistrict(lead.district)}
          className="group mt-5 block overflow-hidden rounded-[0.95rem] border border-pink/30 bg-[linear-gradient(135deg,rgba(255,45,135,0.10)_0%,rgba(40,12,28,0.85)_60%,rgba(18,10,20,0.95)_100%)] p-4 transition hover:border-pink/55"
          aria-label={`Open ${lead.district} on The Signal`}
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-pink/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-pink">
              Tonight&apos;s lead
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/44">
              Rank {String(lead.rank).padStart(2, '0')}
            </span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-[1.55rem] font-black leading-tight text-white">{lead.district}</p>
              {/* HONESTY SWEEP 2026-06-27: fabricated trendLabel ("Very High Energy" etc.) removed; categoryHint kept. */}
              <p className="mt-1 text-[12px] leading-5 text-white/64">
                {lead.categoryHint}
              </p>
            </div>
            {/* HONESTY SWEEP 2026-06-27: heatLabel chip (Hot/Warm/Steady) is fabricated heat — gated off until real signal data. */}
          </div>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-pink/80 group-hover:text-pink">
            Open district view ↗
          </p>
        </Link>
      ) : null}

      {supporting.length > 0 ? (
        <ul className="mt-3 grid gap-2.5">
          {supporting.map((item) => (
            <li key={item.id}>
              {/* HONESTY SWEEP 2026-06-27: fabricated heatLabel row tint collapsed to one neutral color. */}
              <Link
                href={signalHrefForDistrict(item.district)}
                className={clsx(
                  'flex items-center gap-3 rounded-[0.85rem] border border-white/8 bg-[rgba(255,255,255,0.02)] px-3 py-2.5 transition hover:border-white/18 hover:bg-[rgba(255,255,255,0.04)]',
                )}
              >
                <span className="font-display text-[1rem] font-black text-pink/80">
                  {String(item.rank).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[0.98rem] font-black text-white">{item.district}</p>
                  {/* HONESTY SWEEP 2026-06-27: fabricated trendLabel removed; categoryHint kept. */}
                  <p className="mt-0.5 text-[11px] text-white/56">{item.categoryHint}</p>
                </div>
                {/* HONESTY SWEEP 2026-06-27: heatLabel chip is fabricated heat — gated off until real signal data. */}
                <span className="text-white/30">›</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-4 text-[11px] leading-5 text-white/52">
        Map, district notes, and methodology continue on{' '}
        <Link href="/signal" className="font-semibold text-pink/80 hover:text-pink">
          The Signal
        </Link>
        .
      </p>

      <p className="mt-3 text-[10px] leading-[1.5] text-white/40">
        Preview only — district rankings are a curated preview, not source-fed real-time nightlife data yet.
      </p>
    </aside>
  );
}
