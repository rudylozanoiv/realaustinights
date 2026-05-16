import Link from 'next/link';
import { PeoplePlacesImageRail } from '@/components/homepage/people-places-image-rail';
import { RouteBottomTabBar } from '@/components/homepage/route-bottom-tab-bar';
import { RouteLockedHeader } from '@/components/homepage/route-locked-header';
import { HOMEPAGE_IMAGE_RAIL, HOMEPAGE_LOWER_MODULES } from '@/lib/homepage-mock-data';

const guideCards = [
  {
    title: 'Date night that still feels Austin',
    body: 'Start with rooftops, cocktails, and live music instead of generic chain recommendations.',
  },
  {
    title: 'Comedy + late-night pairing',
    body: 'Use comedy clubs and late eats as one route instead of separate research sessions.',
  },
  {
    title: 'Pet-friendly planning',
    body: 'Dog-friendly patios and easy social stops deserve a real home, not a buried afterthought.',
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#080d18_0%,#11182b_24%,#16142b_56%,#0e1324_100%)] text-white">
      <RouteLockedHeader currentPath="/guides" />

      <main className="px-4 py-8 pb-24 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white/82 transition hover:bg-white/10"
            >
              ← Back to Real AustiNights
            </Link>

            <div className="rounded-full border border-pink/30 bg-pink/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-pink">
              Editorial guides
            </div>
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(11,15,28,0.96)_0%,rgba(25,16,36,0.94)_36%,rgba(20,32,56,0.92)_100%)] px-6 py-10 shadow-[0_30px_80px_rgba(7,10,21,0.45)] md:px-8 md:py-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">Guides</p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">Guides for a better night out</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
              Date night, comedy, pet-friendly hangs, and local texture — organized like a guide, not a pile of tabs.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {guideCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(23,11,22,0.96),rgba(13,9,16,0.98))] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.32)]"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink/84">Guide lane</p>
                <h2 className="mt-3 font-display text-2xl font-black text-white">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/72">{card.body}</p>
              </article>
            ))}
          </section>

          <PeoplePlacesImageRail items={HOMEPAGE_IMAGE_RAIL} />

          <section className="grid gap-3 rounded-[1.6rem] border border-white/10 bg-white/6 p-4 text-sm text-white/78 md:grid-cols-3">
            {HOMEPAGE_LOWER_MODULES.filter((item) => item.href !== '/guides').slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="rounded-[1.1rem] border border-white/10 bg-black/12 px-4 py-4 transition hover:bg-white/8"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink/84">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/72">{item.caption}</p>
              </Link>
            ))}
          </section>
        </div>
      </main>

      <RouteBottomTabBar />
    </div>
  );
}
