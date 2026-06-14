import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { HomepageVenueCard } from '@/lib/homepage-types';

const CATEGORY_ICONS: Record<string, string> = {
  'Live Music': '🎸',
  Rooftops: '🌆',
  'Late Eats': '🌮',
  'Good Eats': '🍽',
  Cocktails: '🍸',
  Dancing: '✨',
  Comedy: '🎤',
};

export function EventVenueCardGrid({ items }: { items: HomepageVenueCard[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const hasSite = Boolean(item.websiteUrl);
        return (
          <article
            key={item.id}
            id={item.slug}
            className="group relative flex flex-col overflow-hidden rounded-[0.8rem] border border-[#4b2238] bg-[linear-gradient(180deg,rgba(27,14,23,0.96),rgba(14,9,16,0.98))] shadow-[0_18px_44px_rgba(0,0,0,0.34)] transition hover:border-pink/50 focus-within:border-pink/50"
          >
            <div className="relative aspect-[16/9]">
              {item.image ? (
                <>
                  <Image
                    src={item.image}
                    alt={`${item.category} mood — licensed stock placeholder, not venue-permissioned media`}
                    fill
                    sizes="(max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/18 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,rgba(40,18,32,0.96)_0%,rgba(20,28,52,0.94)_100%)]">
                  <span className="text-3xl opacity-80" aria-hidden>
                    {CATEGORY_ICONS[item.category] ?? '📍'}
                  </span>
                  <span className="absolute bottom-2 right-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
                    {item.category}
                  </span>
                </div>
              )}
              <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[rgba(17,8,14,0.68)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/92">
                <span className="h-1.5 w-1.5 rounded-full bg-pink" />
                {item.statusBadge}
              </div>
            </div>

            <div className="space-y-3 px-4 py-4 text-white">
              {item.timeLabel ? (
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-pink/90">{item.timeLabel}</p>
              ) : null}
              <div>
                {hasSite ? (
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title} — ${item.neighborhood} — open official website (new tab)`}
                    className="after:absolute after:inset-0 after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70"
                  >
                    <h3 className="font-display text-[1.35rem] font-black leading-tight text-white">
                      {item.title} <span aria-hidden className="text-white/50">↗</span>
                    </h3>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    aria-label={`${item.title} — ${item.neighborhood} — see matching picks`}
                    className="after:absolute after:inset-0 after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70"
                  >
                    <h3 className="font-display text-[1.35rem] font-black leading-tight text-white">{item.title}</h3>
                  </Link>
                )}
                <p className="mt-1 text-sm text-white/68">⌖ {item.neighborhood}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#613145] bg-[rgba(255,45,135,0.05)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span
                  className={clsx(
                    'font-semibold',
                    item.availabilityTone === 'hot' && 'text-[#ff8bb8]',
                    item.availabilityTone === 'warm' && 'text-[#ffd38a]',
                    item.availabilityTone === 'steady' && 'text-[#d8c7ff]',
                  )}
                >
                  {item.availabilityLabel}
                </span>
                <Link
                  href={item.href}
                  className="relative z-10 inline-flex rounded-md border border-white/12 bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:border-pink/50 hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70"
                >
                  {item.ctaLabel}
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
