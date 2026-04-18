import Link from 'next/link';

interface FooterProps {
  onFoundingClick?: () => void;
}

export function Footer({ onFoundingClick }: FooterProps) {
  return (
    <footer className="bg-teal px-5 py-8 text-center text-white" role="contentinfo">
      <div className="mx-auto max-w-2xl space-y-3">
        <p className="font-display text-xl font-extrabold">
          Real<span className="text-yellow-300">AustiNights</span>
        </p>
        <p className="text-sm opacity-80">Real locals. Real vibes. Real fun.</p>
        <p className="text-[11px] opacity-70">🤖 AI-Driven, AustiNight-Approved</p>

        <nav aria-label="Social links" className="flex items-center justify-center gap-4 pt-1">
          <a
            href="https://instagram.com/realaustinights"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm font-semibold underline-offset-4 hover:underline"
          >
            Instagram
          </a>
          <a
            href="https://x.com/realaustinights"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm font-semibold underline-offset-4 hover:underline"
          >
            X
          </a>
          <Link
            href="/coming-soon"
            className="font-display text-sm font-semibold opacity-70 underline-offset-4 hover:underline"
          >
            TikTok <span className="text-[10px] opacity-80">(In Work)</span>
          </Link>
        </nav>

        {onFoundingClick && (
          <button
            type="button"
            onClick={onFoundingClick}
            className="mt-2 rounded-full bg-pink px-5 py-2 font-display text-sm font-bold text-white shadow-md hover:brightness-110"
          >
            🏆 Become a Founding Austinite
          </button>
        )}

        <p className="pt-3 text-[11px] opacity-50">
          © 2026 Real AustiNights. Keep it weird, y&apos;all. ✝️
        </p>
      </div>
    </footer>
  );
}
