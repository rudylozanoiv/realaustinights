import Image from 'next/image';
import Link from 'next/link';
import type { HomepageImageRailItem } from '@/lib/homepage-types';

export function PeoplePlacesImageRail({ items }: { items: HomepageImageRailItem[] }) {
  return (
    <section id="people-places" className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">People + Places</p>
          <h2 className="mt-2 font-display text-3xl font-black text-white">¡Vive Austin!</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-white/72">
          This rail keeps the product framed as social/editorial nightlife — licensed stock placeholders now; venue-permissioned local media comes later.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="min-w-[280px] max-w-[280px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[rgba(255,255,255,0.04)] shadow-[0_18px_44px_rgba(6,10,24,0.28)] md:min-w-[320px] md:max-w-[320px]"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={item.image}
                alt={`${item.category} in ${item.neighborhood}`}
                fill
                sizes="320px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/64">{item.category} • {item.neighborhood}</p>
                <p className="mt-2 font-display text-xl font-black text-white">{item.caption}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3 text-[11px] font-semibold text-white/56">
              <span>{item.rightsStatus}</span>
              <span>{item.attribution}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
