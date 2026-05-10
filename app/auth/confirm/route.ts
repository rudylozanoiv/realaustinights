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
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const code = searchParams.get('code');
  const supabaseError = searchParams.get('error');
  const next = safeNextPath(searchParams.get('next'));

  if (supabaseError) {
    return NextResponse.redirect(authErrorRedirect(origin, 'confirm', 'supabase_error'));
  }

  try {
    if (tokenHash) {
      if (!isValidEmailOtpType(type)) {
        return NextResponse.redirect(authErrorRedirect(origin, 'confirm', 'bad_type'));
      }
      const response = NextResponse.redirect(`${origin}${next}`);
      const supabase = await createRouteClient(response);
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });
      if (error) {
        return NextResponse.redirect(authErrorRedirect(origin, 'confirm', 'verify_failed'));
      }
      return response;
    }

    if (code) {
      const response = NextResponse.redirect(`${origin}${next}`);
      const supabase = await createRouteClient(response);
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(authErrorRedirect(origin, 'confirm', 'exchange_failed'));
      }
      return response;
    }

    return NextResponse.redirect(authErrorRedirect(origin, 'confirm', 'missing_credentials'));
  } catch {
    const reason = tokenHash ? 'verify_failed' : code ? 'exchange_failed' : 'missing_credentials';
    return NextResponse.redirect(authErrorRedirect(origin, 'confirm', reason));
  }
}
