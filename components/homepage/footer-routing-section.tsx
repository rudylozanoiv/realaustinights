import Link from 'next/link';

export function FooterRoutingSection() {
  return (
    <section id="membership" className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(7,11,24,0.96),rgba(18,48,78,0.92),rgba(0,122,122,0.78))] px-5 py-8 shadow-[0_24px_60px_rgba(6,10,24,0.34)] md:px-8 md:py-10">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_.9fr] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-200">Preview access · local business path</p>
          <h2 className="mt-3 font-display text-3xl font-black text-white md:text-4xl">
            Built to promote real Austin nights — and the businesses behind them.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
            Phase 1 keeps the social/local-business framing visible while account creation stays in controlled testing. No account is needed to browse this preview; membership numbering and contributor badges land after auth and bot-protection readiness clear.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/membership"
              className="rounded-full bg-pink px-5 py-3 text-sm font-bold text-white shadow-[0_18px_32px_rgba(255,105,180,0.3)] hover:brightness-110"
            >
              How preview access works
            </Link>
            <Link
              href="/community-guidelines"
              className="rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-semibold text-white hover:bg-white/12"
            >
              Community Guidelines
            </Link>
          </div>
        </div>

        <div className="grid gap-3 rounded-[1.6rem] border border-white/10 bg-white/8 p-4 text-sm text-white/78">
          <div className="flex items-center justify-between gap-3 rounded-[1.2rem] bg-black/12 px-4 py-3">
            <span className="font-semibold">Venue promotion</span>
            <span className="text-xs uppercase tracking-[0.18em] text-yellow-200">visible</span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[1.2rem] bg-black/12 px-4 py-3">
            <span className="font-semibold">Comedy + pet-friendly</span>
            <span className="text-xs uppercase tracking-[0.18em] text-yellow-200">included</span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[1.2rem] bg-black/12 px-4 py-3">
            <span className="font-semibold">Curated image policy</span>
            <span className="text-xs uppercase tracking-[0.18em] text-yellow-200">locked</span>
          </div>
        </div>
      </div>
    </section>
  );
}
