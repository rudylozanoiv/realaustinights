import type { EmailOtpType } from '@supabase/supabase-js';

const ALLOWED_EMAIL_OTP_TYPES: readonly EmailOtpType[] = [
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
];

export function safeNextPath(raw: string | null): string {
  if (!raw) return '/';
  if (!raw.startsWith('/')) return '/';
  if (raw.startsWith('//')) return '/';
  return raw;
}

export function isValidEmailOtpType(value: string | null): value is EmailOtpType {
  if (!value) return false;
  return (ALLOWED_EMAIL_OTP_TYPES as readonly string[]).includes(value);
}

export type AuthErrorSource = 'callback' | 'confirm';
export type AuthErrorReason =
  | 'missing_credentials'
  | 'exchange_failed'
  | 'verify_failed'
  | 'bad_type'
  | 'supabase_error';

export function authErrorRedirect(
  origin: string,
  source: AuthErrorSource,
  reason: AuthErrorReason,
): string {
  return `${origin}/?auth_error=${encodeURIComponent(source)}&auth_reason=${encodeURIComponent(reason)}`;
}
