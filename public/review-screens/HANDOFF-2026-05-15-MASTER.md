# Real AustiNights — MASTER Handoff (2026-05-15)

**Author:** Claude Code (Opus 4.7) acting as implementation lead under Vinci orchestration
**For:** OpenClaw agents, ChatGPT/GPT, and any next-agent that walks in cold
**Repo:** `/Users/vinci/realaustinights`
**Branch:** `repair/auth-session-20260507-020256` (NOT main; dirty working tree; no commits this session)
**Live dev URL:** `http://127.0.0.1:3001/`

**This is the single canonical doc for everything done across the 2026-05-15 sessions.** Read it cold and pick up the work. Earlier handoffs (`2026-05-15-openclaw-realaustinights-handoff.md`, `2026-05-15-openclaw-realaustinights-handoff-v2.md`) are now sub-documents of this master.

---

## 0. ONE-PAGE TL;DR

**Wins today:**
1. Profile-row blocker (the long-standing "all 3 confirmed auth users have zero matching public-table rows" issue) — **RESOLVED.** New `public.profiles` table + `handle_new_user()` trigger now auto-creates a profile row on every Supabase Auth signup. Backfill verified 3/3/3.
2. "Founding Partner" → "Founding Member" copy sweep landed in source.
3. Dead `components/header.tsx` (199 LOC, zero imports) deleted.
4. Hero CTA hit boxes ("Find Your Night" / "Explore Tonight") given hover/active/focus feedback.
5. Join Membership + Sign Up CTAs hardened: anchor→button to eliminate default-navigation race.
6. Homepage rescue (gold-master visuals, locked H2 "Tonight in Austin", 14 category pills, asset-first Signal map) — accepted as visual baseline. Uncommitted but stable.

**Issues still open (in priority order):**
1. **MODAL-OPEN BUG** at http://127.0.0.1:3001/ — clicking Sign Up or Join Membership sets `#signup` hash but the SignupModal does not render. Source-level fix applied this evening; **VERIFICATION BLOCKED** because the running `next dev` (PID 21374, started May 7) has broken HMR. Rudy must restart the dev server, then re-run the Playwright probe.
2. **No RLS policies** on `public.profiles` yet. RLS is enabled. App reads will be blocked when the app actually queries this table. Needs `SELECT`/`UPDATE` for authenticated where `id = auth.uid()`.
3. **reCAPTCHA v3** not wired anywhere. Pre-launch blocker for signup / signin / posts / likes.
4. **Hi-res visual assets missing:** transparent wordmark, cityscape-only crop, cleaner signal-map re-crop. Blocks final visual polish; doesn't block auth.
5. **Outreach copy** still claims a viral venue feed — only iOS `navigator.share` is verified. Either ship the backend or pull the claim.

**Hard rules respected all session (Vinci doctrine):**
- No git commit. No deploy. No `reset --hard`. No `--force` except `git rm -f` on a confirmed-dead file.
- No edits to `app/auth/callback/route.ts`, `app/auth/confirm/route.ts`, `components/signup-modal.tsx`, `lib/supabase/*`, env files, OR any production deploy target.
- No OpenClaw doctor / fix / cleanup.
- No secrets requested (keys, tokens, magic links, emails, confirmation URLs, passwords).
- One command / one UI action at a time during diagnostic phases.

---

## 1. Background — what state the project was in at session start

Real AustiNights is in pre-launch beta. Three test users existed in Supabase Auth (Gmail, Protonmail, iCloud) — all `email_confirmed = true` — but **zero matching rows** in the (presumed) `public.users` table. This had been the blocker for going to production for weeks. The repo also had a half-rewritten homepage in the working tree from earlier rescue work.

The user (Rudy) operates an "agent atelier": Vinci as orchestrator, Claude Code as implementation lead, OpenClaw + GPT as auxiliary agents, with Obsidian vaults as durable memory. Vinci doctrine forbids agents from asking for secrets and forbids destructive shortcuts.

---

## 2. ISSUE → RESOLUTION matrix (chronological, with full data)

### 2.1 Issue: Misdiagnosed schema — `public.users` is NOT a profile table

**Symptom:** Previous handoffs assumed `public.users` was the auth-linked profile table. Path A (recommended in the morning handoff) was to create a trigger inserting `(new.id, new.email, now())` into `public.users`.

**Reality (discovered today via schema introspection):**

`public.users` schema:
```
email             text         NOT NULL   (no default)
id                bigint       NOT NULL   (no default — must supply)
phone             text
instagram_handle  text
x_handle          text
is_founding_member boolean    NOT NULL   (no default)
founding_member_number integer
```

- Unique index on `lower(trim(email))` — email is the natural key.
- `id` is `bigint`, not `uuid`. **Cannot be FK-linked to `auth.users.id` (which is uuid).**
- This table is a **founding-member tracker**, capped at 500, with explicit manual promotion. NOT a per-user profile table.

**Failure mode of Path A:** Attempting `insert into public.users (id, ...) values (new.id, ...)` where `new.id` is uuid and the column is bigint produces:
```
ERROR: 42883: operator does not exist: uuid = bigint
```
**Critical:** because the trigger fires `AFTER INSERT on auth.users FOR EACH ROW`, a raised exception in the trigger **rolls back the auth.users insert**, blocking new signups entirely. The broken trigger was created mid-session and immediately dropped to unblock signups.

**Resolution: Path 2** — separate `public.profiles` table, applied via Supabase Dashboard SQL Editor:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  instagram_handle text,
  x_handle text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (id, email, instagram_handle)
  values (new.id, new.email, nullif(new.raw_user_meta_data->>'instagram', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

Backfill for the 3 existing test users:
```sql
insert into public.profiles (id, email, instagram_handle)
select id, email, nullif(raw_user_meta_data->>'instagram', '')
from auth.users
on conflict (id) do nothing;
```

**Verifications passed:**
- `profiles_table_exists, profiles_column_count, rls_enabled_count = true, 7, 1`
- `handle_new_user_function_count, on_auth_user_created_trigger_count = 1, 1`
- `auth_users_count, profiles_count, matched_rows_count = 3, 3, 3`
- Synthetic admin-created user (via Dashboard → Authentication → Users → Add user) → row appears in `public.profiles` automatically.

**Caveat:** These SQL objects live ONLY in Supabase. They are not committed to the repo. If the project is rebuilt or moved, this SQL must be re-applied. There is no migration file.

**Caveat 2:** RLS is enabled but **no policies exist yet**. The app does not currently query `public.profiles`, so this hasn't broken anything. The moment app code does `from('profiles').select(...)`, reads will return empty. Policies needed:
```sql
-- Recommended (not yet applied):
create policy "users read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
```

---

### 2.2 Issue: Repo has no code path writing to either user-related table

**Symptom:** Even before today, all 3 auth users had `public_users_email_row_count = 0`.

**Code-side audit (read-only) on `/Users/vinci/realaustinights`:**

| Probe | Result |
|---|---|
| `from('users')` / `from('profiles')` anywhere | 0 matches |
| SQL files / `migrations/` / `supabase/` dir | none exist |
| `handle_new_user`, `on_auth_user_created` strings | 0 matches |
| `ensureProfile`, `upsertProfile`, `rpc` | 0 matches |
| `app/auth/callback/route.ts` | only `exchangeCodeForSession` — no DB insert |
| `app/auth/confirm/route.ts` | only `verifyOtp` / `exchangeCodeForSession` — no DB insert |
| `components/signup-modal.tsx` | `supabase.auth.signUp({ data: { instagram } })` — Instagram lands in `auth.users.raw_user_meta_data`, NOT in any public table |

**Resolution:** Database trigger (§2.1). Repo code remains untouched. This is invisible to git — that's a known tradeoff; documented here so future agents don't go hunting for a phantom code path.

---

### 2.3 Issue: "Founding Partner" copy used in user-facing UI

**Symptom:** Badges and banner copy displayed "Founding Partner" — outreach standard is "Founding Member".

**Resolution applied this session:**

`components/ui/badges.tsx`:
```tsx
export function FoundingMemberBadge({ className }: { className?: string }) {
  return (
    <span className={clsx('...', className)}>
      Founding Member
    </span>
  );
}

// Backwards-compat alias to keep feed-card.tsx and venue-detail-card.tsx working
export const FoundingPartnerBadge = FoundingMemberBadge;
```

`components/header.tsx` banner edited too — but that file is dead code (see §2.4) and the edit doesn't surface in the live UI.

**Remaining "Founding Partner" references:** docs only (`V8-REBUILD-REPORT.md`, `public/review-screens/HANDOFF-2026-05-15.md`, `lib/data.ts` field `isFoundingPartner` which is a data-model name, not user-visible). Outreach docs/scripts in the Obsidian vault may still carry old copy — GPT/OpenClaw should sweep those.

---

### 2.4 Issue: Dead `components/header.tsx` (199 LOC)

**Symptom:** Top-level `components/header.tsx` was the legacy hero header for a previous homepage iteration. After the homepage rescue, `LockedHeader` (at `components/homepage/locked-header.tsx`) became the live header. The old file had zero imports.

**Verification:**
```
grep "components/header" → docs only (V8-REBUILD-REPORT.md)
grep "import .* Header.*from" → no matches in app/, components/, lib/
```

**Resolution:** `git rm -f components/header.tsx`. Typecheck still passes.

---

### 2.5 Issue: Hero CTA hit boxes invisible (no hover/tap feedback)

**Symptom:** The gold-master hero is a baked-in PNG with two transparent `<Link>` overlays on top of the "Find Your Night" and "Explore Tonight" button regions. Users had no tactile signal these areas were clickable.

**Resolution:** `components/homepage/hero-skyline-logo.tsx` — added `ring-1 ring-transparent transition hover:bg-pink/10 hover:ring-pink/40 active:bg-pink/20` to both overlay Links. `focus-visible:outline` preserved.

---

### 2.6 Issue: Modal-open bug (STILL OPEN PENDING DEV-SERVER RESTART)

**Symptom:** At http://127.0.0.1:3001/, clicking header **Sign Up** OR scrolling to `#membership` and clicking **Join Membership**:
- URL hash becomes `#signup` ✓
- `SignupModal` does NOT render ✗
- `welcome_text_visible: false`
- `document.querySelectorAll('.fixed.inset-0.z-50').length === 0`
- `document.querySelector('form') === null`
- No JS console errors (HMR WebSocket failures are unrelated)
- Same failure on direct load `http://127.0.0.1:3001/#signup`
- Same failure when setting `window.location.hash = '#signup'` via JS after load

**Wiring (verified by source-read):**
- `app/page.tsx` maintains `showSignup` state. Inline arrow:
  ```tsx
  onSignUpClick={() => {
    setShowSignup(true);
    if (typeof window !== 'undefined') {
      window.location.hash = 'signup';
    }
  }}
  ```
- This is passed to `HomepageShell` → `LockedHeader` + `FooterRoutingSection`.
- `<SignupModal open={showSignup} ... />` is always mounted. Returns `null` if `!open`.
- `useEffect` on mount: registers `hashchange` listener that calls `setShowSignup(window.location.hash === '#signup')` and fires once synchronously.

Logically the chain should work for all three trigger paths. Empirical failure suggests stale-bundle OR React state-management ordering bug.

**Mitigations applied (this session, on disk, NOT yet verified):**
1. `components/homepage/footer-routing-section.tsx`: `<a href="#signup" onClick={...}>` → `<button type="button" onClick={...}>`. Eliminates anchor default navigation racing with click handler.
2. `components/homepage/locked-header.tsx`: same conversion for the Sign Up CTA (the no-`signUpHref` fallback path).

**Critical environment fact blocking verification:**
- `ps aux | grep next-server` shows PID 21374 (`next-server v16.2.2`) was started Thu, May 7. Has been running for ~8 days.
- Browser console shows persistent `WebSocket connection to 'ws://127.0.0.1:3001/_next/webpack-hmr...' failed: Error during WebSocket handshake: net::ERR_INVALID_HTTP_RESPONSE`.
- SSR pass IS current (curl returns "Tonight in Austin", which only exists in post-May-12 source). Client bundle may NOT be current.

**Next-action protocol:**
1. **Rudy** kills PID 21374 and re-runs `npm run dev` from `/Users/vinci/realaustinights`. (This is a Rudy action — touches a running dev process the user owns.)
2. **Verifier agent** re-runs `node .artifacts/rescue-screens/check-join-membership.mjs` from repo root. Expected: `welcome_visible: true`, `backdrop: 1`.
3. **If still failing:** bug is genuine state-management, not stale bundle. Read `app/page.tsx` (showSignup + hashchange effect) and `components/signup-modal.tsx` (open prop + first-render path). Surgical fix only. Do NOT rewrite the modal.

---

### 2.7 Issue: Homepage was unfinished from a prior rescue attempt

**Symptom (state at session start):** working tree had ~764 lines of legacy single-file homepage in `app/page.tsx`, plus partial new homepage components. No visual baseline accepted.

**Resolution (landed in working tree, uncommitted, ACCEPTED as visual baseline):**

| File | Status |
|---|---|
| `app/page.tsx` | Reduced from ~764 LOC to ~133 LOC. Now a thin wrapper: `HomepageShell` + `BottomTabBar` + `SignupModal`. |
| `components/homepage/homepage-shell.tsx` | New. Wires LockedHeader, Hero, Tonight section, Signal panel, lower modules, image rail, footer. |
| `components/homepage/locked-header.tsx` | New. Replaces legacy `components/header.tsx` (now deleted). |
| `components/homepage/hero-skyline-logo.tsx` | Unified gold-master hero (no split-screen seam). Uses `/assets/goldmaster-hero-crop.png` with invisible Link overlays for "Find Your Night" and "Explore Tonight". |
| `components/homepage/category-pills.tsx` + data | 14 pills: Live Now, Live Music, Rooftops, Late Eats, Good Eats, Cocktails, Dancing, Comedy, Shopping, Sales, Brunch, Pet Sitting, Pet Friendly, Deals. |
| `components/homepage/event-venue-card-grid.tsx` + data | 4 venue cards: Mohawk ATX, Craft Pride, Cap City Comedy, Higher Ground. All clickable. |
| `components/homepage/signal-panel.tsx` | Asset-first map using `/assets/goldmaster-signal-map-crop.png` with 5 transparent Link overlays positioned at `mapX%, mapY%` matching the baked-in glow positions. Aspect ratio `aspect-[268/150]`. |
| `lib/homepage-mock-data.ts` | Signal hotspot coordinates: East 6th St 52%,32% • Rainey 48%,82% • South Congress 22%,22% • Downtown 36%,56% • East Austin 68%,56%. |
| `components/homepage/lower-modules-row.tsx` + data | 5 modules: Que Pasa, Community, Pupper Weekly, The Weather, Calendar. |
| `components/homepage/people-places-image-rail.tsx` + data | 3 editorial mood items. |
| `components/homepage/footer-routing-section.tsx` | "Join Membership" + "Community Guidelines" CTAs. |
| `components/bottom-tab-bar.tsx` | Mobile-only — verified hidden at 1440px desktop viewport. |

**H2 LOCKED** as "Tonight in Austin" (eyebrow: "Right Now"). Do not change without explicit Vinci approval.

**Click probe (Playwright @ 1440×900):** 22/22 expected interactive targets visible with real hrefs. `BottomTabBar` visible=false at 1440px (desktop hidden confirmed).

**Build PASS. Typecheck PASS.** Verified just now after this session's edits.

**Missing hi-res assets** (blockers for FINAL visual polish, NOT for auth):
- High-res transparent wordmark
- Cityscape-only hi-res crop
- Cleaner re-crop of signal-map (current asset has a thin strip of adjacent card baked into top edge)

---

## 3. ALL FILE EDITS in chronological order (this session — uncommitted)

### Morning session edits (homepage rescue + earlier copy work):

These were already in the working tree at start of evening session — listed for completeness so the next agent has a full picture.

- `app/page.tsx` — full rewrite as thin wrapper. Diff stat: ~600 lines removed.
- `app/community-guidelines/page.tsx` — modified.
- `components/bottom-tab-bar.tsx` — small tweaks (~20 lines).
- Multiple new files under `components/homepage/` (untracked).
- `lib/homepage-mock-data.ts`, `lib/homepage-types.ts` (untracked).
- `public/assets/` — gold-master image crops (untracked).
- `.artifacts/rescue-screens/` — Playwright harness + PNG screenshots.

### Evening session edits (this turn — the polish pass):

| File | Change |
|---|---|
| `components/ui/badges.tsx` | `FoundingPartnerBadge` → `FoundingMemberBadge` (rendered text + identifier). Alias `export const FoundingPartnerBadge = FoundingMemberBadge;` kept for backwards-compat. |
| `components/header.tsx` | **DELETED** via `git rm -f`. Dead code, zero imports. |
| `components/homepage/footer-routing-section.tsx` | "Join Membership": `<a href="#signup" onClick={...}>` → `<button type="button" onClick={...}>`. |
| `components/homepage/locked-header.tsx` | Sign Up CTA (no-`signUpHref` path): same anchor→button conversion. |
| `components/homepage/hero-skyline-logo.tsx` | Hero CTA overlays got `ring-1 ring-transparent transition hover:bg-pink/10 hover:ring-pink/40 active:bg-pink/20`. |
| `.artifacts/rescue-screens/check-join-membership.mjs` | New Playwright probe — confirms the modal-open bug. Living test, not a build artifact. |

### Database edits this session (Supabase Dashboard SQL Editor, NOT in repo):

- Created table `public.profiles` (uuid PK → auth.users.id, ON DELETE CASCADE; 7 columns; RLS enabled).
- Created function `public.handle_new_user()` (security definer, search_path=public).
- Created trigger `on_auth_user_created` AFTER INSERT on `auth.users` FOR EACH ROW.
- Backfilled `public.profiles` from existing `auth.users` rows (3 rows).

---

## 4. CURRENT WORKING-TREE STATE

```
M app/community-guidelines/page.tsx     (morning — accepted)
M app/page.tsx                          (morning — accepted)
M components/bottom-tab-bar.tsx         (morning — accepted)
M components/homepage/footer-routing-section.tsx  (evening — anchor→button)
M components/homepage/hero-skyline-logo.tsx       (evening — hover feedback)
M components/homepage/locked-header.tsx           (evening — anchor→button)
M components/ui/badges.tsx                        (evening — Founding Member rename + alias)
D components/header.tsx                           (evening — dead code deletion)
?? .artifacts/                          (Playwright harness + screenshots)
?? app/events/ app/guides/ app/membership/ app/tonight/ app/venues/  (homepage rescue routes)
?? components/homepage/                 (homepage rescue components)
?? docs/                                (handoff mirrors)
?? lib/homepage-mock-data.ts            (homepage rescue data)
?? lib/homepage-types.ts                (homepage rescue types)
?? public/assets/                       (gold-master image assets)
?? public/review-screens/               (handoff mirrors visible in browser)
```

**Nothing has been committed this session. Nothing has been pushed. Nothing has been deployed.**

---

## 5. ENVIRONMENT WARNINGS

### 5.1 Stale dev server (HIGH IMPACT)

- `next dev` (PID 21374, v16.2.2) running since Thu May 7.
- HMR WebSocket handshake fails consistently.
- Browser-side client bundle may be out of sync with source on disk.
- SSR pass confirmed current via curl. Client bundle is the unknown.
- **Action required from Rudy:** kill PID 21374, re-run `npm run dev` from `/Users/vinci/realaustinights`. Until this happens, no client-side verification is trustworthy.

### 5.2 Supabase objects live outside the repo

- `public.profiles`, `handle_new_user()`, `on_auth_user_created` — all created via Dashboard SQL Editor.
- No migration file in repo.
- If the project is rebuilt or moved (new Supabase project), the SQL in §2.1 must be re-applied.

### 5.3 OpenClaw + gateway state (unchanged from morning)

- OpenClaw 2026.5.4
- gateway loopback-only on 127.0.0.1:18789
- openclaw-web-search restored, ollama_web_search + ollama_web_fetch restored
- NOT to be doctor'd / fix'd / cleanup'd unless Rudy explicitly asks after fresh backup

---

## 6. NEXT-ACTION QUEUE (dependency-ordered)

1. **Rudy:** restart `npm run dev` (kill PID 21374, re-run from repo root).
2. **Verifier agent:** run `node .artifacts/rescue-screens/check-join-membership.mjs` from `/Users/vinci/realaustinights`. Expected post-restart: `welcome_visible: true`, `backdrop: 1` on both header Sign Up click and footer Join Membership click.
3. **If step 2 passes:** modal bug is fixed. Proceed to step 4.
4. **If step 2 fails:** modal bug is genuine state-management. Read `app/page.tsx` (showSignup state + hashchange useEffect) and `components/signup-modal.tsx` (open prop logic, first-render path). Surgical fix. Do NOT edit `signup-modal.tsx` body without explicit Vinci approval (doctrine).
5. **RLS policies on `public.profiles`** — Supabase Dashboard SQL Editor. Recommended SQL:
   ```sql
   create policy "users read own profile" on public.profiles
     for select using (auth.uid() = id);
   create policy "users update own profile" on public.profiles
     for update using (auth.uid() = id) with check (auth.uid() = id);
   ```
6. **reCAPTCHA v3 wiring** on signup/signin/posts/likes. Touches auth — needs explicit Vinci approval before any source edit. Probably the LAST blocker before production.
7. **Hi-res asset delivery** (transparent wordmark, cityscape crop, signal-map re-crop). Rudy / design action, not agent.
8. **Outreach copy sweep** in Obsidian vault — "Founding Partner" → "Founding Member"; viral-venue-feed claim either backed by code or pulled.

---

## 7. KEY FILE PATHS (for the next agent's bookmark bar)

| Purpose | Path |
|---|---|
| Live dev URL | `http://127.0.0.1:3001/` |
| Modal-bug Playwright probe | `/Users/vinci/realaustinights/.artifacts/rescue-screens/check-join-membership.mjs` |
| Click-probe full harness | `/Users/vinci/realaustinights/.artifacts/rescue-screens/_capture.mjs` |
| Homepage entry | `/Users/vinci/realaustinights/app/page.tsx` |
| Live header | `/Users/vinci/realaustinights/components/homepage/locked-header.tsx` |
| Footer Join Membership | `/Users/vinci/realaustinights/components/homepage/footer-routing-section.tsx` |
| Hero CTA overlays | `/Users/vinci/realaustinights/components/homepage/hero-skyline-logo.tsx` |
| Signal panel (asset-first map) | `/Users/vinci/realaustinights/components/homepage/signal-panel.tsx` |
| Signal hotspot coordinates | `/Users/vinci/realaustinights/lib/homepage-mock-data.ts` |
| Signup modal (DO NOT EDIT — doctrine) | `/Users/vinci/realaustinights/components/signup-modal.tsx` |
| Auth client (DO NOT EDIT — doctrine) | `/Users/vinci/realaustinights/lib/supabase/client.ts` |
| Auth session hook | `/Users/vinci/realaustinights/components/homepage/use-auth-session-state.ts` |
| Auth callback route (DO NOT EDIT — doctrine) | `/Users/vinci/realaustinights/app/auth/callback/route.ts` |
| Auth confirm route (DO NOT EDIT — doctrine) | `/Users/vinci/realaustinights/app/auth/confirm/route.ts` |
| Badges (Founding Member + alias) | `/Users/vinci/realaustinights/components/ui/badges.tsx` |
| Project doctrine | `/Users/vinci/realaustinights/AGENTS.md`, `/Users/vinci/realaustinights/CLAUDE.md` |
| Global agent doctrine | `/Users/vinci/.claude/CLAUDE.md` |
| Vinci preflight | `/Users/vinci/Documents/Vinci/AgentMemory/VINCI_PREFLIGHT.md` |
| Vinci current brief | `/Users/vinci/Documents/Vinci/AgentMemory/VINCI_CURRENT.md` |
| Morning handoff (root-cause analysis) | `/Users/vinci/Documents/Vinci/OpenClaw/Handoffs/2026-05-15-openclaw-realaustinights-handoff.md` |
| Evening handoff (v2, polish + bug) | `/Users/vinci/Documents/Vinci/OpenClaw/Handoffs/2026-05-15-openclaw-realaustinights-handoff-v2.md` |
| This MASTER handoff | `/Users/vinci/Documents/Vinci/OpenClaw/Handoffs/2026-05-15-MASTER-realaustinights-handoff.md` |
| Browser-visible mirror | `http://127.0.0.1:3001/review-screens/HANDOFF-2026-05-15-MASTER.md` (created at the end of this session) |
| Auto-memory index | `/Users/vinci/.claude/projects/-Users-vinci-realaustinights/memory/MEMORY.md` |
| Schema memory (canonical) | `/Users/vinci/.claude/projects/-Users-vinci-realaustinights/memory/project_supabase_schema_users_vs_profiles.md` |

---

## 8. OPTIMIZATION RECOMMENDATIONS (carried from morning, still standing)

### For OpenClaw

1. Lock 6-layer memory at startup. Fail-fast if Layer 2 (operational rules) or Layer 4 (current brief + handoff) unread.
2. Kill competing "current" files. One alias per domain (Real AustiNights, OpenClaw, Vinci). Older snapshots renamed `superseded-*`.
3. Codify Vinci as orchestrator-only. Startup assertion: "Vinci does not write code unless explicitly told 'Vinci hands-on'."
4. Promote the auth/profile/session decision tree to Layer 3 read-first. Three INDEPENDENT signals:
   - Auth user exists & confirmed?
   - `public.profiles` row exists? (NOT `public.users` — that's the founding-member tracker)
   - Header reflects signed-in?
5. Replace stale "Google scraping" memory with official Places API rules (use official APIs only; no Maps scraping; post-launch phase only).

### For GPT / ChatGPT

1. Enforce preflight read at conversation start. Must say "Read VINCI_CURRENT.md + latest handoff. Current state: [one-liner]" before accepting any directive.
2. **Booleans only.** Never ask for keys, tokens, emails, magic links, confirmation URLs, passwords. Only:
   - "Does the test user exist in Supabase Auth? (y/n)"
   - "How many `public.profiles` rows match? (0/1/many)"
   - "Does the header show Sign Out after redirect? (y/n)"
3. Production deploy gate. `vercel --prod` and merges to `main` forbidden by default. Require explicit "approved to deploy production."
4. One-action discipline in auth/profile/session debug. Single command, single UI action, wait for result.
5. After meaningful work, ask "what should I add to VINCI_CURRENT.md?" rather than silent memory update.

### Cross-cutting (both systems)

- reCAPTCHA v3 not wired anywhere. Required pre-launch.
- "Founding Partner" → "Founding Member" copy fix sweep — landed in code, still TODO across outreach docs.
- Viral-venue-feed outreach claim — only iOS `navigator.share` is verified. Either ship the backend or pull the claim.
- `public.users` and `public.profiles` are SEMANTICALLY DISTINCT. `public.users` is the founding-member tracker (bigint id). `public.profiles` is the auth-linked table (uuid id = auth.users.id). Never conflate.

---

## 9. HARD RULES (Vinci doctrine, locked all session)

- **No git commit.** No push. No merge. No deploy.
- **No `vercel --prod`.** No production gate touch.
- **No `reset --hard`, no `--force`** except `git rm -f` on confirmed-dead `components/header.tsx`.
- **No edits** to: `components/signup-modal.tsx`, `app/auth/callback/route.ts`, `app/auth/confirm/route.ts`, `lib/supabase/*`, env files, OR any production deploy target.
- **No OpenClaw doctor / fix / cleanup / sessions cleanup / transcript archive / skill disable / plugin uninstall.**
- **No secrets requested.** Ever. Booleans only.
- **One command / one UI action at a time** during diagnostic phases.
- **Claude Code = implementation lead. Vinci = orchestrator + final QA.** Vinci does not write code unless explicitly told "Vinci hands-on".

---

## 10. KICKOFF PROMPTS for OpenClaw + GPT

Send these verbatim to bootstrap the next conversation with each agent.

### For OpenClaw

```
Read in order:
1. /Users/vinci/Documents/Vinci/AgentMemory/VINCI_PREFLIGHT.md
2. /Users/vinci/Documents/Vinci/AgentMemory/VINCI_CURRENT.md
3. /Users/vinci/Documents/Vinci/OpenClaw/Handoffs/2026-05-15-MASTER-realaustinights-handoff.md

Current state in one line: profile-row blocker resolved via public.profiles; modal-open bug found and source-fix applied but UNVERIFIED pending dev-server restart.

Your next action: wait for Rudy to restart `npm run dev`. Then run
  cd /Users/vinci/realaustinights && node .artifacts/rescue-screens/check-join-membership.mjs
Report welcome_visible and backdrop count for both header Sign Up and footer Join Membership clicks. Do not edit code, do not commit, do not deploy. One action at a time. Booleans only — never ask for keys, magic links, emails, or confirmation URLs.
```

### For GPT / ChatGPT

```
Read in order:
1. /Users/vinci/Documents/Vinci/AgentMemory/VINCI_PREFLIGHT.md
2. /Users/vinci/Documents/Vinci/AgentMemory/VINCI_CURRENT.md
3. /Users/vinci/Documents/Vinci/OpenClaw/Handoffs/2026-05-15-MASTER-realaustinights-handoff.md

State the current one-liner back to me before accepting any task. Booleans only — never ask me to paste keys, tokens, emails, magic links, or confirmation URLs. Production deploy is FORBIDDEN by default. Reply with the one-liner and your understanding of next-action queue items 1-3, then await instruction.
```

---

## 11. WINS / ISSUES summary card

**Wins (today, 2026-05-15):**
- ✅ Profile-row blocker RESOLVED (public.profiles + trigger + backfill 3/3/3)
- ✅ Trigger verified to fire on synthetic admin-created user
- ✅ Schema misdiagnosis corrected and memorialized (public.users ≠ profile table)
- ✅ Founding Member copy sweep in code
- ✅ Dead components/header.tsx (199 LOC) deleted
- ✅ Hero CTA hit boxes given hover/active/focus feedback
- ✅ Anchor→button hardening on Sign Up + Join Membership CTAs
- ✅ Typecheck + build clean post-edits
- ✅ Homepage rescue accepted as visual baseline (22/22 click probes)
- ✅ Comprehensive handoff written to 3 locations for OpenClaw + GPT

**Issues open at end of session:**
- 🔴 Modal-open bug — source fix applied, NEEDS dev-server restart + Playwright re-test
- 🟡 RLS policies on public.profiles — must be added before app queries the table
- 🟡 reCAPTCHA v3 wiring — pre-launch blocker
- 🟡 Hi-res visual assets missing
- 🟡 Outreach copy: viral-venue-feed claim unverified
- 🟢 Repo dirty (acceptable — Vinci-approved no-commit posture for now)

**Issues found AND fixed mid-session (for posterity):**
- ❌ Trigger silently didn't land first attempt → fixed by combining function+trigger+verify into single paste
- ❌ Path A (insert into public.users) failed with `uuid = bigint` operator error → diagnosed schema mismatch, dropped broken trigger to unblock new signups, pivoted to Path 2
- ❌ User pasted markdown header into SQL Editor → fixed by re-sending code-block-only SQL
- ❌ "Going over completed shit" agent failure mode → corrected mid-session, switched to forward-motion-only execution
- ❌ Initial Playwright probe used wrong selector (`role="dialog"`) → fixed with `.fixed.inset-0.z-50` + h2 text match

---

**End of MASTER handoff. This file is canonical for 2026-05-15.**
