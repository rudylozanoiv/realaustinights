/**
 * Brand tokens — TS mirror of @theme block in app/globals.css.
 * Keep in sync. Prefer Tailwind utilities (bg-pink, text-teal, etc.) in components.
 * Use these constants only for programmatic access (chart colors, dynamic styles, etc.).
 *
 * PINK (#FF69B4) is SACRED — memorial to Rudy Lozano IV's late wife.
 * Allowed uses: Sign Up CTAs, Featured Partner badges, Founding AustiNights badges,
 * Pupper Weekly highlights. NEVER decorative.
 */
export const BRAND = {
  cream: '#FFFAF3',
  teal: '#007A7A',
  tealLight: '#E8F5F5',
  orange: '#FF8C00',
  orangeLight: '#FFF4E6',
  navy: '#1B2A4A',
  navyLight: '#E8EDF5',
  red: '#BF0A30',
  green: '#00A86B',
  pink: '#FF69B4',
  ink: '#1B2A4A',
  inkMid: '#4A5568',
  inkLight: '#A8A29E',
  hairline: '#E8DFD0',
} as const;

export type BrandColor = keyof typeof BRAND;
