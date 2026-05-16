'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UseAuthSessionStateResult {
  isAuthenticated: boolean;
  authUnavailable: boolean;
  handleSignOut: () => Promise<void>;
}

export function useAuthSessionState(): UseAuthSessionStateResult {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUnavailable, setAuthUnavailable] = useState(false);

  useEffect(() => {
    let supabase;
    try {
      supabase = createClient();
      setAuthUnavailable(false);
    } catch {
      setAuthUnavailable(true);
      return;
    }

    const applyUser = (user: unknown) => {
      setIsAuthenticated(Boolean(user));
    };

    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      applyUser(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Keep local state cleanup even if auth client/network is unavailable.
    }
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    authUnavailable,
    handleSignOut,
  };
}
