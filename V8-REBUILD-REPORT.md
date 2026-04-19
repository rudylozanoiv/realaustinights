# Real AustiNights — V8 Rebuild Handoff Report

**Prepared for:** Rudy Lozano IV (El Duderino Lebowski) and AI analysts (Michelangelo GPT-5.4, Galileo GPT-5.4)
**Builder:** Claude Opus 4.7 (1M context)
**Branch:** `main`
**Handoff commit:** `000950d`
**Date:** 2026-04-17
**Next.js:** 16.2.2 (Turbopack) · **React:** 19.2.4 · **Tailwind:** v4

---

## 1. Executive Summary

V8 replaces the 1,708-line `app/page.tsx` V7 monolith with a modular, mobile-first Next 16 application: 33 new files across `lib/`, `components/` (with a `components/ui/` primitives sub-layer), `app/` routes, and `tests/`. All inline styles were replaced with Tailwind v4 utilities backed by brand tokens declared in an `@theme` block in `globals.css` (plus a TS mirror in `lib/theme.ts`). Dead buttons were either wired up, gated behind a typed feature flag, or removed; every major section is wrapped in an error boundary; SEO baseline includes OpenGraph, Twitter cards, and 14 Schema.org JSON-LD documents rendered server-side. Playwright smoke coverage is **12/12 passing** on both desktop and mobile viewports. The `page.tsx.bak` V7 artifact remains in the repo for reference and can be deleted once analysts sign off.

---

## 2. Files Created

All paths are relative to `/Users/vinci/realaustinights/`. Line counts are actual `wc -l` output.

### `lib/` (6 files, 798 LOC)
| Path | LOC |
|---|---|
| `lib/data.ts` | 452 |
| `lib/types.ts` | 152 |
| `lib/seo.ts` | 123 |
| `lib/hooks.ts` | 33 |
| `lib/theme.ts` | 27 |
| `lib/flags.ts` | 11 |

### `components/` (18 section components, 2,749 LOC)
| Path | LOC |
|---|---|
| `components/signup-modal.tsx` | 325 |
| `components/business-partner-modal.tsx` | 294 |
| `components/weird-funny-cool.tsx` | 201 |
| `components/header.tsx` | 199 |
| `components/after-this.tsx` | 195 |
| `components/que-pasa-carousel.tsx` | 177 |
| `components/comedy.tsx` | 161 |
| `components/deals.tsx` | 145 |
| `components/venue-detail-card.tsx` | 143 |
| `components/were-austin-calendar.tsx` | 126 |
| `components/austin-pulse.tsx` | 124 |
| `components/feed-card.tsx` | 116 |
| `components/community-feed.tsx` | 116 |
| `components/pupper-weekly.tsx` | 112 |
| `components/venue-detail-modal.tsx` | 96 |
| `components/weather-widget.tsx` | 83 |
| `components/json-ld.tsx` | 78 |
| `components/footer.tsx` | 58 |

### `components/ui/` (4 primitives, 226 LOC)
| Path | LOC |
|---|---|
| `components/ui/badges.tsx` | 71 |
| `components/ui/skeleton.tsx` | 71 |
| `components/ui/section-boundary.tsx` | 61 |
| `components/ui/verified-badge.tsx` | 23 |

### `app/` (2 new routes, 62 LOC)
| Path | LOC |
|---|---|
| `app/error.tsx` | 38 |
| `app/coming-soon/page.tsx` | 24 |

### Testing + config (4 files, 120 LOC)
| Path | LOC |
|---|---|
| `tests/smoke.spec.ts` | 70 |
| `playwright.config.ts` | 32 |
| `.env.local.example` | 7 |
| `V8-REBUILD-REPORT.md` | (this document) |

**Total new code:** 33 files · ≈3,955 LOC (excluding the report itself)

---

## 3. Files Modified

| Path | Change |
|---|---|
| `app/page.tsx` | Full rewrite: 1,708 → 543 LOC. Imports 16 components, wires state (search/tab/vibes/cats/selected/userMode/flags), passes `requireLogin()` gate, renders responsive 3-column grid (mobile stack → md 2-col → lg 3-col), wraps every section in `<SectionBoundary>`, injects `<VenuesJsonLd>` + `<EventsJsonLd>` at top. |
| `app/layout.tsx` | Montserrat / Open Sans / Playfair Display loaded via `next/font/google` and exposed as CSS variables; full `defaultMetadata` from `lib/seo.ts` (title template, OG, Twitter, icons, robots); `Viewport` export for mobile; Plausible `<Script>` gated by `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`; `preconnect` + `dns-prefetch` to `images.unsplash.com`; skip-to-main-content anchor. |
| `app/globals.css` | Tailwind v4 `@theme` block declaring brand palette (`--color-cream/teal/orange/navy/red/green/pink/ink/hairline` + light variants) and font vars (`--font-sans/display/serif` bound to next/font variables). Global `prefers-reduced-motion` override, `::selection`, skip-link styles, `raln-fade-in` keyframe. |
| `next.config.ts` | Added `images.remotePatterns` for `https://images.unsplash.com/**` (required for every next/image `src` pointing at Unsplash). |
| `package.json` | Added `clsx` (dep) and `@playwright/test` (devDep). Scripts `test` + `test:smoke` added. |
| `package-lock.json` | Regenerated for the above installs. |
| `.gitignore` | Added `!.env.local.example` exception (parent `.env*` pattern would ignore it); added `/test-results/` and `/playwright-report/`. |

---

## 4. Deviations from Spec

| Spec item | What I did instead | Why |
|---|---|---|
| Phase 1.1 — create `tailwind.config.ts` | Put brand tokens in `@theme` block in `app/globals.css` + TS mirror in `lib/theme.ts` | Tailwind v4 is configured via CSS, not a TS config file. The project already had Tailwind v4 installed (`@tailwindcss/postcss`). Surfaced this conflict at the start of Phase 1 and was approved. |
| Phase 4.1 — skeleton loaders for all data-loading sections | Built `<Skeleton>`, `<FeedCardSkeleton>`, `<QuePasaSkeleton>`, `<ComedySkeleton>` primitives but left them unmounted | All data is currently synchronous (imported from `lib/data.ts`). Skeletons would render for 0ms and flash on every paint. Primitives are ready to drop in when a section goes async — pass `loading={true}` to render them. |
| Phase 4.2 — "Error boundaries on each major section" | Implemented `<SectionBoundary label="…">` class component (React still allows class-based boundaries in v19) and wrapped all 9 center-column sections. Also added `app/error.tsx` for route-level errors. | Per-section granularity was the stated goal; one section crashing should not blank the page. Route-level `error.tsx` is a bonus net for routing/data-layer errors. |
| `<VenueDetailModal>` per spec (single modal component) | Split into `<VenueDetailCard>` (inline render) + `<VenueDetailModal>` (overlay with focus trap) | The desktop layout needs the card rendered *inline in the right sidebar* on `lg+`, while mobile/tablet need a full-screen modal overlay. Sharing render logic via the card component avoided duplication. |
| "AustiNite" / "Founding Austinite" copy | Global rename to `AustiNights` (plural/brand) and `AustiNight` (singular user tier) | Three rounds of brand-law corrections. Final rule enforced via `grep -rn "Austinite"` returning zero. Both domains (`realaustinights.com` + `realaustinight.com`) are now covered. |
| Header mobile drawer using `role="dialog"` | Changed to a disclosure (no role, `hidden` attribute when collapsed) | A drawer is not a modal (no focus trap, no modal-scroll-lock). The original dialog role caused a Playwright strict-mode failure because `getByRole('dialog')` then matched the drawer AND the SignupModal. |
| `next/image` everywhere | 2 `<img>` remain: `components/weird-funny-cool.tsx` and `components/business-partner-modal.tsx` — both for `URL.createObjectURL(file)` previews of user-uploaded blobs | next/image optimizer can't fetch blob URLs and there is no benefit to running through it for ephemeral client-side previews. |
| "Founding Partner banner" (spec Phase 3 section 4) | Integrated into Header as the topmost strip, not a standalone `<FoundingPartnerBanner>` component | Simplifies the stack; the banner is a 1-line gradient under the testing-mode notice. Can be extracted later if it needs its own state. |
| Mini sidebar widgets as separate components | Inlined `<MiniQuePasa>`, `<MiniCommunity>`, `<MiniPupper>`, `<MiniDeals>`, `<Categories>`, `<TonightsPick>` helpers inside `app/page.tsx` | They are narrow, non-reused scroll-anchor teasers visible only at `lg+`. Extracting them would churn without reuse value. |

---

## 5. Component Inventory

> All components under `components/` are client components (`'use client'`) except `venue-detail-card.tsx`, `footer.tsx`, `weather-widget.tsx`, `json-ld.tsx`, and `ui/badges.tsx` + `ui/skeleton.tsx` + `ui/verified-badge.tsx`, which are pure server-safe renderers.

### 1. `components/header.tsx` (199 LOC)
**Props**
```ts
interface HeaderProps {
  search: string;
  onSearchChange: (s: string) => void;
  onSignUpClick: () => void;
  onNavigate: (target: 'tonight' | 'hidden-gems' | 'partner') => void;
}
```
**Behaviors**
- Sticky top, navy 3px bottom border.
- Top strip (`#partner-cta`) — testing-mode notice + Founding Partner CTA gradient.
- Logo, controlled search input (desktop nav + mobile drawer).
- Mobile: hamburger disclosure drawer with search + Tonight / Hidden Gems / For Business nav.
- Sticky pink Sign Up button (sacred-pink use #1).
- Live ticker rotates `HEADLINES` every 4.5s, every 4th slot shows `AI_TAGLINE`.
- Respects `prefers-reduced-motion` (stops rotation).

**Limitations**
- Search is a simple `includes()` match; no fuzzy, no highlighting.
- Nav `onNavigate('partner')` both scrolls to `#partner-cta` and opens the business-partner modal — if the modal is declined, the user lands at the banner.

---

### 2. `components/weather-widget.tsx` (83 LOC)
**Props**
```ts
interface WeatherWidgetProps {
  temp?: number;     // defaults to 82
  condition?: string; // defaults to 'clear'
  className?: string;
}
```
**Behaviors** — preserves V7 personality logic (MUDDY PAWS / SNUGGLE DAY / PATIO WEATHER etc.) and paints a gradient appropriate to the mood. Mobile full-width; desktop moves to left sidebar via `lg:hidden`.

**Limitations**
- No real weather API integration — defaults are hardcoded. Pass props or wire an API call when ready.

---

### 3. `components/feed-card.tsx` (116 LOC)
**Props**
```ts
interface FeedCardProps {
  card: FeedCard;
  onViewDetails: (card: FeedCard) => void;
  onRideClick?: (card: FeedCard) => void;
}
```
**Behaviors**
- next/image with `fill`, `aspect-video`, lazy loading, explicit `sizes`.
- Badges: Founding Partner (navy), Featured Partner (pink), Hidden Gem (orange), Pet Friendly (teal).
- Description `line-clamp-2`, vibes max 3.
- Keyboard-accessible View Details (wired) + UBER-flag-gated Get a Ride.

**Limitations**
- Like/comment counts are read-only; no mutation pipeline yet.

---

### 4. `components/venue-detail-card.tsx` (143 LOC) + `components/venue-detail-modal.tsx` (96 LOC)
**Props**
```ts
interface VenueDetailCardProps {
  venue: FeedCard;
  onClose?: () => void;
  onSignInRequired?: () => void;
  isAustinight?: boolean;
  showHeader?: boolean;
  className?: string;
}
interface VenueDetailModalProps {
  venue: FeedCard | null;
  onClose: () => void;
  onSignInRequired?: () => void;
  isAustinight?: boolean;
  className?: string; // e.g. `md:hidden`
}
```
**Behaviors**
- Card renders inline in the right sidebar on `md+`.
- Modal overlay with focus trap, ESC close, body-scroll lock, focus restoration on unmount — used only on `< md`.

**Limitations**
- Modal is passed `className="md:hidden"` by `page.tsx` so it doesn't double-render on tablet/desktop.

---

### 5. `components/que-pasa-carousel.tsx` (177 LOC)
**Props**
```ts
interface QuePasaCarouselProps {
  photos: QuePasaPhoto[];
  onSubmitClick: () => void;
  className?: string;
}
```
**Behaviors**
- Hero placement on mobile.
- Auto-advance every 4000ms, paused under `prefers-reduced-motion`.
- Touch swipe (40px threshold) on `touchstart`/`touchend`.
- Prev/Next buttons, tab-style indicator dots, Google/Apple Maps links.
- Submit CTA → `onSubmitClick` (page-level `requireLogin()`).

**Limitations**
- Photos are hardcoded `QUE_PASA_PHOTOS`; submissions only reach the modal stub.

---

### 6. `components/community-feed.tsx` (116 LOC)
**Props**
```ts
interface CommunityFeedProps {
  posts: CommunityPost[];
  onPostClick: () => void;
  className?: string;
}
```
**Behaviors** — expandable posts (>120 chars), per-post report `role="menu"`, Post to Community CTA gated by `requireLogin()`.

**Limitations** — `alert('Report submitted…')` is a placeholder; no backend submission.

---

### 7. `components/pupper-weekly.tsx` (112 LOC)
**Props**
```ts
interface PupperWeeklyProps {
  hero: ZetaPost;
  gallery?: { id: string; photoUrl: string; name: string; venue: string }[];
  onSubmitClick: () => void;
  className?: string;
}
```
**Behaviors** — Zeta hero + 2-up gallery default, Barkingham Place Featured Partner badge (sacred pink use #3), Submit your pup CTA.

**Limitations** — Gallery defaults are hardcoded Unsplash images; replace with real data when backend exists.

---

### 8. `components/deals.tsx` (145 LOC)
**Props**
```ts
interface DealsProps {
  deals: Deal[];
  onListBusinessClick: () => void;
  now?: Date;
  className?: string;
}
```
**Behaviors**
- Auto-hides expired deals (`daysUntil(d.expiresDate, now) < 0`).
- Category filter tabs (All / Auto / Services / Grocery / Beauty / Pets / Food).
- Featured-tier deals float to top + pink Featured Partner badge.
- Expires-in-X-days pill changes color at 7d / 3d thresholds.
- List Your Business CTA opens `<BusinessPartnerModal>`.

**Limitations** — `Deal[]` is static; no admin interface for publishing.

---

### 9. `components/after-this.tsx` (195 LOC)
**Props**
```ts
interface AfterThisProps {
  parties: AfterParty[];
  activeEvent?: MajorEvent;
  onSubmit?: (payload: { category: AfterPartyEvent; location: string }) => void;
  className?: string;
}
```
**Behaviors**
- Event tabs (SXSW / ACL / COTA / Longhorns / Austin FC / Rodeo).
- Tabs that match `activeEvent` glow with an orange ring + 🔥 badge.
- Submission form (category + public address) → `onSubmit` (moderation queue).

**Limitations** — `onSubmit` is not wired to a real queue; success state is local.

---

### 10. `components/were-austin-calendar.tsx` (126 LOC)
**Props**
```ts
interface WereAustinCalendarProps {
  events: MajorEvent[];
  now?: Date;
  className?: string;
}
```
**Behaviors**
- Headline `We're Austin — [SXSW | ACL | COTA | Rodeo | Longhorns | Verde | Every Night]` derived from `activeMajorEvent(now)`.
- 60-day horizontal scroll timeline, today highlighted with navy border.
- Each day shows up to 2 active-event pills, color-coded.

**Limitations** — Windows in `MAJOR_EVENTS` are approximate 2026 dates; update annually.

---

### 11. `components/comedy.tsx` (161 LOC)
**Props**
```ts
interface ComedyProps {
  shows: ComedyShow[];
  className?: string;
}
```
**Behaviors**
- Venue-type tablist (All / Comedy Club / Major Venue).
- Date range from/to filters.
- Mobile `<400px`: `flex-col`. Tablet+ (`min-[401px]:`): `flex-row`.
- Sold-out badge, alcohol/food/venue-type pills, Tickets link.

**Limitations** — Static shows; add a CMS or ingest feed for auto-refresh.

---

### 12. `components/weird-funny-cool.tsx` (201 LOC)
**Props**
```ts
interface WeirdFunnyCoolProps {
  className?: string;
  onRequireLogin?: () => void;
}
```
**Behaviors**
- Label cycles Weird → Funny → Cool every 1500ms (paused under `prefers-reduced-motion`).
- Tap label → freezes category for submission.
- Photo upload (blob URL), caption, reCAPTCHA placeholder (bypassed when `RECAPTCHA_SITE_KEY` is empty).
- Post-submit voting: 3 emoji buttons, each user votes once (local state).

**Limitations** — reCAPTCHA is a checkbox placeholder until `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set.

---

### 13. `components/austin-pulse.tsx` (124 LOC)
**Props**
```ts
interface AustinPulseProps {
  posts: LivePost[];
  className?: string;
}
```
**Behaviors** — live-post list with typed badges (update / deal / event / alert / music), per-post local like toggle, report `role="menu"`. Mobile renders in main stack; `md+` renders in right sidebar.

**Limitations** — Likes don't persist; reports are `alert()` stubs.

---

### 14. `components/signup-modal.tsx` (325 LOC)
**Props**
```ts
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
```
**Behaviors**
- Two-step (welcome → signup) with back button.
- Fields: phone/email, password, instagram, role (AustiNight / Tourist), years (AustiNight only), terms, reCAPTCHA.
- Founding AustiNights counter: reads `raln:founding_count` from `localStorage` (base 246, cap 500), increments on successful submit.
- ESC close, focus trap, body-scroll lock.
- Sacred pink CTA (use #4: "Let's Go!" submit button).

**Limitations** — No real backend; `onSignedUp` just flips app-level state. Password is collected but never validated server-side.

---

### 15. `components/business-partner-modal.tsx` (294 LOC)
**Props**
```ts
interface BusinessPartnerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: BusinessPartnerSubmission) => void;
}
export interface BusinessPartnerSubmission {
  businessName: string; address: string; category: string;
  ownerContact: string; instagram: string; twitter: string;
  tiktok: string; photoDataUrl: string | null; offering: string;
}
```
**Behaviors** — Business name, address, category (dropdown of 14), owner contact, IG/X/TikTok handles, photo upload, offering textarea. ESC close, focus trap, body-scroll lock. Shows a success screen on submit.

**Limitations** — `onSubmit` is a no-op from `page.tsx`; submissions never leave the browser.

---

### 16. `components/footer.tsx` (58 LOC)
**Props**
```ts
interface FooterProps {
  onFoundingClick?: () => void;
}
```
**Behaviors** — Brand wordmark + tagline + AI subline + social links (Instagram live, X live, TikTok → `/coming-soon` marked "In Work"). Pink "Become a Founding AustiNight" CTA when `onFoundingClick` is passed.

**Limitations** — Social URLs are hardcoded to `@realaustinights` handles.

---

## 6. Feature Flags

Source: `lib/flags.ts`

| Flag | Default | Purpose | How to enable |
|---|---|---|---|
| `UBER_ENABLED` | `false` | Show "Get a Ride" buttons on `<FeedCard>` and `<VenueDetailCard>` | Flip to `true` in `lib/flags.ts` once Uber Link API wiring exists |
| `ADSENSE_ENABLED` | `false` | Not referenced yet; reserved | Same |
| `STRIPE_ENABLED` | `false` | Not referenced yet; reserved for subscription / ticket flows | Same |
| `RECAPTCHA_SITE_KEY` | `''` (from `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`) | When non-empty, SignupModal and WeirdFunnyCool require the "I'm not a robot" checkbox; stub label changes to indicate the real widget | Add key to `.env.local` (template at `.env.local.example`) and wire the real v3 widget in the two components |
| `PLAUSIBLE_DOMAIN` | `''` (from `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`) | When non-empty, `app/layout.tsx` injects `<script data-domain=X src="https://plausible.io/js/script.js" defer>` | Add domain to `.env.local` |

**No client-side import of `process.env`** outside `lib/flags.ts`; components read the exported constants.

---

## 7. Dead Button Audit

| Location | Button | Status |
|---|---|---|
| Header desktop nav | Tonight | ✅ Working (`setTab('Tonight')` + scroll to `#feed`) |
| Header desktop nav | Hidden Gems | ✅ Working (adds `Hidden Gems` cat + scroll) |
| Header desktop nav | For Business | ✅ Working (scroll `#partner-cta` + open BusinessPartnerModal) |
| Header desktop nav | Sign Up (pink) | ✅ Working (opens SignupModal) |
| Header mobile | Sign Up (pink) | ✅ Working |
| Header mobile | Hamburger | ✅ Working (opens drawer) |
| Header drawer | Tonight / Hidden Gems / For Business | ✅ Working |
| FeedCard | View Details | ✅ Working (sets `selected`, opens card/modal) |
| FeedCard | Get a Ride 🚗 | 🚫 Hidden via `UBER_ENABLED=false` |
| VenueDetailCard/Modal | ← Back | ✅ Working (closes) |
| VenueDetailCard/Modal | Get a Ride Here | 🚫 Hidden via `UBER_ENABLED=false` |
| VenueDetailCard/Modal | Sign in → | ✅ Working (opens SignupModal) |
| QuePasaCarousel | Prev / Next arrows | ✅ Working |
| QuePasaCarousel | Dot indicators | ✅ Working (jump to photo) |
| QuePasaCarousel | Submit your photo | ✅ Working (requireLogin gate) |
| QuePasaCarousel | Google Maps / Apple Maps links | ✅ External anchors |
| CommunityFeed | Post to Community | ✅ Working (requireLogin) |
| CommunityFeed | Read more / Show less | ✅ Working (local state) |
| CommunityFeed | Report post | ⚠️ Placeholder (`alert()`) |
| PupperWeekly | Submit your pup | ✅ Working (requireLogin) |
| Deals | List Your Business | ✅ Working (opens BusinessPartnerModal) |
| Deals | Category tabs | ✅ Working |
| AfterThis | Event tabs | ✅ Working |
| AfterThis | Submit a spot / Send to moderators | ⚠️ Placeholder (local success state only) |
| AfterThis | Google Maps / Apple Maps links | ✅ External anchors |
| WereAustinCalendar | (read-only timeline, no buttons) | — |
| Comedy | Venue-type / date filters | ✅ Working |
| Comedy | Tickets → | ✅ External anchor |
| WeirdFunnyCool | Cycling label (tap to freeze) | ✅ Working |
| WeirdFunnyCool | Photo upload + Submit | ⚠️ Placeholder (local state; requires login; no backend) |
| WeirdFunnyCool | Vote Weird / Funny / Cool | ✅ Working (local state, one vote per session) |
| AustinPulse | Like ❤️ / 🤍 | ✅ Working (local state, doesn't persist) |
| AustinPulse | Report | ⚠️ Placeholder (`alert()`) |
| SignupModal | Sign Up Now / Not Now / Let's Go / Back | ✅ All working |
| BusinessPartnerModal | Submit for review | ⚠️ Placeholder (shows success screen but `onSubmit` is a no-op in page.tsx) |
| Footer | Instagram / X | ✅ External anchors |
| Footer | TikTok (In Work) | ✅ Links to `/coming-soon` stub |
| Footer | Become a Founding AustiNight | ✅ Working (opens SignupModal) |

**Summary:** 0 dead buttons. 5 placeholder buttons (Report x3, submit-a-spot x1, business submission x1) — each has a visible UX response but no backend delivery.

---

## 8. Brand Compliance

### Pink (`#FF69B4`) usage audit — SACRED

Per CLAUDE.md: "Pink is SACRED — memorial to Rudy's late wife. Use ONLY for: Sign Up CTAs, Featured Partner badges, Founding AustiNight badges, Pupper Weekly highlights. NEVER decorative."

| Location | Justification |
|---|---|
| `Header.tsx` — desktop `Sign Up` + mobile `Sign Up` buttons (`bg-pink`) | ✅ Sign Up CTA |
| `SignupModal.tsx` — "Let's Go!" submit button + Founding AustiNights counter pill (`bg-pink`, `bg-pink/10`, `text-pink`) | ✅ Sign Up CTA + Founding AustiNight badge |
| `ui/badges.tsx` — `<FeaturedPartnerBadge>` (`bg-pink`) | ✅ Featured Partner badge |
| `Deals.tsx` — `sponsorTier === 'featured'` card gets `border-pink/40 bg-pink/5` + FeaturedPartnerBadge | ✅ Featured Partner badge |
| `PupperWeekly.tsx` — Barkingham Place pill (`bg-pink`) | ✅ Pupper Weekly highlight |
| `Footer.tsx` — "Become a Founding AustiNight" CTA (`bg-pink`) | ✅ Founding AustiNight badge / CTA |

**Zero decorative uses.** No pink backgrounds on non-sacred elements, no pink text outside these contexts, no pink borders on non-partner components.

### Name spelling verification

Per the final brand-law enforcement:
```bash
$ grep -rn "Austinite" . --include="*.tsx" --include="*.ts" --include="*.md"
$ echo $?
1   # grep exit 1 = zero matches
```

Also zero `AustinNights` (doubled-n) and zero `AustiNite` (no g).

| Context | Display form |
|---|---|
| Brand / plural / group of users | `AustiNights` |
| Singular user tier (one person) | `AustiNight` |
| Domains (lowercase, unchanged) | `realaustinights.com`, `realaustinight.com` |

Internal TypeScript identifiers also aligned: `UserMode = 'austinight' | 'tourist' | null`, prop `isAustinight`.

### Color + font adherence

Colors declared once in `app/globals.css` `@theme` and mirrored in `lib/theme.ts`:
- `cream #FFFAF3`, `teal #007A7A` + `teal-light #E8F5F5`
- `orange #FF8C00` + `orange-light #FFF4E6`
- `navy #1B2A4A` + `navy-light #E8EDF5`
- `red #BF0A30`, `green #00A86B`, `pink #FF69B4`
- `ink #1B2A4A`, `ink-mid #4A5568`, `ink-light #A8A29E`, `hairline #E8DFD0`

Fonts bound to Tailwind utilities:
- `font-sans` → `--font-open-sans` (Open Sans 400/500/600/700)
- `font-display` → `--font-montserrat` (Montserrat 500/600/700/800/900)
- `font-serif` → `--font-playfair` (Playfair Display 700/800/900)

Zero inline `style={...}` attributes in any component. All color/font/spacing via Tailwind utilities.

---

## 9. Accessibility Compliance

| Item | Status | Evidence |
|---|---|---|
| Semantic HTML | ✅ | `<header>`, `<nav aria-label>`, `<main id="main">`, `<section aria-label>` ×11, `<article>` (feed cards), `<footer role="contentinfo">`, `<aside aria-label>` (sidebars), `<dl>` (venue facts) |
| Skip-to-main link | ✅ | `app/layout.tsx`: `<a href="#main" className="skip-link">` — visible on focus only |
| `lang="en"` on `<html>` | ✅ | `app/layout.tsx` |
| Role + `aria-selected` on tabs | ✅ | Date tabs, vibe tabs, category tabs, event tabs, venue-type tabs, photo-indicator tabs |
| `aria-live="polite"` on live ticker | ✅ | `components/header.tsx` |
| `aria-modal="true"` + focus trap on modals | ✅ | SignupModal, BusinessPartnerModal, VenueDetailModal (each with Tab/Shift+Tab cycle, ESC close, focus restoration on unmount) |
| `aria-pressed` on toggle buttons | ✅ | Vibe filters, category filters, mode picker, WFC vote buttons, like buttons |
| `aria-label` on icon-only buttons | ✅ | Hamburger, modal close, carousel prev/next, dot indicators, report menus, like toggles, view-details, get-a-ride |
| `alt` on every `<Image>` | ✅ | Logo, feed cards, venue cards, que-pasa photos, pupper gallery, comedy headshots |
| `alt="..."` on blob `<img>` | ✅ | WFC preview: "Selected preview"; BusinessPartner preview: "Uploaded preview" |
| `focus-visible:outline` on all interactive | ✅ | Every `<button>` and link has `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2` |
| `prefers-reduced-motion` | ✅ | Global rule in `globals.css` + `usePrefersReducedMotion()` hook gates Que Pasa auto-advance, Header ticker rotation, WFC label cycling; Tailwind `motion-reduce:` used on hover transforms and animations |
| Form labels | ✅ | Every input has `<label>` or `aria-label` |
| Color contrast | ⚠️ | `ink-light #A8A29E` on `cream #FFFAF3` ≈ 3.1:1 (below WCAG AA 4.5 for body text). Used only for supplementary info (timestamps, counts, helper hints). Main body text uses `ink #1B2A4A` or `ink-mid #4A5568` — both pass. |
| Axe-core programmatic audit | ❌ | Not yet run. Recommended next step — integrate `@axe-core/playwright` into `tests/smoke.spec.ts`. |

---

## 10. Performance

| Item | Status |
|---|---|
| `next/image` usage | All remote images (Unsplash feed photos, Que Pasa, comedy, pupper gallery, mini tiles). 2 remaining `<img>` are `URL.createObjectURL` blob previews (unoptimizable). |
| Image optimization pipeline | Enabled via `images.remotePatterns` for `images.unsplash.com`. SSR emits `<link rel="preload" imageSrcSet="…">` for the QuePasa hero (verified — 1 preload found in initial HTML). |
| Lazy loading | `loading="lazy"` on all non-priority feed cards. `priority` set only on logo + QuePasa photo index 0. |
| Font loading | `next/font/google` with `display: 'swap'`; fonts self-hosted and preloaded by Next's font pipeline — no render-blocking external requests to `fonts.googleapis.com`. |
| External preconnect | `<link rel="preconnect"/>` + `dns-prefetch` to `images.unsplash.com` in `<head>`. |
| Debounced search | 300ms via `useDebounced()` — avoids per-keystroke filter work. |
| Memoized filter | `useMemo` on feed filter combining tab/vibes/cats/search. |
| Bundle | Next 16 + Turbopack build reports "Compiled successfully in ~1.1s". 13 chunks in `.next/static/chunks/`; total static directory ≈1.4 MB (includes CSS, images, fonts). Next 16's build summary no longer prints per-route First Load JS totals — analysts can run `npx next build --profile` for detail. |
| Runtime warnings | Zero in `npm run dev` log during SSR smoke test. |
| Hydration safety | `activeMajorEvent()` is gated by `useMounted()` because it reads `new Date()` — prevents server/client drift on the "We're Austin — X" headline and the today marker in the calendar. |

---

## 11. SEO

### Metadata (`app/layout.tsx` via `lib/seo.ts`)
- `metadataBase`: `https://realaustinights.com`
- Title template: `%s · Real AustiNights` (default: `Real AustiNights — Austin Nightlife, For Real`)
- Description: "Austin's nightlife, by AustiNights. Live venues, hidden gems, deals, and the city's real-time pulse — curated nightly, AI-assisted, locally verified."
- Keywords: Austin, Austin nightlife, Austin bars, Austin live music, SXSW, ACL, COTA, Austin events, Keep Austin Weird, Rainey Street, Red River, East Austin, hidden gems Austin
- `openGraph`: type=website, 1200×630 `og:image` (placeholder at `/og-default.png` — **not yet present on disk**), site name, locale `en_US`
- `twitter`: `summary_large_image` card
- `robots`: index + follow
- `icons`: `/favicon.ico`

### Schema.org JSON-LD (`components/json-ld.tsx`, injected in `app/page.tsx`)
Verified SSR output: **14 `<script type="application/ld+json">` documents** in initial HTML:
- 1 × `ItemList` of up to 20 `LocalBusiness` venues (via `VenuesJsonLd`)
- 6 × `Event` for comedy shows (`EventsJsonLd`)
- 7 × `Event` for after-parties (`EventsJsonLd`)

Each event includes `location` (Place + PostalAddress), `offers` if priced, and `organizer` set to Real AustiNights.

### Semantic HTML + social cards
- Skip-to-main anchor for screen readers (also a minor SEO positive).
- Preconnect to `images.unsplash.com` improves Largest Contentful Paint.
- Clean `<h1>` / `<h2>` / `<h3>` hierarchy — no heading-level skips.

### Gaps
- `/og-default.png` referenced by metadata does **not** exist in `/public`. Either add one or remove the reference before production crawling.
- No sitemap.xml or robots.txt. Next 16 supports `app/sitemap.ts` and `app/robots.ts` — straightforward to add.
- No structured breadcrumbs yet.

---

## 12. Playwright Test Coverage

Config: `playwright.config.ts` — 2 projects (`desktop` = Desktop Chrome; `mobile` = Pixel 5 on Chromium). Webkit intentionally skipped (only chromium browser is installed; adding webkit is one `npx playwright install webkit` away).

**Current tests (`tests/smoke.spec.ts`):**

| # | Name | Desktop | Mobile |
|---|---|---|---|
| 1 | homepage loads and shows the feed heading | ✅ | ✅ |
| 2 | Sign Up button opens the signup modal | ✅ | ✅ |
| 3 | search bar filters feed venues (debounced) | ✅ | ✅ (opens drawer first) |
| 4 | clicking View Details opens the venue detail | ✅ | ✅ |
| 5 | Weird / Funny / Cool label cycles | ✅ | ✅ |
| 6 | date tabs switch feed content | ✅ | ✅ |

**Total: 12/12 passing** (~6 seconds end-to-end).

**Not covered — recommended additions:**
- Category toggle behavior (All mutex)
- Vibe filter compounding
- Modal focus trap (Tab cycling stays within dialog)
- ESC closes modals
- Touch-swipe on Que Pasa carousel
- WFC freeze/unfreeze + submission flow
- Founding AustiNights counter persistence across reloads
- axe-core a11y scan on every page
- Visual regression / screenshot tests

---

## 13. Known Gaps & Technical Debt

| Area | Gap | Severity |
|---|---|---|
| Auth | No real backend; `isSignedUp` is in-memory React state. No password hashing, no session, no email verification, no phone OTP. | HIGH — blocks go-live |
| Data persistence | `Deal[]`, `FeedCard[]`, `ComedyShow[]`, `AfterParty[]`, `CommunityPost[]`, `LivePost[]`, `QuePasaPhoto[]`, `MajorEvent[]` all static in `lib/data.ts`. No CRUD. | HIGH — blocks go-live |
| Submissions | QuePasa photo, WFC submission, Community post, AfterThis spot, BusinessPartner signup, Pupper submission — all show local success states but transmit nothing. | HIGH — blocks go-live |
| Moderation queue | Referenced in copy but nonexistent. | HIGH |
| Reports | `alert()` stubs on CommunityFeed + AustinPulse. | MEDIUM |
| Uber integration | Hidden by `UBER_ENABLED=false`. Needs Uber Universal Link wiring or Lyft fallback. | LOW (flagged) |
| Stripe integration | Flag reserved, no code yet. | LOW (flagged) |
| AdSense | Flag reserved, no code yet. | LOW (flagged) |
| reCAPTCHA | Checkbox placeholder in SignupModal + WFC. Real v3 widget needs client script injection + server verification. | MEDIUM |
| Plausible | Script tag injected when env var set, but no custom goals/events. | LOW |
| Weather | Hardcoded 82° clear. No API. | LOW |
| Likes / votes | Local React state only, don't persist across reloads. | MEDIUM |
| Skeletons | Components exist but never render (data is synchronous). Ready when sections go async. | LOW |
| `/og-default.png` | Referenced by metadata, not in `/public`. | MEDIUM (crawlers will 404) |
| `sitemap.ts` / `robots.ts` | Not yet present. | LOW |
| `page.tsx.bak` | V7 monolith still tracked in git. | LOW (cleanup) |
| Webkit/Safari browser test | Playwright mobile project uses Chromium-emulated viewport instead of real Webkit. | LOW |
| Axe-core scan | Not yet integrated into Playwright. | MEDIUM |
| Major events 2027+ | `MAJOR_EVENTS` only has 2026 windows. | LOW (annual refresh) |
| Comedy show dates | Anchored to April 2026 in `COMEDY_SHOWS`. | LOW (refresh with real bookings) |
| JSON-LD after-party dates | Uses `new Date().toISOString().slice(0, 10)` for `startDate` — correct but imprecise. | LOW |

---

## 14. Data Sources

| Dataset | Source | Go-live requirement |
|---|---|---|
| `FEED_CARDS` | Hardcoded in `lib/data.ts` (13 venues) | Needs CMS + API for venue CRUD; Partner self-serve claim flow |
| `QUE_PASA_PHOTOS` | Hardcoded (6 Unsplash photos) | User submission pipeline + moderation queue + S3/CDN storage |
| `AFTER_PARTIES` | Hardcoded (7 parties) | Editorial curation + event-owner submissions |
| `COMEDY_SHOWS` | Hardcoded (6 shows, April 2026) | Ticketmaster / comedy-club feeds or manual editorial |
| `LIVE_POSTS` | Hardcoded (7 posts) | Real-time feed from partner-account posts (Instagram-like) |
| `COMMUNITY_POSTS` | Hardcoded (5 posts) | Real posts + moderation + account linking |
| `ZETA_POST` + pupper gallery | Hardcoded (4 images) | User submission flow — Barkingham Place to curate |
| `DEALS` | Hardcoded (9 deals) | Partner deal intake + expiry monitor + sponsor-tier subscription |
| `HEADLINES` | Hardcoded (8 headlines) | Editorial CMS or daily AI-generated refresh |
| `MAJOR_EVENTS` | Hardcoded (2026 windows) | Annual refresh script — ideally pulled from Austin city event API |
| Weather | Default 82° clear | OpenWeather or Tomorrow.io integration |
| Founding AustiNights count | `localStorage` key `raln:founding_count`, base 246 | Server-backed counter to avoid client-side tampering |

---

## 15. Go-Live Checklist

Before deploying to Vercel:

**Content / Assets**
- [ ] Upload `/og-default.png` (1200×630) to `/public` — referenced by metadata
- [ ] Replace Unsplash placeholder photos with licensed images or real user submissions
- [ ] Verify all `FEED_CARDS` addresses and price ranges
- [ ] Confirm `MAJOR_EVENTS` 2026 dates against official calendars (SXSW, ACL, COTA, Rodeo, Longhorns, Austin FC)

**Configuration**
- [ ] Copy `.env.local.example` → `.env.local`; fill in `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] Set the same env vars in the Vercel project settings
- [ ] Verify `realaustinights.com` domain is attached in Vercel + `realaustinight.com` either redirects to it or has its own deploy
- [ ] Configure DNS records for both domains

**Backend prerequisites**
- [ ] Stand up auth (recommend NextAuth.js or Clerk for phone+email)
- [ ] Stand up database for: users, venues, submissions (photo/WFC/community/after-party/business-partner), moderation queue, likes, votes, reports, founding-AustiNight counter
- [ ] Stand up image upload pipeline (S3 or Vercel Blob) for QuePasa / WFC / BusinessPartner photos
- [ ] Implement real API routes (`app/api/...`) to wire the existing `onSubmit` / `onPostClick` / `onSignedUp` callbacks
- [ ] Replace `alert()` report stubs with an admin-notifying endpoint

**Hardening**
- [ ] Integrate `@axe-core/playwright` into the smoke suite
- [ ] Run `npx next build --profile` and audit First Load JS; split vendor chunks if the initial HTML exceeds ~150KB gzip
- [ ] Consider `app/sitemap.ts` and `app/robots.ts`
- [ ] Enable reCAPTCHA v3 (replace checkbox placeholder)
- [ ] Device-test on a real iPhone at `http://192.168.1.51:3000` before deploy
- [ ] Delete `app/page.tsx.bak` once the V7 reference is no longer needed

**Brand / Legal**
- [ ] Confirm pink-only rule with Rudy one more time before shipping
- [ ] Add Terms of Service + Privacy Policy pages linked from SignupModal + Footer
- [ ] Add `✝️` credit where required

---

## 16. QA Handoff

### Dev server
```bash
npm run dev
# → http://localhost:3000
# → LAN: http://192.168.1.51:3000 for iPhone device testing
```

### Production build
```bash
npm run build
# → must compile clean; fails on any TypeScript error
npm run start
# → serves the production build on :3000
```

### Tests
```bash
# Full smoke suite (desktop + mobile), ~6s
npx playwright test
# or: npm test

# Desktop only
npm run test:smoke

# With UI (inspect failures visually)
npx playwright test --ui

# Single test
npx playwright test --grep "Sign Up button"
```

### Brand-law verification
```bash
grep -rn "Austinite" . --include="*.tsx" --include="*.ts" --include="*.md"
# → must be empty
grep -rn "AustinNights" . --include="*.tsx" --include="*.ts" --include="*.css"
# → must be empty
grep -rn "AustiNite" . --include="*.tsx" --include="*.ts"
# → must be empty
```

### Deploy-blocker issues (must be resolved before Vercel)
1. **No auth backend.** Signups do nothing server-side.
2. **No data persistence layer.** Every list is `lib/data.ts` static.
3. **5 placeholder submit flows.** QuePasa / WFC / Community post / AfterThis / BusinessPartner all show local success but deliver nothing.
4. **`/og-default.png` missing from `/public`.**
5. **reCAPTCHA placeholder** — bots can spam form endpoints once backed.
6. **No rate limiting / abuse protection** on any client-side endpoint (there are no endpoints yet).

### Non-blocking but recommended
- Integrate axe-core programmatic a11y scan into Playwright
- Add `app/sitemap.ts` + `app/robots.ts`
- Delete `app/page.tsx.bak`
- Add a real weather API
- Persist Founding AustiNights counter server-side
- Device-QA on iPhone 13+ and Android (Pixel 5 emulator already passes)

---

**End of report.**

— Generated by Claude Opus 4.7 (1M context) at commit `000950d` on branch `main`.
