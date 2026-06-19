/**
 * Region 2 — ¡Vive Austin! honest-preview. Sits directly under the hero.
 * Dominant but height-bounded (so Region 3 discovery is reachable in one short scroll).
 *
 * HONEST CONSTRAINTS (do not relax without sign-off):
 * - Visibly "coming soon" — not live.
 * - Example tiles are illustrative PASTEL CSS art only (rights-safe). NOT photos, NOT real
 *   patrons, NOT named venues.
 * - ZERO live-feed affordances: no like counts, no timestamps, no "X min ago", no usernames.
 * - The only upload affordance is a visibly DISABLED "coming soon" control (no handler).
 * - Pastel tints from brand light hexes; sacred pink #FF69B4 is not used.
 */

// Illustrative pastel tiles — pure CSS gradients from brand LIGHT tints. Not imagery of people/venues.
const PASTEL_TILES = [
  { id: 't1', gradient: 'linear-gradient(135deg, #E8F5F5 0%, #E8EDF5 100%)' }, // teal-light → navy-light
  { id: 't2', gradient: 'linear-gradient(135deg, #FFF4E6 0%, #FFFAF3 100%)' }, // orange-light → cream
  { id: 't3', gradient: 'linear-gradient(135deg, #E8EDF5 0%, #FFF4E6 100%)' }, // navy-light → orange-light
  { id: 't4', gradient: 'linear-gradient(135deg, #FFFAF3 0%, #E8F5F5 100%)' }, // cream → teal-light
];

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
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-[rgba(0,122,122,0.16)] px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#7fe3e3]">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-orange" />
            Coming soon
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Preview — not live yet</span>
        </div>

        <h2 className="font-display text-[2.2rem] font-black leading-[1.04] text-white md:text-[3rem]">¡Vive Austin!</h2>
        <p className="mt-2 max-w-2xl text-base leading-7 text-white/74 md:text-lg">
          Your night, seen. Real patron photos, launching soon.
        </p>

        {/* Illustrative pastel tiles — bounded height; not photos, not real patrons, not named venues. */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {PASTEL_TILES.map((tile) => (
            <div
              key={tile.id}
              aria-hidden
              className="relative h-[120px] overflow-hidden rounded-[1rem] ring-1 ring-black/5 md:h-[150px]"
              style={{ backgroundImage: tile.gradient }}
            >
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Illustration</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-[11px] leading-5 text-white/42">
          Illustrative art only — not real patron photos, not specific venues. Real ¡Vive Austin! photos arrive at launch.
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
