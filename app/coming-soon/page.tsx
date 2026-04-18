import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon',
  robots: { index: false, follow: false },
};

export default function ComingSoon() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-extrabold text-ink">In Work</h1>
      <p className="mt-3 text-sm text-ink-mid">
        We&apos;re still building this page. Follow us on Instagram for updates.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-teal px-5 py-2.5 font-display text-sm font-bold text-white shadow"
      >
        ← Back home
      </Link>
    </main>
  );
}
