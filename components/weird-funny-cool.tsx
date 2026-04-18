'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { RECAPTCHA_SITE_KEY } from '@/lib/flags';
import { usePrefersReducedMotion } from '@/lib/hooks';

type Label = 'Weird' | 'Funny' | 'Cool';
const LABELS: Label[] = ['Weird', 'Funny', 'Cool'];
const CYCLE_MS = 1500;

interface WeirdFunnyCoolProps {
  className?: string;
  onRequireLogin?: () => void;
}

export function WeirdFunnyCool({ className, onRequireLogin }: WeirdFunnyCoolProps) {
  const [tick, setTick] = useState(0);
  const [frozen, setFrozen] = useState<Label | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [captchaOk, setCaptchaOk] = useState(RECAPTCHA_SITE_KEY === '');
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = () => {
    if (!photoUrl || !caption || !captchaOk || !frozen) return;
    setSubmitted(true);
  };

  const handleVote = (l: Label) => {
    if (userVote) return;
    setUserVote(l);
    setVotes(v => ({ ...v, [l]: v[l] + 1 }));
  };

  const colorFor = (l: Label) =>
    l === 'Weird' ? 'text-orange' : l === 'Funny' ? 'text-teal' : 'text-navy';

  return (
    <section
      aria-label="Weird, Funny, Cool submissions"
      className={clsx(
        'rounded-2xl border border-hairline bg-white p-4 shadow-sm md:p-5',
        className,
      )}
    >
      <h2 className="font-display text-base font-extrabold text-ink md:text-lg">
        Found something{' '}
        <button
          type="button"
          onClick={() => {
            if (onRequireLogin && !frozen) {
              // Allow picking even when logged-out; requireLogin fires on submit.
            }
            setFrozen(frozen ? null : shown);
          }}
          aria-live="polite"
          aria-label={
            frozen
              ? `Category frozen as ${frozen}. Tap to unfreeze.`
              : `Current category: ${current}. Tap to freeze.`
          }
          className={clsx(
            'font-display font-extrabold underline decoration-dashed underline-offset-4 transition-colors',
            colorFor(shown),
            !frozen && 'motion-safe:[animation:raln-fade-in_0.25s_ease]',
          )}
        >
          {shown}
        </button>
        ?
      </h2>
      <p className="mt-1 text-[11px] text-ink-light">
        {frozen
          ? `Category locked as "${frozen}" — submit a photo + caption below.`
          : 'Tap the word to lock it as your submission category.'}
      </p>

      {frozen && !submitted && (
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={clsx(
              'block w-full cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-colors',
              photoUrl ? 'border-teal bg-teal-light' : 'border-hairline bg-cream hover:bg-teal-light/50',
            )}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Selected preview"
                className="mx-auto max-h-40 rounded-md object-cover"
              />
            ) : (
              <>
                <div aria-hidden className="text-3xl">📷</div>
                <div className="mt-1 text-xs font-semibold text-ink-mid">Tap to upload</div>
                <div className="text-[10px] text-ink-light">JPG, PNG, GIF · max 10MB</div>
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

          {/* reCAPTCHA placeholder — wire real widget once RECAPTCHA_SITE_KEY is set. */}
          <label className="flex items-center gap-2 rounded-md border border-hairline bg-cream px-3 py-2 text-xs">
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
            onClick={() => {
              if (onRequireLogin) {
                onRequireLogin();
                return;
              }
              handleSubmit();
            }}
            disabled={!photoUrl || !caption || !captchaOk}
            className="w-full rounded-lg bg-orange px-4 py-2.5 font-display text-sm font-bold text-white shadow disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
          >
            Submit as {frozen}
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-4 rounded-xl border border-teal/30 bg-teal-light p-4 text-center">
          <div aria-hidden className="text-3xl">✝️</div>
          <p className="mt-1 font-display text-sm font-bold text-teal">
            Submitted as {frozen}!
          </p>
          <p className="mt-1 text-xs text-ink-mid">Austin votes:</p>
          <div className="mt-3 flex justify-center gap-2">
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
