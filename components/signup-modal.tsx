'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { RECAPTCHA_SITE_KEY } from '@/lib/flags';
import type { UserMode } from '@/lib/types';

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onSignedUp: (user: {
    mode: Exclude<UserMode, null>;
    years: number | null;
    email: string;
    instagram: string;
  }) => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const FOUNDING_KEY = 'raln:founding_count';
const FOUNDING_BASE = 246;
const FOUNDING_CAP = 500;

function readCount(): number {
  if (typeof window === 'undefined') return FOUNDING_BASE;
  const raw = window.localStorage.getItem(FOUNDING_KEY);
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n >= FOUNDING_BASE ? n : FOUNDING_BASE;
}

function writeCount(n: number) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FOUNDING_KEY, String(n));
}

export function SignupModal({ open, onClose, onSignedUp }: SignupModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<'welcome' | 'signup'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instagram, setInstagram] = useState('');
  const [mode, setMode] = useState<Exclude<UserMode, null> | null>(null);
  const [years, setYears] = useState('');
  const [termsOk, setTermsOk] = useState(false);
  const [captchaOk, setCaptchaOk] = useState(RECAPTCHA_SITE_KEY === '');
  const [foundingCount, setFoundingCount] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setFoundingCount(readCount() + 1);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    const raf = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });
    return () => {
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const canSubmit =
    mode !== null &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    termsOk &&
    captchaOk;

  const handleSubmit = () => {
    if (!canSubmit || !mode) return;
    const next = readCount() + 1;
    writeCount(next);
    onSignedUp({
      mode,
      years: years ? Number.parseInt(years, 10) : null,
      email: email.trim(),
      instagram: instagram.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
        onClick={e => e.stopPropagation()}
        className={clsx(
          'relative w-full max-w-md overflow-hidden rounded-t-3xl bg-cream shadow-2xl',
          'md:rounded-3xl',
        )}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
          <h2
            id="signup-title"
            className="font-display text-lg font-extrabold text-ink"
          >
            Welcome to{' '}
            <span className="text-teal">Real</span>
            <span className="text-orange">AustiNights</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign up"
            className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink-mid"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {step === 'welcome' && (
            <div className="text-center">
              <div aria-hidden className="text-4xl">🤠</div>
              <p className="mt-2 font-display text-sm font-semibold text-ink-mid">
                Sign up to post, comment, and upload.
              </p>
              <p className="mt-1 text-xs text-ink-light">Browse freely without an account.</p>

              {foundingCount !== null && foundingCount <= FOUNDING_CAP && (
                <p className="mt-4 rounded-lg bg-pink/10 px-3 py-2 text-xs font-bold text-pink">
                  🏆 #{foundingCount} of {FOUNDING_CAP} Founding AustiNights
                </p>
              )}

              <button
                type="button"
                onClick={() => setStep('signup')}
                className="mt-4 w-full rounded-xl bg-teal px-4 py-3 font-display text-sm font-bold text-white shadow hover:brightness-110"
              >
                Sign Up Now
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full rounded-xl border-2 border-hairline bg-transparent px-4 py-2.5 font-display text-sm font-semibold text-ink-mid"
              >
                Not Now — Just Browsing
              </button>
            </div>
          )}

          {step === 'signup' && (
            <div className="space-y-3">
              {foundingCount !== null && foundingCount <= FOUNDING_CAP && (
                <p className="rounded-lg bg-pink/10 px-3 py-2 text-center text-xs font-bold text-pink">
                  🏆 Claim spot #{foundingCount} of {FOUNDING_CAP} Founding AustiNights
                </p>
              )}

              <label className="block text-xs">
                <span className="font-bold text-ink">
                  Phone or Email <span className="text-orange">*</span>
                </span>
                <input
                  type="text"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Phone number or email"
                  className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </label>

              <label className="block text-xs">
                <span className="font-bold text-ink">
                  Password <span className="text-orange">*</span>
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </label>

              <label className="block text-xs">
                <span className="font-bold text-ink">
                  Instagram <span className="text-ink-light">(optional)</span>
                </span>
                <input
                  type="text"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="@yourusername"
                  className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </label>

              <fieldset className="pt-1">
                <legend className="mb-1 text-xs font-bold text-ink">I&apos;m a...</legend>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    aria-pressed={mode === 'austinight'}
                    onClick={() => setMode('austinight')}
                    className={clsx(
                      'rounded-xl border-2 px-3 py-3 text-center transition-colors',
                      mode === 'austinight'
                        ? 'border-teal bg-teal-light'
                        : 'border-hairline bg-white',
                    )}
                  >
                    <div aria-hidden className="text-xl">🏡</div>
                    <div className="font-display text-xs font-bold text-ink">AustiNight</div>
                  </button>
                  <button
                    type="button"
                    aria-pressed={mode === 'tourist'}
                    onClick={() => setMode('tourist')}
                    className={clsx(
                      'rounded-xl border-2 px-3 py-3 text-center transition-colors',
                      mode === 'tourist'
                        ? 'border-orange bg-orange-light'
                        : 'border-hairline bg-white',
                    )}
                  >
                    <div aria-hidden className="text-xl">✈️</div>
                    <div className="font-display text-xs font-bold text-ink">Tourist</div>
                  </button>
                </div>
              </fieldset>

              {mode === 'austinight' && (
                <label className="block text-xs">
                  <span className="font-bold text-ink">Years in Austin</span>
                  <input
                    type="number"
                    min={0}
                    value={years}
                    onChange={e => setYears(e.target.value)}
                    placeholder="e.g. 5"
                    className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
                  />
                </label>
              )}

              <label className="flex items-start gap-2 text-xs text-ink-mid">
                <input
                  type="checkbox"
                  checked={termsOk}
                  onChange={e => setTermsOk(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  I agree to the community guidelines and terms.
                </span>
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
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="w-full rounded-xl bg-pink px-4 py-3 font-display text-sm font-bold text-white shadow disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                🤠 Let&apos;s Go!
              </button>

              <button
                type="button"
                onClick={() => setStep('welcome')}
                className="w-full py-1 text-center text-xs text-ink-light hover:underline"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
