'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { createClient } from '@/lib/supabase/client';

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  // Fired after Supabase signUp succeeds. Email confirmation is still
  // pending — the user is NOT authenticated yet. Real authenticated state
  // comes from the Supabase session, not this callback.
  onSignedUp: (user: {
    email: string;
    instagram: string;
  }) => void;
  onSignedIn?: (user: { email: string }) => void;
}

type Tab = 'signup' | 'signin' | 'check-email';

function describeAuthError(err: unknown): string {
  if (err instanceof Error) {
    const code = (err as { code?: string }).code;
    return code ? `${err.message} [${code}]` : err.message;
  }
  if (typeof err === 'string') return err;
  return 'Unknown signup error';
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function SignupModal({
  open,
  onClose,
  onSignedUp,
  onSignedIn,
}: SignupModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instagram, setInstagram] = useState('');
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('signup');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Validation logic
  const canSubmitSignup =
    email.trim().length > 0 &&
    password.length >= 6;

  const canSubmitSignin =
    signinEmail.trim().length > 0 && signinPassword.length >= 6;

  const handleSignupSubmit = async () => {
    if (!canSubmitSignup || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const trimmedEmail = email.trim();
    const trimmedInstagram = instagram.trim();

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            instagram: trimmedInstagram,
          },
        },
      });
      if (error) {
        setSubmitError(`Signup failed: ${describeAuthError(error)}`);
        return;
      }

      setSubmittedEmail(trimmedEmail);
      setActiveTab('check-email');
      onSignedUp({
        email: trimmedEmail,
        instagram: trimmedInstagram,
      });
    } catch (err) {
      setSubmitError(`Signup failed: ${describeAuthError(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSigninSubmit = async () => {
    if (!canSubmitSignin || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const trimmedEmail = signinEmail.trim();

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: signinPassword,
      });
      if (error) {
        setSubmitError(`Sign in failed: ${describeAuthError(error)}`);
        return;
      }
      onSignedIn?.({ email: trimmedEmail });
      onClose();
    } catch (err) {
      setSubmitError(`Sign in failed: ${describeAuthError(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setSubmitError(`Google sign in failed: ${describeAuthError(error)}`);
      }
    } catch (err) {
      setSubmitError(`Google sign in failed: ${describeAuthError(err)}`);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setSubmitError(null);
      setSubmitting(false);
      return;
    }
    if (modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(FOCUSABLE);
      if (focusable.length > 0) {
        (focusable[0] as HTMLElement).focus();
      }
    }
  }, [open]);

  useEffect(() => {
    setSubmitError(null);
  }, [activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
        className="relative w-full max-w-md rounded-lg bg-white shadow-lg"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="p-6">
          <h2 
            id="signup-title"
            className="mb-4 text-center text-xl font-bold text-navy"
          >
            Preview List controlled test
          </h2>
          <p className="mb-4 rounded-md bg-pink/10 px-3 py-2 text-xs leading-5 text-gray-700">
            Family/friends can browse without an account. This form is only for controlled auth testing; official membership, Founding Member numbers, and badges are not active yet.
          </p>
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <div className="mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                id="signup-tab"
                className={clsx(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  activeTab === 'signup'
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                aria-selected={activeTab === 'signup'}
                aria-controls="signup-panel"
                onClick={() => setActiveTab('signup')}
              >
                Test Signup
              </button>
              <button
                type="button"
                id="signin-tab"
                className={clsx(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  activeTab === 'signin'
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                aria-selected={activeTab === 'signin'}
                aria-controls="signin-panel"
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
            </div>
          </div>
          {activeTab === 'signup' && (
            <div
              id="signup-panel"
              role="tabpanel"
              aria-labelledby="signup-tab"
            >
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={submitting}
                  className={clsx(
                    'flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700',
                    submitting ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'
                  )}
                >
                  <span aria-hidden>🔵</span>
                  {submitting ? 'Connecting…' : 'Continue with Google (test only)'}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">or test with email</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Phone or Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-navy sm:text-sm"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-navy sm:text-sm"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                    Instagram (optional)
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-navy sm:text-sm"
                    placeholder="@yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" required />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <a
                        href="/community-guidelines"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-navy underline underline-offset-2"
                      >
                        Community Guidelines
                      </a>
                      {' '}and terms.
                    </span>
                  </label>
                  <div className="text-sm text-gray-500">
                    I'm not a robot (reCAPTCHA not configured)
                  </div>
                </div>

                {submitError && (
                  <p
                    role="alert"
                    className="rounded-md bg-pink/10 px-3 py-2 text-xs font-semibold text-pink"
                  >
                    {submitError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSignupSubmit}
                  disabled={!canSubmitSignup || submitting}
                  className={clsx(
                    'w-full rounded-md px-4 py-2 text-white font-medium',
                    canSubmitSignup && !submitting
                      ? 'bg-pink hover:bg-pink-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  )}
                >
                  {submitting ? 'Submitting…' : 'Send test signup'}
                </button>
              </div>
            </div>
          )}
          {activeTab === 'signin' && (
            <div
              id="signin-panel"
              role="tabpanel"
              aria-labelledby="signin-tab"
            >
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={submitting}
                  className={clsx(
                    'flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700',
                    submitting ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'
                  )}
                >
                  <span aria-hidden>🔵</span>
                  {submitting ? 'Connecting…' : 'Continue with Google (test only)'}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">or use email</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="signin-email"
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-navy sm:text-sm"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="signin-password"
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-navy sm:text-sm"
                    required
                  />
                </div>

                {submitError && (
                  <p
                    role="alert"
                    className="rounded-md bg-pink/10 px-3 py-2 text-xs font-semibold text-pink"
                  >
                    {submitError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSigninSubmit}
                  disabled={!canSubmitSignin || submitting}
                  className={clsx(
                    'w-full rounded-md px-4 py-2 text-white font-medium',
                    canSubmitSignin && !submitting
                      ? 'bg-navy hover:bg-navy-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  )}
                >
                  {submitting ? 'Signing in…' : 'Sign In'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-navy hover:underline"
                    onClick={() => setActiveTab('signup')}
                  >
                    Controlled tester? Open test signup
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'check-email' && (
            <div
              id="check-email-panel"
              role="tabpanel"
              className="text-center"
            >
              <div aria-hidden className="text-4xl">📬</div>
              <p className="mt-2 text-sm font-bold text-navy">
                Check your email to continue the controlled auth test.
              </p>
              {submittedEmail && (
                <p className="mt-1 break-all text-xs text-gray-500">
                  Sent to <span className="font-semibold text-gray-700">{submittedEmail}</span>
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Open the link from this device. This does not assign official membership, Founding Member numbers, or badges.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full rounded-md bg-navy px-4 py-2 font-medium text-white hover:bg-navy-600"
              >
                Got it
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
