import Link from 'next/link';

const guidelines = [
  {
    title: 'Be respectful',
    points: [
      'Treat locals, visitors, staff, and businesses with respect.',
      'No harassment, threats, hate speech, or doxxing.',
    ],
  },
  {
    title: 'Keep it honest',
    points: [
      'Share real experiences, not fake hype or fake complaints.',
      'Do not impersonate venues, creators, or other users.',
    ],
  },
  {
    title: 'Protect safety and privacy',
    points: [
      'Do not post private personal info, exact live locations, or anything that puts someone at risk.',
      'Use common sense with photos, tags, and recommendations.',
    ],
  },
  {
    title: 'Keep recommendations useful',
    points: [
      'Recommend places you genuinely like and can stand behind.',
      'No spam, scam offers, or paid-looking posts disguised as real opinions.',
    ],
  },
  {
    title: 'Help keep the vibe good',
    points: [
      'We want Real AustiNights to feel fun, helpful, and trustworthy.',
      'Accounts or content that hurt that trust can be limited or removed.',
    ],
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf3_0%,#fff3ea_100%)] px-4 py-10 text-navy">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white/95 p-6 shadow-[0_24px_70px_rgba(18,48,78,0.12)] md:p-10">
        <div className="mb-8 space-y-3">
          <Link href="/" className="text-sm font-semibold text-teal-700 hover:underline">
            ← Back to Real AustiNights
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink">Community trust</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Community Guidelines
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
            Real AustiNights should feel fun, useful, and safe. These are the simple rules for how we show up here.
          </p>
        </div>

        <div className="space-y-5">
          {guidelines.map((section) => (
            <section key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
              <h2 className="font-display text-xl font-bold text-navy">{section.title}</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700 md:text-base">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 text-pink">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-navy px-5 py-4 text-sm text-white/90">
          By signing up, you agree to follow these guidelines and help keep the platform honest, local, and welcoming.
        </div>
      </div>
    </main>
  );
}
