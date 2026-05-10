import { NextResponse, type NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase/server';
import {
  authErrorRedirect,
  isValidEmailOtpType,
  safeNextPath,
} from '@/lib/auth/helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const supabaseError = searchParams.get('error');
  const next = safeNextPath(searchParams.get('next'));

  if (supabaseError) {
    return NextResponse.redirect(authErrorRedirect(origin, 'callback', 'supabase_error'));
  }

  try {
    if (code) {
      const response = NextResponse.redirect(`${origin}${next}`);
      const supabase = await createRouteClient(response);
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(authErrorRedirect(origin, 'callback', 'exchange_failed'));
      }
      return response;
    }

    if (tokenHash) {
      if (!isValidEmailOtpType(type)) {
        return NextResponse.redirect(authErrorRedirect(origin, 'callback', 'bad_type'));
      }
      const response = NextResponse.redirect(`${origin}${next}`);
      const supabase = await createRouteClient(response);
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });
      if (error) {
        return NextResponse.redirect(authErrorRedirect(origin, 'callback', 'verify_failed'));
      }
      return response;
    }

    return NextResponse.redirect(authErrorRedirect(origin, 'callback', 'missing_credentials'));
  } catch {
    const reason = code ? 'exchange_failed' : tokenHash ? 'verify_failed' : 'missing_credentials';
    return NextResponse.redirect(authErrorRedirect(origin, 'callback', reason));
  }
}
