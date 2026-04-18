'use client';

import { useEffect } from 'react';

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[route-error]', error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold text-ink">
        Something broke.
      </h1>
      <p className="mt-2 text-sm text-ink-mid">
        Not your fault — ours. Keep Austin weird; we&apos;ll get this fixed.
      </p>
      {error.digest && (
        <p className="mt-2 text-[11px] text-ink-light">
          Ref: <code>{error.digest}</code>
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-full bg-teal px-5 py-2.5 font-display text-sm font-bold text-white shadow"
      >
        Try again
      </button>
    </main>
  );
}
