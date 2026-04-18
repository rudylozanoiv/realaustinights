import type { ComedyShow, FeedCard, AfterParty } from '@/lib/types';
import { eventJsonLd, venueJsonLd, SITE } from '@/lib/seo';

function JsonLd({ data }: { data: unknown }) {
  // Stringify with JSON.stringify; server and client produce the same bytes.
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- Schema.org payload is ours.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** ItemList of the current feed's venues (LocalBusiness) for crawlers. */
export function VenuesJsonLd({ venues }: { venues: FeedCard[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: venues.slice(0, 20).map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: venueJsonLd({
        name: v.venueName,
        address: v.address,
        image: v.image,
        url: SITE.url,
        priceRange: v.price,
        category: v.category,
      }),
    })),
  };
  return <JsonLd data={data} />;
}

/** Comedy show + after-party events (Schema.org Event). */
export function EventsJsonLd({
  shows,
  parties,
}: {
  shows: ComedyShow[];
  parties: AfterParty[];
}) {
  const showEvents = shows.map(s =>
    eventJsonLd({
      name: s.title,
      startDate: s.dateObj.toISOString(),
      venue: s.venueName,
      address: s.neighborhood + ', Austin, TX',
      description: `${s.comedian} — ${s.time}`,
      image: s.image,
      url: s.ticketUrl || SITE.url,
      price: s.price,
      ticketUrl: s.ticketUrl || undefined,
    }),
  );

  const partyEvents = parties.map(p =>
    eventJsonLd({
      name: `${p.event} After-Party at ${p.venueName}`,
      // Parties are recurring windows; emit start-of-day so crawlers have *something*.
      startDate: new Date().toISOString().slice(0, 10),
      venue: p.venueName,
      address: p.address,
      description: p.description,
      url: SITE.url,
      price: p.price,
    }),
  );

  return (
    <>
      {[...showEvents, ...partyEvents].map((d, i) => (
        <JsonLd key={i} data={d} />
      ))}
    </>
  );
}
