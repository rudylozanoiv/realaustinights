'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { RECAPTCHA_SITE_KEY } from '@/lib/flags';
import { usePrefersReducedMotion } from '@/lib/hooks';

type Label = 'Weird' | 'Funny' | 'Cool';
const LABELS: Label[] = ['Weird', 'Funny', 'Cool'];
const CYCLE_MS = 1500;

interface WeirdFunnyCoolProps {
  className?: string;
  isSignedIn?: boolean;
  onRequireLogin?: () => void;
}

export function WeirdFunnyCool({
  className,
  isSignedIn = false,
  onRequireLogin,
}: WeirdFunnyCoolProps) {
  const [tick, setTick] = useState(0);
  const [frozen, setFrozen] = useState<Label | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  // Always start unchecked — user must explicitly confirm "not a robot".
  const [captchaOk, setCaptchaOk] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sharePrompt, setSharePrompt] = useState<'idle' | 'available' | 'unavailable'>('idle');
  const [votes, setVotes] = useState<Record<Label, number>>({ Weird: 0, Funny: 0, Cool: 0 });
  const [userVote, setUserVote] = useState<Label | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (frozen || reduced) return;
    const id = setInterval(() => setTick(t => t + 1), CYCLE_MS);
    return () => clearInterval(id);
  }, [frozen, reduced]);

  const current = LABELS[tick % LABELS.length];
  const shown = frozen ?? current;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!isSignedIn) {
      onRequireLogin?.();
      return;
    }
    if (!photoUrl || !caption || !captchaOk || !frozen) return;
    setSubmitted(true);
    // Offer native share sheet when available (iOS Safari supports navigator.share).
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setSharePrompt('available');
    } else {
      setSharePrompt('unavailable');
    }
  };

  const handleShare = async () => {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return;
    try {
      await navigator.share({
        title: `Austin ${frozen}`,
        text: caption,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      });
    } catch {
      // User cancelled or share failed — silent, nothing to recover.
    }
  };

  const handleVote = (l: Label) => {
    if (userVote) return;
    setUserVote(l);
    setVotes(v => ({ ...v, [l]: v[l] + 1 }));
  };

  const colorFor = (l: Label) =>
    l === 'Weird'
      ? 'text-orange'
      : l === 'Funny'
        ? 'text-teal'
        : 'text-navy';

  const bgFor = (l: Label) =>
    l === 'Weird'
      ? 'bg-orange text-white'
      : l === 'Funny'
        ? 'bg-teal text-white'
        : 'bg-navy text-white';

  return (
    <section
      aria-label="Weird, Funny, Cool — see something? share it."
      className={clsx(
        'overflow-hidden rounded-2xl border-2 border-hairline bg-gradient-to-br from-cream via-white to-teal-light/30 p-5 shadow-md md:p-6',
        className,
      )}
    >
      <div className="text-center">
        <p className="font-display text-[10px] font-bold uppercase tracking-widest text-ink-light">
          See something in Austin?
        </p>
        <h2 className="mt-1 font-display text-2xl font-extrabold text-ink md:text-3xl">
          Found something{' '}
          <button
            type="button"
            onClick={() => setFrozen(frozen ? null : shown)}
            aria-live="polite"
            aria-label={
              frozen
                ? `Category frozen as ${frozen}. Tap to unfreeze.`
                : `Cycling category: ${current}. Tap to freeze.`
            }
            className={clsx(
              'font-display text-2xl font-extrabold underline decoration-dashed decoration-2 underline-offset-4 transition-colors md:text-3xl',
              colorFor(shown),
              !frozen && 'motion-safe:[animation:raln-fade-in_0.25s_ease]',
            )}
          >
            {shown}
          </button>
          ?
        </h2>
      </div>

      {/* Explicit choice buttons — tap any to lock that category and open the form. */}
      <div
        role="group"
        aria-label="Choose category"
        className="mt-4 grid grid-cols-3 gap-2"
      >
        {LABELS.map(l => {
          const isActive = frozen === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => setFrozen(isActive ? null : l)}
              aria-pressed={isActive}
              className={clsx(
                'rounded-xl px-3 py-3 font-display text-sm font-extrabold shadow transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                isActive
                  ? `${bgFor(l)} scale-[1.02]`
                  : 'border-2 border-hairline bg-white text-ink hover:border-teal hover:bg-teal-light/40',
              )}
            >
              <span aria-hidden className="mr-1">
                {l === 'Weird' ? '🤪' : l === 'Funny' ? '😂' : '😎'}
              </span>
              {l}
            </button>
          );
        })}
      </div>

      {frozen && !submitted && (
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={clsx(
              'block w-full cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-colors',
              photoUrl
                ? 'border-teal bg-teal-light'
                : 'border-hairline bg-cream hover:bg-teal-light/50',
            )}
          >
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt="Selected preview"
                className="mx-auto max-h-52 rounded-md object-cover"
              />
            ) : (
              <>
                <div aria-hidden className="text-3xl">📷</div>
                <div className="mt-1 text-sm font-semibold text-ink-mid">Tap to upload</div>
                <div className="text-[11px] text-ink-light">JPG, PNG, GIF · max 10MB</div>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </button>
          <label className="block text-xs">
            <span className="font-bold text-ink">Caption</span>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={2}
              placeholder="What's going on here?"
              className="mt-1 w-full resize-none rounded-md border border-hairline bg-white px-2 py-1.5 text-sm"
            />
          </label>

          <label className="flex items-center gap-2 rounded-md border border-hairline bg-white px-3 py-2 text-xs">
            <input
              type="checkbox"
              checked={captchaOk}
              onChange={e => setCaptchaOk(e.target.checked)}
            />
            <span>
              I&apos;m not a robot
              {RECAPTCHA_SITE_KEY ? ' (reCAPTCHA)' : ' (reCAPTCHA not configured)'}
            </span>
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!photoUrl || !caption || !captchaOk}
            className="w-full rounded-lg bg-orange px-4 py-3 font-display text-sm font-bold text-white shadow disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
          >
            {isSignedIn ? `Submit as ${frozen}` : 'Sign in to submit'}
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-4 rounded-xl border border-teal/30 bg-teal-light p-4 text-center">
          <div aria-hidden className="text-3xl">✝️</div>
          <p className="mt-1 font-display text-sm font-bold text-teal">
            Submitted as {frozen}!
          </p>

          {sharePrompt === 'available' && (
            <div className="mt-3 rounded-lg bg-white/80 p-3">
              <p className="text-xs text-ink-mid">Share to your Instagram too?</p>
              <button
                type="button"
                onClick={handleShare}
                className="mt-2 rounded-lg bg-navy px-4 py-2 font-display text-xs font-bold text-white shadow hover:brightness-110"
              >
                📲 Open share sheet
              </button>
            </div>
          )}
          {sharePrompt === 'unavailable' && (
            <p className="mt-2 text-[11px] text-ink-light">
              Native share isn&apos;t available on this device — copy the page URL to share.
            </p>
          )}

          <p className="mt-3 text-xs text-ink-mid">Austin votes:</p>
          <div className="mt-2 flex justify-center gap-2">
            {LABELS.map(l => (
              <button
                key={l}
                type="button"
                onClick={() => handleVote(l)}
                disabled={!!userVote}
                aria-pressed={userVote === l}
                className={clsx(
                  'rounded-lg px-3 py-1.5 text-xs font-bold shadow',
                  userVote === l
                    ? 'bg-navy text-white'
                    : 'bg-white text-ink hover:bg-cream disabled:opacity-60',
                )}
              >
                <span aria-hidden>{l === 'Weird' ? '🤪' : l === 'Funny' ? '😂' : '😎'}</span> I
                vote {l} ({votes[l]})
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
