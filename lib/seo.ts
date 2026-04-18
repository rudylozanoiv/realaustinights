import type { Metadata } from 'next';

export const SITE = {
  name: 'Real AustiNights',
  domain: 'realaustinights.com',
  url: 'https://realaustinights.com',
  tagline: 'Real locals. Real vibes. Real fun.',
  description:
    "Austin's nightlife, by AustiNights. Live venues, hidden gems, deals, and the city's real-time pulse — curated nightly, AI-assisted, locally verified.",
  locale: 'en_US',
  ogImage: '/og-default.png',
} as const;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Austin Nightlife, For Real`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'Austin', 'Austin nightlife', 'Austin bars', 'Austin live music',
    'SXSW', 'ACL', 'COTA', 'Austin events', 'Keep Austin Weird',
    'Rainey Street', 'Red River', 'East Austin', 'hidden gems Austin',
  ],
  authors: [{ name: 'Rudy Lozano IV', url: SITE.url }],
  openGraph: {
    type: 'website',
    url: SITE.url,
    title: `${SITE.name} — Austin Nightlife, For Real`,
    description: SITE.description,
    siteName: SITE.name,
    locale: SITE.locale,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: { icon: '/favicon.ico' },
  robots: { index: true, follow: true },
};

/**
 * Schema.org Event JSON-LD generator. Drop the return value inside a
 * <script type="application/ld+json"> tag on the page hosting the event.
 */
export function eventJsonLd(input: {
  name: string;
  startDate: string;
  endDate?: string;
  venue: string;
  address: string;
  description?: string;
  image?: string;
  url?: string;
  price?: string;
  ticketUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: input.venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: input.address,
        addressLocality: 'Austin',
        addressRegion: 'TX',
        addressCountry: 'US',
      },
    },
    description: input.description,
    image: input.image ? [input.image] : undefined,
    url: input.url ?? SITE.url,
    offers: input.price
      ? {
          '@type': 'Offer',
          price: input.price,
          priceCurrency: 'USD',
          url: input.ticketUrl ?? input.url ?? SITE.url,
          availability: 'https://schema.org/InStock',
        }
      : undefined,
    organizer: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };
}

/** Schema.org LocalBusiness JSON-LD for venue pages. */
export function venueJsonLd(input: {
  name: string;
  address: string;
  image?: string;
  url?: string;
  priceRange?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: input.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: input.address,
      addressLocality: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    image: input.image,
    url: input.url ?? SITE.url,
    priceRange: input.priceRange,
    description: input.category,
  };
}
