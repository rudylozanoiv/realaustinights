/**
 * Region 2 — ¡Vive Austin! honest-preview. Sits directly under the hero.
 * Dominant but height-bounded (so Region 3 discovery is reachable in one short scroll).
 *
 * HONEST CONSTRAINTS (do not relax without sign-off):
 * - Visibly "coming soon" — not live.
 * - Slots are PREVIEW-PHOTO placeholders (concept examples of the patron-photo social hook),
 *   clearly labeled. NOT real photos, NOT real patrons, NOT specific/named venues
 *   (rights/consent, L10). Real member photo uploads arrive at launch.
 * - ZERO live-feed affordances: no like counts, no timestamps, no "X min ago", no usernames.
 * - The only upload affordance is a visibly DISABLED "coming soon" control (no handler).
 * - Sacred pink #FF69B4 is not used.
 */

// Preview-photo placeholder slots — concept examples only. No real images sourced; no real patrons/venues implied.
const PREVIEW_PHOTO_SLOTS = [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }, { id: 'p4' }];

export function ViveAustinPreview() {
  return (
    <section
      id="vive-austin"
      aria-label="¡Vive Austin! — coming soon preview"
      className="mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,12,22,0.92),rgba(12,9,16,0.95))] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.42)] md:p-7">
        {/* Coming-soon ribbon — honest framing */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-[rgba(0,122,122,0.16)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7fe3e3]">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-orange" />
            Coming soon
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Preview — not live yet</span>
        </div>

        <h2 className="font-display text-[2.2rem] font-semibold leading-[1.04] text-white md:text-[3rem]">¡Vive Austin!</h2>
        <p className="mt-2 max-w-2xl text-base leading-7 text-white/74 md:text-lg">
          Your night, seen. Real patron photos, launching soon.
        </p>

        {/* Preview-photo slots — example/concept placeholders for the patron-photo hook. Bounded height.
            NOT real patrons, NOT specific venues (rights/consent, L10). Real member uploads come at launch. */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {PREVIEW_PHOTO_SLOTS.map((slot) => (
            <div
              key={slot.id}
              className="relative grid h-[120px] place-items-center overflow-hidden rounded-[1rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.02)_100%)] md:h-[150px]"
            >
              <div className="flex flex-col items-center gap-2 text-white/45">
                <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="8.5" cy="10" r="1.6" />
                  <path d="M21 16l-5-5L5 21" />
                </svg>
                <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em]">Preview photo</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-[11px] leading-5 text-white/42">
          Preview / example concept photos — not real patrons, not specific venues. Real ¡Vive Austin! photos come from members at launch.
        </p>

        {/* Disabled, non-functional upload affordance — visibly "coming soon". No onClick, no handler. */}
        <div className="mt-5">
          <button
            type="button"
            disabled
            aria-disabled="true"
            tabIndex={-1}
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/40"
          >
            Share your night
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">
              Coming soon
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
