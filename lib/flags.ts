/**
 * Feature flags. Flip these when the integrations are ready to ship.
 * Keep false in production until the contract behind each flag actually works.
 */
export const UBER_ENABLED = false;
export const ADSENSE_ENABLED = false;
export const STRIPE_ENABLED = false;
export const BROWSE_ONLY_MODE = true;
export const GUEST_IMAGE_SUBMISSIONS_ENABLED = true;
export const SHOW_UNVERIFIED_QUE_PASA = false;
export const SHOW_UNVERIFIED_PUPPER = false;
export const REPRESENTATIVE_IMAGE_LABELS = true;

/** Exposed publicly via NEXT_PUBLIC_* so it reaches client components. */
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? '';
