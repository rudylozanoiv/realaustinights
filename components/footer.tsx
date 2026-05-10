import Link from 'next/link';

interface FooterProps {
  onFoundingClick?: () => void;
}

export function Footer({ onFoundingClick }: FooterProps) {
  return (
    <footer className="mt-8 bg-[linear-gradient(180deg,#12304e_0%,#0f6b6b_55%,#0b5858_100%)] px-5 py-10 text-center text-white shadow-[0_-12px_30px_rgba(27,42,74,0.12)]" role="contentinfo">
      <div className="mx-auto max-w-2xl space-y-3">
        <p className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
          Real<span className="text-yellow-300">AustiNights</span>
        </p>
        <p className="text-sm opacity-85 md:text-base">Real locals. Real vibes. Real fun.</p>
        <p className="text-[11px] opacity-70">🤖 AI-Driven, AustiNight-Approved</p>

        <nav aria-label="Social links" className="flex items-center justify-center gap-4 pt-1">
          <a
            href="https://instagram.com/realaustinights"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm font-semibold underline-offset-4 transition hover:text-yellow-300 hover:underline"
          >
            Instagram
          </a>
          <a
            href="https://x.com/realaustinights"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm font-semibold underline-offset-4 transition hover:text-yellow-300 hover:underline"
          >
            X
          </a>
          <Link
            href="/coming-soon"
            className="font-display text-sm font-semibold opacity-80 underline-offset-4 transition hover:text-yellow-300 hover:underline"
          >
            TikTok <span className="text-[10px] opacity-80">(In Work)</span>
          </Link>
        </nav>

        {onFoundingClick && (
          <button
            type="button"
            onClick={onFoundingClick}
            className="mt-3 rounded-full bg-pink px-6 py-2.5 font-display text-sm font-bold text-white shadow-[0_12px_24px_rgba(255,105,180,0.35)] hover:brightness-110"
          >
            🏆 Become a Founding AustiNight
          </button>
        )}

        <p className="pt-3 text-[11px] opacity-50">
          © 2026 Real AustiNights. Keep it weird, y&apos;all. ✝️
        </p>
      </div>
    </footer>
  );
}
