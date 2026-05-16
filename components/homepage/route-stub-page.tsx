import Link from 'next/link';
import { HOMEPAGE_NAV_ITEMS } from '@/lib/homepage-mock-data';
import { RouteLockedHeader } from './route-locked-header';
import { RouteBottomTabBar } from './route-bottom-tab-bar';
import { getRoutePillNavLinkClasses } from './nav-state-styles';

interface RouteStubPageProps {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  cards: Array<{
    title: string;
    body: string;
  }>;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  currentPath: string;
}

export function RouteStubPage({
  eyebrow,
  title,
  description,
  highlights,
  cards,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  currentPath,
}: RouteStubPageProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#080d18_0%,#11182b_24%,#16142b_56%,#0e1324_100%)] text-white">
      <RouteLockedHeader currentPath={currentPath} />

      <main className="px-4 py-8 pb-24 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white/82 transition hover:bg-white/10"
            >
              ← Back to Real AustiNights
            </Link>

            <nav className="flex flex-wrap gap-2" aria-label="Section routes">
              {HOMEPAGE_NAV_ITEMS.map((item) => {
                const isActive = item.href === currentPath;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={getRoutePillNavLinkClasses(isActive)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(11,15,28,0.96)_0%,rgba(25,16,36,0.94)_36%,rgba(20,32,56,0.92)_100%)] px-6 py-10 shadow-[0_30px_80px_rgba(7,10,21,0.45)] md:px-8 md:py-12">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 md:text-base">{description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-semibold text-white/76"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5 shadow-[0_18px_42px_rgba(7,10,21,0.24)]"
              >
                <h2 className="font-display text-2xl font-black text-white">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/72">{card.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryCtaHref}
              className="rounded-full bg-pink px-5 py-3 text-sm font-bold text-white shadow-[0_18px_32px_rgba(255,105,180,0.3)] hover:brightness-110"
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaHref}
              className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
            >
              {secondaryCtaLabel}
            </Link>
            <Link
              href="/community-guidelines"
              className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
            >
              Community Guidelines
            </Link>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[rgba(0,122,122,0.14)] p-4 text-sm leading-7 text-white/78">
            Curated / permissioned imagery first. No unmoderated uploads at launch. Homepage shell remains locked while these routes act as intentional next-step destinations.
          </div>
          </section>
        </div>
      </main>

      <RouteBottomTabBar />
    </div>
  );
}
