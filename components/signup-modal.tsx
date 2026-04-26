'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { RECAPTCHA_SITE_KEY } from '@/lib/flags';
import type { UserMode } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onSignedUp: (user: {
    mode: Exclude<UserMode, null>;
    years: number | null;
    email: string;
    instagram: string;
  }) => void;
  onSignedIn?: (user: { email: string }) => void;
}

type Tab = 'signup' | 'signin';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const FOUNDING_KEY = 'raln:founding_count';
const FOUNDING_BASE = 0;
const FOUNDING_CAP = 500;

export default function SignupModal({
  open,
  onClose,
  onSignedUp,
  onSignedIn,
}: SignupModalProps) {
  const [mode, setMode] = useState<Exclude<UserMode, null> | null>(null);
  const [years, setYears] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instagram, setInstagram] = useState('');
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('signup');
  const modalRef = useRef<HTMLDivElement>(null);

  // Validation logic
  const canSubmitSignup =
    mode &&
    email.trim().length > 0 &&
    password.length >= 6;

  const canSubmitSignin =
    signinEmail.trim().length > 0 && signinPassword.length >= 6;

  const handleSignupSubmit = async () => {
    if (!canSubmitSignup || !mode) return;
    
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            instagram_handle: instagram.trim() || null,
          }
        }
      });
      
      if (authError) throw authError;
      
      // Get current user count for founding member logic
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact' });
      
      const next = (count || 0) + 1;
      const isFounding = next <= FOUNDING_CAP;
      
      // Create user profile in our custom table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            auth_id: authData.user?.id,
            email: email.trim(),
            instagram_handle: instagram.trim() || null,
            is_founding_member: isFounding,
            founding_member_number: isFounding ? next : null
          }
        ]);
        
      if (profileError) throw profileError;
      
      alert(`Welcome! You're Founding AustiNight #${isFounding ? next : 'TBD'}. Check your email to verify your account.`);
      
      onSignedUp({
        mode,
        years: years ? Number.parseInt(years, 10) : null,
        email: email.trim(),
        instagram: instagram.trim(),
      });
    } catch (error) {
      console.error('Signup error:', error);
      const message = error instanceof Error ? error.message : String(error);
      alert('Signup failed: ' + message);
    }
  };

  const handleSigninSubmit = () => {
    if (!canSubmitSignin) return;
    onSignedIn?.({ email: signinEmail.trim() });
  };

  useEffect(() => {
    if (open && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(FOCUSABLE);
      if (focusable.length > 0) {
        (focusable[0] as HTMLElement).focus();
      }
    }
  }, [open]);

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
        className="w-full max-w-md rounded-lg bg-white shadow-lg"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="p-6">
          <h2 
            id="signup-title"
            className="mb-4 text-center text-xl font-bold text-navy"
          >
            Welcome to RealAustiNights
          </h2>
          
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
                Sign Up
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
              <div className="mb-4 rounded-lg bg-pink p-3">
                <p className="text-center text-sm font-semibold text-white">
                  🏆 Claim spot #{1} of 500 Founding AustiNights
                </p>
              </div>

              <div className="space-y-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I'm a...
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={clsx(
                        'flex-1 rounded-md border px-3 py-2 text-center text-sm font-medium',
                        mode === 'austinight'
                          ? 'border-navy bg-navy text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      )}
                      onClick={() => setMode('austinight')}
                    >
                      🏡<br />AustiNight
                    </button>
                    <button
                      type="button"
                      className={clsx(
                        'flex-1 rounded-md border px-3 py-2 text-center text-sm font-medium',
                        mode === 'tourist'
                          ? 'border-navy bg-navy text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      )}
                      onClick={() => setMode('tourist')}
                    >
                      ✈️<br />Tourist
                    </button>
                  </div>
                </div>

                {mode === 'austinight' && (
                  <div>
                    <label htmlFor="years" className="block text-sm font-medium text-gray-700">
                      Years in Austin
                    </label>
                    <input
                      type="number"
                      id="years"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-navy sm:text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" required />
                    <span className="text-sm text-gray-600">
                      I agree to the community guidelines and terms.
                    </span>
                  </label>
                  <div className="text-sm text-gray-500">
                    I'm not a robot (reCAPTCHA not configured)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignupSubmit}
                  disabled={!canSubmitSignup}
                  className={clsx(
                    'w-full rounded-md px-4 py-2 text-white font-medium',
                    canSubmitSignup
                      ? 'bg-pink hover:bg-pink-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  )}
                >
                  🤠 Let's Go!
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

                <button
                  type="button"
                  onClick={handleSigninSubmit}
                  disabled={!canSubmitSignin}
                  className={clsx(
                    'w-full rounded-md px-4 py-2 text-white font-medium',
                    canSubmitSignin
                      ? 'bg-navy hover:bg-navy-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  )}
                >
                  Sign In
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-navy hover:underline"
                    onClick={() => setActiveTab('signup')}
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>    
    </div>
  );
}
