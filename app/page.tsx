'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageShell } from '@/components/homepage/homepage-shell';
import { BottomTabBar, type BottomTab } from '@/components/bottom-tab-bar';
import SignupModal from '@/components/signup-modal';
import { useAuthSessionState } from '@/components/homepage/use-auth-session-state';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, authUnavailable, handleSignOut } = useAuthSessionState();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(
    typeof window !== 'undefined' && window.location.hash === '#signup',
  );
  const [bottomTab, setBottomTab] = useState<BottomTab | null>('home');

  useEffect(() => {
    const syncSignupHash = () => {
      if (typeof window === 'undefined') return;
      setShowSignup(window.location.hash === '#signup');
    };

    syncSignupHash();
    window.addEventListener('hashchange', syncSignupHash);
    return () => window.removeEventListener('hashchange', syncSignupHash);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errKey = params.get('auth_error');
      if (errKey === 'callback' || errKey === 'confirm') {
        const reasonKey = params.get('auth_reason');
        const reasonText: Record<string, string> = {
          missing_credentials: 'The link was missing required data.',
          exchange_failed: 'We could not complete the sign-in. Please request a new link.',
          verify_failed: 'The confirmation link has expired or already been used.',
          bad_type: 'The confirmation link is malformed.',
          supabase_error: 'Supabase reported an error during confirmation.',
        };
        const reasonMsg = reasonKey ? reasonText[reasonKey] : undefined;
        setAuthError(
          reasonMsg
            ? `Email confirmation failed. ${reasonMsg}`
            : 'Email confirmation failed. Please request a new sign-up link.',
        );
      }
    }
  }, []);

  useEffect(() => {
    if (authUnavailable) {
      setAuthError((prev) => prev ?? "Men at Work — You're in Early. Browse everything — sign-up and interactions launch soon.");
    }
  }, [authUnavailable]);

  return (
    <>
      {authError && (
        <div
          role="status"
          className="mx-auto mt-3 flex max-w-7xl items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900"
        >
          <span aria-hidden className="shrink-0">👷</span>
          <div>
            <strong className="font-semibold text-amber-950">{authError}</strong>{' '}
            <button
              type="button"
              onClick={() => setAuthError(null)}
              className="ml-1 underline text-amber-800 transition hover:text-amber-950"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <HomepageShell
        isAuthenticated={isAuthenticated}
        onSignUpClick={() => {
          setShowSignup(true);
          if (typeof window !== 'undefined') {
            window.location.hash = 'signup';
          }
        }}
        onSignOutClick={handleSignOut}
      />

      <BottomTabBar
        active={bottomTab}
        onHome={() => {
          setBottomTab('home');
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onTonight={() => {
          setBottomTab('tonight');
          router.push('/tonight');
        }}
        onGuides={() => {
          setBottomTab('guides');
          router.push('/guides');
        }}
        onMembership={() => {
          setBottomTab('membership');
          router.push('/membership');
        }}
      />

      <SignupModal
        open={showSignup}
        onClose={() => {
          setShowSignup(false);
          if (typeof window !== 'undefined' && window.location.hash === '#signup') {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        onSignedUp={() => {
          // Session state still comes from onAuthStateChange.
        }}
        onSignedIn={() => {
          setShowSignup(false);
        }}
      />
    </>
  );
}
