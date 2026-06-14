import Image from 'next/image';
import Link from 'next/link';

interface HeroSkylineLogoProps {
  onSignUpClick: () => void;
}

/**
 * Hero section. ONE image — `hero-final.jpg` (2752×1536, native aspect 43:24
 * ≈ 1.7917) — carries the entire authored composition: the AustiNights
 * wordmark + tagline lockup baked into the upper-left, the sharp photographic
 * Austin night skyline with lit windows, pink laser beams, and the Lady Bird
 * Lake reflection at the bottom. The wordmark in this asset starts at pixel
 * x=3 of 2752 (essentially flush against the left edge), so there is no
 * horizontal padding to absorb sub-pixel container-aspect rounding — the
 * `fill` + aspect-ratio-container pattern was clipping the leading 'A' on
 * mobile. Fix: use Next/Image with intrinsic width/height + className
 * "block h-auto w-full", which lets the image dictate its own rendered
 * height. No container aspect, no object-fit math, no crop possible. The
 * frame, container width, padding, corner radius, border, and shadow all
 * match the sections below in `homepage-shell.tsx` so the hero reads as the
 * first card in one cohesive visual language. A single subtle gradient on
 * the bottom edge fades the dark water reflection into the page's `#0c0710`
 * background so the hero melts into the content below. CTAs sit beneath the
 * hero card (the wordmark is part of the image, so they do not overlay).
 *
 * onSignUpClick is accepted to keep the call-site signature stable for the
 * homepage shell but is unused at this revision — the locked header owns the
 * signup CTA, and the hero CTAs route to /tonight and /events directly.
 */
export function HeroSkylineLogo({ onSignUpClick: _onSignUpClick }: HeroSkylineLogoProps) {
  return (
    <section
      aria-label="Real AustiNights hero"
      className="mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-[1rem] border border-white/8 shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
        {/* Image dictates its own rendered height via intrinsic width/height
            (2752×1536) + className "block w-full h-auto". This eliminates any
            container-vs-image aspect-ratio mismatch — there is NO container
            aspect; the image just scales proportionally to its parent's
            width. Zero crop is mathematically guaranteed because there is no
            object-fit cover/contain calculation against a separate container
            shape. Required here because the wordmark in this asset starts at
            pixel x=3 of 2752 (flush against the left edge), so the previous
            `fill` + aspect-[2752/1536] approach was vulnerable to sub-pixel
            rounding from the 1px card border, which clipped the leading 'A'. */}
        <Image
          src="/assets/hero-final.jpg"
          alt="Real AustiNights — Austin's premium nightlife and editorial guide. Austin skyline at night with the AustiNights wordmark."
          width={2752}
          height={1536}
          priority
          quality={90}
          sizes="(min-width: 1400px) 1336px, (min-width: 1024px) calc(100vw - 4rem), (min-width: 768px) calc(100vw - 3rem), calc(100vw - 2rem)"
          className="block h-auto w-full"
        />

        {/* Subtle bottom fade — the image's dark water reflection eases into
            the page background color (#0c0710, the last stop of the homepage
            gradient) instead of ending at a hard horizontal line. h-[22%]
            here is 22% of the CARD's height; since the image fills the card
            edge-to-edge with auto height, that equals 22% of image render
            height. Decorative; pointer-events-none. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-[linear-gradient(180deg,transparent_0%,transparent_45%,rgba(12,7,16,0.28)_72%,rgba(12,7,16,0.92)_100%)]"
        />
      </div>

      {/* CTAs — placed beneath the hero card. Spacing rhythm matches the
          rest of the page: mt-4 / md:mt-5 sits inside the <main> gap-6/gap-7
          envelope. The wordmark is part of the image now, so these buttons
          do not overlay the hero — they live in clean breathing room below. */}
      <div className="mt-4 flex flex-wrap items-center gap-3 md:mt-5">
        <Link
          href="/tonight"
          className="rounded-md bg-pink px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,45,135,0.4)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/80"
        >
          Find Your Night <span aria-hidden>→</span>
        </Link>
        <Link
          href="/events"
          className="rounded-md border border-pink/70 bg-black/30 px-5 py-2.5 text-sm font-bold text-pink backdrop-blur-sm transition hover:border-pink hover:bg-pink/15 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/80"
        >
          Explore Tonight
        </Link>
      </div>
    </section>
  );
}
