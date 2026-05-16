import Link from 'next/link';
import { RouteBottomTabBar } from '@/components/homepage/route-bottom-tab-bar';
import { RouteLockedHeader } from '@/components/homepage/route-locked-header';

const benefits = [
  'Get tonight picks without digging through five different apps',
  'See upcoming dates worth planning around before the weekend hits',
  'Stay close to real Austin spots, not generic nightlife filler',
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#080d18_0%,#11182b_24%,#16142b_56%,#0e1324_100%)] text-white">
      <RouteLockedHeader currentPath="/membership" />

      <main className="px-4 py-8 pb-24 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white/82 transition hover:bg-white/10"
            >
              ← Back to Real AustiNights
            </Link>

            <div className="rounded-full border border-pink/30 bg-pink/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-pink">
              Membership
            </div>
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(11,15,28,0.96)_0%,rgba(25,16,36,0.94)_36%,rgba(20,32,56,0.92)_100%)] px-6 py-10 shadow-[0_30px_80px_rgba(7,10,21,0.45)] md:px-8 md:py-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">Founding members</p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">Become a founding member</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
              Keep it simple: join early, get the best version of the product first, and help shape where Real AustiNights goes next.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-[1.15fr_.85fr]">
              <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink/84">What members get</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-white/76">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3">
                      <span className="text-pink">✦</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink/84">Next step</p>
                <h2 className="mt-3 font-display text-2xl font-black text-white">Start with the live signup flow</h2>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  We kept signup lightweight. No old noisy onboarding questions on the first step.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/#signup"
                    className="rounded-full bg-pink px-5 py-3 text-sm font-bold text-white shadow-[0_18px_32px_rgba(255,105,180,0.3)] hover:brightness-110"
                  >
                    Open signup
                  </Link>
                  <Link
                    href="/community-guidelines"
                    className="rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-semibold text-white hover:bg-white/12"
                  >
                    Read community guidelines
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <RouteBottomTabBar />
    </div>
  );
}
