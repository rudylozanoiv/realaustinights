import Image from 'next/image';
import Link from 'next/link';

interface HeroSkylineLogoProps {
  onSignUpClick: () => void;
}

/**
 * Unified hero canvas. Uses the gold-master hero band crop (1280×282) as a
 * single image — protected wordmark + reflective cityscape are baked into the
 * crop. Real DOM <Link> overlays sit over the CTAs so Find Your Night and
 * Explore Tonight are clickable. Header and everything below are real DOM.
 */
export function HeroSkylineLogo({ onSignUpClick: _onSignUpClick }: HeroSkylineLogoProps) {
  return (
    <section
      aria-label="Real AustiNights hero"
      className="relative isolate overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,#070509_0%,#0a0610_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.34)]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full scale-110 opacity-35 blur-2xl">
          <Image
            src="/assets/goldmaster-hero-crop.png"
            alt=""
            fill
            aria-hidden
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,3,7,0.38),rgba(5,3,7,0.72))]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-0 pt-2 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1280px] rounded-[24px] border border-white/10 bg-[#0b0710] p-2 shadow-[0_20px_52px_rgba(0,0,0,0.38)]">
          <div className="relative aspect-[1280/290] w-full overflow-hidden rounded-[18px] bg-[#0b0710]">
            <div className="absolute inset-x-2 bottom-2 top-3 overflow-hidden rounded-[15px] bg-[#0b0710]">
              <Image
                src="/assets/goldmaster-hero-crop.png"
                alt="Real AustiNights — Austin's premium nightlife and editorial guide"
                fill
                priority
                quality={100}
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-contain object-center"
              />

              <Link
                href="/tonight"
                aria-label="Find Your Night"
                className="group absolute left-[2.5%] top-[73%] h-[18%] w-[13.4%] rounded-md ring-1 ring-transparent transition hover:bg-pink/10 hover:ring-pink/40 active:bg-pink/20 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70"
              />
              <Link
                href="/events"
                aria-label="Explore Tonight"
                className="group absolute left-[16.6%] top-[73%] h-[18%] w-[13.4%] rounded-md ring-1 ring-transparent transition hover:bg-pink/10 hover:ring-pink/40 active:bg-pink/20 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
