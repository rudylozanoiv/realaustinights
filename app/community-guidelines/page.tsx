import Link from 'next/link';

const guidelines = [
  {
    emoji: '🤝',
    title: 'Respect people',
    blurb: 'Good energy only.',
    points: [
      'Treat locals, visitors, staff, and businesses with respect.',
      'No harassment, threats, hate speech, stalking, or doxxing.',
    ],
  },
  {
    emoji: '🪩',
    title: 'Keep it real',
    blurb: 'No fake hype. No fake drama.',
    points: [
      'Share real experiences, not made-up praise or manufactured complaints.',
      'Do not impersonate venues, creators, brands, or other users.',
    ],
  },
  {
    emoji: '🔒',
    title: 'Protect privacy',
    blurb: 'Fun should still feel safe.',
    points: [
      'Do not post private info, exact live locations, or anything that puts someone at risk.',
      'Use common sense with photos, tags, and recommendations.',
    ],
  },
  {
    emoji: '📍',
    title: 'Make recommendations useful',
    blurb: 'Help people actually have a good night.',
    points: [
      'Recommend spots you genuinely like and can stand behind.',
      'No spam, scams, fake promos, or paid-looking posts disguised as real opinions.',
    ],
  },
  {
    emoji: '✨',
    title: 'Protect the vibe',
    blurb: 'Trust is the whole product.',
    points: [
      'Real AustiNights should feel helpful, local, and welcoming.',
      'Accounts or content that damage trust can be limited or removed.',
    ],
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffe8f4_0%,#fff7ef_34%,#fffaf3_64%,#f7fbff_100%)] px-4 py-6 text-navy md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_90px_rgba(18,48,78,0.14)] backdrop-blur">
          <div className="border-b border-white/60 bg-[linear-gradient(135deg,rgba(18,48,78,0.96)_0%,rgba(15,107,107,0.93)_58%,rgba(255,105,180,0.78)_100%)] px-6 py-8 text-white md:px-10 md:py-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/90 transition hover:bg-white/20"
            >
              ← Back to Real AustiNights
            </Link>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_.9fr] lg:items-end">
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-[0.34em] text-yellow-200/95">
                  Community Trust
                </p>
                <h1 className="font-display text-4xl font-black tracking-tight md:text-6xl">
                  Keep the vibe good.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/88 md:text-lg">
                  Real AustiNights should feel fun, useful, local, and safe. These are the house rules for how we show up here.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/16 bg-white/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/65">What we care about</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">Trust</div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">Safety</div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">Honesty</div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">Good taste</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 md:px-10 md:py-8 lg:grid-cols-[1.5fr_.85fr]">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              {guidelines.map((section) => (
                <section
                  key={section.title}
                  className="rounded-[1.6rem] border border-slate-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#fffaf8_100%)] p-5 shadow-[0_18px_40px_rgba(18,48,78,0.07)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink/12 text-2xl shadow-[inset_0_0_0_1px_rgba(255,105,180,0.14)]">
                      {section.emoji}
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-black text-navy">{section.title}</h2>
                      <p className="mt-1 text-sm font-medium text-teal-700">{section.blurb}</p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                    {section.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pink" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.7rem] bg-[linear-gradient(180deg,#fff0f8_0%,#fffaf3_100%)] p-5 shadow-[0_18px_45px_rgba(255,105,180,0.12)] ring-1 ring-pink/10">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">Simple standard</p>
                <h3 className="mt-3 font-display text-2xl font-black text-navy">Don’t make the app feel less trustworthy.</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  If a post, comment, recommendation, or behavior makes the platform feel fake, unsafe, spammy, or weird in a bad way, it probably doesn’t belong here.
                </p>
              </div>

              <div className="rounded-[1.7rem] bg-navy p-5 text-white shadow-[0_22px_55px_rgba(18,48,78,0.2)]">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-200">By signing up</p>
                <p className="mt-3 text-sm leading-7 text-white/88">
                  You agree to follow these guidelines and help keep Real AustiNights honest, local, useful, and welcoming.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
