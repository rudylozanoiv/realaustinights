import type {
  AfterParty,
  AfterPartyEvent,
  CategoryFilter,
  ComedyShow,
  CommunityPost,
  DateTab,
  Deal,
  FeedCard,
  LivePost,
  MajorEvent,
  QuePasaPhoto,
  VibeFilter,
  ZetaPost,
} from './types';

// ──────────────────────────────────────────────
// FILTERS & TABS
// ──────────────────────────────────────────────
export const VIBE_FILTERS: { label: VibeFilter; emoji: string }[] = [
  { label: 'chill', emoji: '😌' },
  { label: 'loud', emoji: '🔊' },
  { label: 'live music', emoji: '🎸' },
  { label: 'sports', emoji: '🏈' },
  { label: 'date night', emoji: '💕' },
  { label: 'pet friendly', emoji: '🐾' },
];

export const CATEGORY_FILTERS: CategoryFilter[] = [
  'All', 'Bars', 'Restaurants', 'Live Music', 'Comedy',
  'Events', 'Outdoors', 'Hidden Gems', 'Churches', 'Groceries', 'Gyms / Fitness',
];

export const CATEGORY_ICONS: Record<CategoryFilter, string> = {
  All: '🌟', Bars: '🍺', Restaurants: '🍽️', 'Live Music': '🎸',
  Comedy: '😂', Events: '🎉', Outdoors: '🌿', 'Hidden Gems': '💎',
  Churches: '⛪', Groceries: '🛒', 'Gyms / Fitness': '💪',
};

export const DATE_TABS: DateTab[] = ['Today', 'Tonight', 'This Weekend', 'This Week'];

export const AFTER_PARTY_EVENTS: AfterPartyEvent[] = [
  'SXSW', 'ACL', 'COTA', 'Longhorns', 'Austin FC / MLS', 'Rodeo Austin',
];

// Official event websites — surfaced from AfterThis tabs so users can jump
// to ticket / schedule info on the real event site.
export const EVENT_OFFICIAL_URLS: Record<AfterPartyEvent, string> = {
  SXSW: 'https://www.sxsw.com',
  ACL: 'https://www.aclfestival.com',
  COTA: 'https://circuitoftheamericas.com',
  Longhorns: 'https://texassports.com',
  'Austin FC / MLS': 'https://www.austinfc.com',
  'Rodeo Austin': 'https://www.rodeoaustin.com',
};

// ──────────────────────────────────────────────
// LIVE TICKER HEADLINES — 5 high-impact lines, rotate every 7s.
// Every 4th rotation swaps in AI_TAGLINE (handled in Header).
// 1. Seasonal/current · 2. Live Music City · 3. Trending event ·
// 4. Founding AustiNight CTA · 5. Community hook.
// ──────────────────────────────────────────────
export const HEADLINES: string[] = [
  '🌧️ Muddy Paws Advisory: showers at 10pm — patios ready',
  '🎸 Austin voted #1 Live Music City — again, obviously',
  '🎪 ACL lineup dropped — post your Day 1 picks',
  '⏰ Only 253 Founding AustiNight spots left — claim yours',
  "🌙 See what Austin's posting tonight — tap Austin Pulse",
];

export const AI_TAGLINE = '🤖 AI-Driven, AustiNight-Approved';

// ──────────────────────────────────────────────
// QUE PASA CAROUSEL
// ──────────────────────────────────────────────
export const QUE_PASA_PHOTOS: QuePasaPhoto[] = [
  {
    id: 'qp1', username: '@austintx_vibes',
    photoUrl: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=600&q=80',
    caption: 'Friday night at Rainey 🍹', venueName: 'Craft Pride',
    neighborhood: 'Rainey St',
    googleMapsUrl: 'https://maps.google.com/?q=Craft+Pride+Austin+TX',
    appleMapsUrl: 'https://maps.apple.com/?q=Craft+Pride+Austin+TX',
  },
  {
    id: 'qp2', username: '@keepitweird_512',
    photoUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    caption: 'Wild Child tore it DOWN 🔥', venueName: 'Mohawk ATX',
    neighborhood: 'Red River',
    googleMapsUrl: 'https://maps.google.com/?q=Mohawk+ATX+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Mohawk+Austin+TX',
  },
  {
    id: 'qp3', username: '@soco_sunsets',
    photoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    caption: 'Sunday swim at the springs 💧', venueName: 'Barton Springs Pool',
    neighborhood: 'Zilker',
    googleMapsUrl: 'https://maps.google.com/?q=Barton+Springs+Pool+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Barton+Springs+Pool',
  },
  {
    id: 'qp4', username: '@eastside_eats',
    photoUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    caption: 'Best migas in Austin, period 🌮', venueName: 'Veracruz All Natural',
    neighborhood: 'East Austin',
    googleMapsUrl: 'https://maps.google.com/?q=Veracruz+All+Natural+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Veracruz+All+Natural+Austin',
  },
  {
    id: 'qp5', username: '@spiderhouse_regular',
    photoUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
    caption: 'Open mic magic at Spider House ✨', venueName: 'Spider House Cafe',
    neighborhood: 'Hyde Park',
    googleMapsUrl: 'https://maps.google.com/?q=Spider+House+Cafe+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Spider+House+Cafe+Austin',
  },
  {
    id: 'qp6', username: '@raineystreet_life',
    photoUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&q=80',
    caption: 'Bungalow bar hopping is a sport 🏃', venueName: 'Container Bar',
    neighborhood: 'Rainey St',
    googleMapsUrl: 'https://maps.google.com/?q=Container+Bar+Austin+TX',
    appleMapsUrl: 'https://maps.apple.com/?q=Container+Bar+Austin',
  },
];

// ──────────────────────────────────────────────
// AFTER PARTIES
// ──────────────────────────────────────────────
export const AFTER_PARTIES: AfterParty[] = [
  {
    id: 'ap1', event: 'SXSW', venueName: 'Stubbs Waller Creek Amphitheater',
    address: '801 Red River St', neighborhood: 'Red River',
    time: 'Midnight – 3am',
    description: 'Official SXSW late-night showcase. Multiple acts, outdoor amphitheater. Full bar. First come first served with badge.',
    price: 'Badge / $20', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Stubbs+Amphitheater+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Stubbs+Waller+Creek+Austin',
  },
  {
    id: 'ap2', event: 'SXSW', venueName: 'Mohawk ATX – Outdoor Stage',
    address: '912 Red River St', neighborhood: 'Red River',
    time: '11pm – 2am',
    description: 'SXSW day-party overflow flows into late night. DJ sets, craft beer specials, skyline views.',
    price: 'RSVP Free / $15 door', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Mohawk+ATX+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Mohawk+Austin',
  },
  {
    id: 'ap3', event: 'ACL', venueName: 'Rainey Street Bar Hop',
    address: 'Rainey St, Austin TX', neighborhood: 'Rainey St',
    time: 'Gates close - last call',
    description: "Rainey St goes full ACL after-party mode. Craft Pride, Container Bar, Banger's all open late. Live DJs, extended pours.",
    price: 'Free entry, drinks $$', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Rainey+Street+Austin+TX',
    appleMapsUrl: 'https://maps.apple.com/?q=Rainey+St+Austin',
  },
  {
    id: 'ap4', event: 'COTA', venueName: 'Cedar Street Courtyard',
    address: '208 W 4th St', neighborhood: 'Downtown',
    time: '6pm – 2am',
    description: 'Post-race party. DJ, full bar, outdoor patio. Race-themed cocktail specials. Flags and fire pits.',
    price: '$10 cover', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Cedar+Street+Courtyard+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Cedar+Street+Courtyard+Austin',
  },
  {
    id: 'ap5', event: 'Longhorns', venueName: 'Scholz Garten',
    address: '1607 San Jacinto Blvd', neighborhood: 'UT Campus',
    time: 'Post-game – midnight',
    description: 'The OG Longhorn after-party. Since 1866. Biergarten, Texas drafts, live music on game nights. Burnt orange everything.',
    price: 'Free entry', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Scholz+Garten+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Scholz+Garten+Austin',
  },
  {
    id: 'ap6', event: 'Austin FC / MLS', venueName: 'The Pitch at Q2 Stadium',
    address: '10414 McKalla Pl', neighborhood: 'North Austin',
    time: 'Post-match – 1am',
    description: 'Official Austin FC supporter bar. Verde kit-wearing staff, Verde cocktails, match replays on loop. Verde til it hurts.',
    price: 'Free entry', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Q2+Stadium+Austin+TX',
    appleMapsUrl: 'https://maps.apple.com/?q=Q2+Stadium+Austin',
  },
  {
    id: 'ap7', event: 'Rodeo Austin', venueName: "Whisler's",
    address: '1816 E 6th St', neighborhood: 'East Austin',
    time: '10pm – 2am',
    description: 'Post-rodeo mezcal haven. No boots required but appreciated. DJ sets, dim lights, and the best mezcal selection in Texas.',
    price: 'Free', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Whislers+Austin+TX',
    appleMapsUrl: 'https://maps.apple.com/?q=Whislers+Austin',
  },
];

// ──────────────────────────────────────────────
// COMEDY SHOWS
// ──────────────────────────────────────────────
export const COMEDY_SHOWS: ComedyShow[] = [
  {
    id: 'c1', title: 'Joe Pera: Soft Thoughts Tour', comedian: 'Joe Pera',
    venueName: 'Cap City Comedy Club', venueType: 'comedy club',
    date: 'Fri Apr 4', dateObj: new Date('2026-04-04'),
    time: '8pm & 10pm', price: '$28-38', ticketUrl: 'https://capcitycomedy.com',
    hasAlcohol: true, hasFood: true, neighborhood: 'North Lamar',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600&q=80',
    soldOut: false,
  },
  {
    id: 'c2', title: 'Nikki Glaser: Alive Tour', comedian: 'Nikki Glaser',
    venueName: 'Moody Center', venueType: 'major venue',
    date: 'Sat Apr 5', dateObj: new Date('2026-04-05'),
    time: '7:30pm', price: '$55-125', ticketUrl: 'https://moodycenteratx.com',
    hasAlcohol: true, hasFood: true, neighborhood: 'UT Area',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80',
    soldOut: false,
  },
  {
    id: 'c3', title: 'Open Mic Extravaganza', comedian: 'Various Local Comics',
    venueName: 'Spider House Cafe', venueType: 'comedy club',
    date: 'Sun Apr 6', dateObj: new Date('2026-04-06'),
    time: '8pm', price: 'Free', ticketUrl: '',
    hasAlcohol: true, hasFood: false, neighborhood: 'Hyde Park',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
    soldOut: false,
  },
  {
    id: 'c4', title: 'Bill Burr: Back for More', comedian: 'Bill Burr',
    venueName: 'ACL Live at the Moody Theater', venueType: 'major venue',
    date: 'Fri Apr 11', dateObj: new Date('2026-04-11'),
    time: '8pm', price: '$75-150', ticketUrl: 'https://acl-live.com',
    hasAlcohol: true, hasFood: true, neighborhood: 'Warehouse District',
    image: 'https://images.unsplash.com/photo-1486693128850-a77436e7ba3c?w=600&q=80',
    soldOut: false,
  },
  {
    id: 'c5', title: 'Thursday Laugh Factory', comedian: 'Local Showcase',
    venueName: 'Cap City Comedy Club', venueType: 'comedy club',
    date: 'Thu Apr 10', dateObj: new Date('2026-04-10'),
    time: '9pm', price: '$15', ticketUrl: 'https://capcitycomedy.com',
    hasAlcohol: true, hasFood: true, neighborhood: 'North Lamar',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600&q=80',
    soldOut: false,
  },
  {
    id: 'c6', title: 'Chappelle Works in Progress', comedian: 'Dave Chappelle',
    venueName: 'The Paramount Theatre', venueType: 'major venue',
    date: 'Sat Apr 12', dateObj: new Date('2026-04-12'),
    time: '10:30pm', price: '$45-95', ticketUrl: 'https://austintheatre.org',
    hasAlcohol: false, hasFood: false, neighborhood: 'Congress Ave',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80',
    soldOut: true,
  },
];

// ──────────────────────────────────────────────
// FEED CARDS
// ──────────────────────────────────────────────
export const FEED_CARDS: FeedCard[] = [
  {
    id: '1', venueName: "Evangeline's",
    description: "Austin's best-kept Cajun secret on Brodie Lane. The crawfish etouffee is a spiritual experience — smoky, buttery, dangerously addictive. Live zydeco weekends.",
    vibeTags: ['chill', 'date night', 'live music'], petFriendly: true,
    isFoundingPartner: true, time: 'Open until 10pm', price: '$$',
    neighborhood: 'South Austin', likes: 342, comments: 87,
    category: 'Hidden Gems', happening: ['Today', 'Tonight', 'This Weekend', 'This Week'],
    address: '7113 Brodie Ln',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  },
  {
    id: '2', venueName: 'Mohawk ATX',
    description: 'TONIGHT: Wild Child + Hovvdy outdoor stage. $5 Lone Stars til 9pm with the skyline as your backdrop. Doors at 7.',
    vibeTags: ['loud', 'live music'], petFriendly: false,
    time: 'Tonight 7pm', price: '$15-25', neighborhood: 'Red River',
    likes: 518, comments: 143, category: 'Live Music',
    happening: ['Today', 'Tonight'], address: '912 Red River St',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
  },
  {
    id: '3', venueName: "Torchy's Tacos",
    description: 'The Governator taco is BACK for one week. Poblano, grilled corn, queso fresco, and that green sauce nobody can explain. $3 off today 2-4pm.',
    vibeTags: ['chill', 'date night'], petFriendly: true, isSponsored: true,
    isFeaturedPartner: true,
    time: 'Deal til 4pm', price: '$', neighborhood: 'South Congress',
    likes: 892, comments: 234, category: 'Restaurants',
    happening: ['Today', 'Tonight'], address: '1311 S 1st St',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
  },
  {
    id: '4', venueName: 'Spider House Cafe',
    description: 'Fairy lights, weird art everywhere, best patio in Austin. Open mic at 8pm. Cheap crafts, strong coffee, zero pretension. Peak Keep Austin Weird.',
    vibeTags: ['chill', 'live music', 'date night'], petFriendly: true,
    isHiddenGem: true,
    time: 'Open Mic 8pm', price: '$', neighborhood: 'Hyde Park',
    likes: 267, comments: 61, category: 'Bars',
    happening: ['Today', 'Tonight'], address: '2908 Fruth St',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
  },
  {
    id: '5', venueName: 'Cap City Comedy',
    description: 'Joe Pera this weekend. Soothing existential humor. Tickets going fast — 8pm & 10pm shows. Two-drink minimum that honestly improves the set.',
    vibeTags: ['chill', 'date night'], petFriendly: false,
    time: 'Fri & Sat 8+10pm', price: '$$', neighborhood: 'North Lamar',
    likes: 445, comments: 128, category: 'Comedy',
    happening: ['This Weekend'], address: '8120 Research Blvd',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600&q=80',
    verifiedOnly: true,
  },
  {
    id: '6', venueName: 'Barton Springs Pool',
    description: '68 degrees year-round. Spring-fed pool inside Zilker Park. $5 to swim. Sunsets here are aggressively beautiful.',
    vibeTags: ['chill'], petFriendly: false,
    time: '5am-10pm', price: '$5', neighborhood: 'Zilker',
    likes: 1204, comments: 312, category: 'Outdoors',
    happening: ['Today', 'Tonight', 'This Weekend', 'This Week'],
    address: '2201 Barton Springs Rd',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  },
  {
    id: '7', venueName: 'Rainey Street Bar Hop',
    description: 'Bungalows-turned-bars. Craft Pride, Container Bar rooftop. Start at Whislers for a mezcal negroni. End wherever the night takes you.',
    vibeTags: ['loud', 'date night', 'live music'], petFriendly: true,
    time: 'All night', price: '$$', neighborhood: 'Rainey St',
    likes: 733, comments: 189, category: 'Bars',
    happening: ['Today', 'Tonight', 'This Weekend'], address: 'Rainey St',
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&q=80',
  },
  {
    id: '8', venueName: 'East Austin Food Trucks',
    description: 'Veracruz migas. Valentinas BBQ. Peached Tortilla Japanese-Southern fusion. All in one lot. Bring stretchy pants.',
    vibeTags: ['chill', 'pet friendly'], petFriendly: true,
    time: '11am-midnight', price: '$', neighborhood: 'East Austin',
    likes: 967, comments: 274, category: 'Restaurants',
    happening: ['Today', 'Tonight', 'This Weekend', 'This Week'],
    address: 'E 6th St',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  },
  {
    id: '9', venueName: 'Franklin Barbecue',
    description: 'The line is real. It is worth it. Pre-order and skip the 4-hour wait. Most important Austin hack since SXSW parking.',
    vibeTags: ['chill'], petFriendly: false,
    time: 'Pre-orders 8 AM', price: '$$$', neighborhood: 'East Side',
    likes: 567, comments: 89, category: 'Restaurants',
    happening: ['Today', 'Tonight', 'This Weekend', 'This Week'],
    address: '900 E 11th St',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  },
  {
    id: '10', venueName: 'Waterloo Records',
    description: 'FREE in-store show tonight: Gorgeous Bully at 6pm. Local section stocked with records no algorithm will find.',
    vibeTags: ['chill', 'live music'], petFriendly: false,
    time: 'Free show 6pm', price: 'Free', neighborhood: 'Guadalupe',
    likes: 381, comments: 95, category: 'Events',
    happening: ['Today', 'Tonight'], address: '600A N Lamar',
    image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=600&q=80',
  },
  {
    id: '11', venueName: 'St. Mary Cathedral',
    description: 'Historic cathedral on 10th and Brazos. Sunday services at 8am, 10am & noon. Beautiful stained glass. Open for quiet reflection daily.',
    vibeTags: ['chill'], petFriendly: false,
    time: 'Daily 7am-6pm', price: 'Free', neighborhood: 'Downtown',
    likes: 142, comments: 28, category: 'Churches',
    happening: ['Today', 'Tonight', 'This Weekend', 'This Week'],
    address: '203 E 10th St',
    // Previous Unsplash id (photo-1548625149-720754763f5e) returned 404 — swapped to a verified 200.
    image: 'https://images.unsplash.com/photo-1551038247-3d9af20df552?w=600&q=80',
  },
  {
    id: '12', venueName: 'Whole Foods Market (Flagship)',
    description: 'The original Whole Foods flagship on Lamar. Six floors of groceries, a rooftop bar, hot bar, sushi counter, and a cheese cave. Austin flex.',
    vibeTags: ['chill'], petFriendly: false,
    time: '7am-10pm', price: '$$$', neighborhood: 'Lamar',
    likes: 523, comments: 67, category: 'Groceries',
    happening: ['Today', 'Tonight', 'This Weekend', 'This Week'],
    address: '525 N Lamar Blvd',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
  },
  {
    id: '13', venueName: 'Austin Bouldering Project',
    description: 'Massive bouldering gym with yoga, fitness, sauna, and showers. The social climbing scene in Austin. Community vibes, hard problems.',
    vibeTags: ['chill', 'sports'], petFriendly: false,
    time: '6am-10pm daily', price: '$22/day', neighborhood: 'East Austin',
    likes: 389, comments: 74, category: 'Gyms / Fitness',
    happening: ['Today', 'Tonight', 'This Weekend', 'This Week'],
    address: '979 Springdale Rd',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=80',
  },
  {
    id: 'barkingham',
    venueName: 'Barkingham Place',
    description: "Austin's premier dog daycare + boarding. Indoor + outdoor play yards, trained handlers, live webcams. Pupper Weekly Featured Partner. Zeta-approved.",
    vibeTags: ['pet friendly', 'chill'], petFriendly: true,
    isFeaturedPartner: true, isHiddenGem: true,
    time: 'Mon-Sat 7am-7pm', price: '$$', neighborhood: 'North Austin',
    likes: 234, comments: 52, category: 'Hidden Gems',
    happening: ['Today', 'Tonight', 'This Weekend', 'This Week'],
    address: '11400 Old Jollyville Rd',
    // TODO: Replace with Rudy-supplied Barkingham Place photo at go-live.
    image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&q=80',
  },
];

/** Convenience lookup — id → FeedCard. */
export const FEED_CARD_BY_ID: Record<string, FeedCard> = Object.fromEntries(
  FEED_CARDS.map(c => [c.id, c]),
);

// ──────────────────────────────────────────────
// LIVE POSTS (Austin Pulse)
// ──────────────────────────────────────────────
export const LIVE_POSTS: LivePost[] = [
  { id: 'lp1', venue: 'Mohawk ATX', handle: '@mohawkatx', message: 'Wild Child soundcheck DONE. Doors in 45 min. First 50 get free drink tickets!', timeAgo: '2m', type: 'event', emoji: '🎸', likes: 34, isNew: true },
  { id: 'lp2', venue: "Evangeline's", handle: '@evangelinesatx', message: 'Fresh crawfish dropped. Etouffee on the board. Walk-ins til 9:30pm.', timeAgo: '8m', type: 'update', emoji: '🦞', likes: 67, isNew: true },
  { id: 'lp3', venue: 'AustiNights HQ', handle: '@realaustinights', message: 'MUDDY PAWS ALERT: Rain ~10pm. Rainey covered patios OPEN.', timeAgo: '12m', type: 'alert', emoji: '🌧️', likes: 112 },
  { id: 'lp4', venue: 'Craft Pride', handle: '@craftprideatx', message: 'Happy Hour EXTENDED til 8pm — $2 off all TX craft drafts. 54 taps.', timeAgo: '19m', type: 'deal', emoji: '🍺', likes: 89 },
  { id: 'lp5', venue: 'Spider House', handle: '@spiderhouse', message: 'Open mic NOW. Next slot 9:15. $3 drafts. Dogs welcome.', timeAgo: '23m', type: 'music', emoji: '🎤', likes: 45 },
  { id: 'lp6', venue: 'Veracruz', handle: '@veracruzatx', message: 'Migas tacos til midnight. Line moving fast. Come hungry.', timeAgo: '31m', type: 'update', emoji: '🌮', likes: 156 },
  { id: 'lp7', venue: 'Barton Springs', handle: '@bartonsprings', message: 'Water: 68F. Crowd: mellow. Sunset: 2 hours. $5. GO.', timeAgo: '44m', type: 'update', emoji: '💧', likes: 203 },
];

// ──────────────────────────────────────────────
// COMMUNITY POSTS
// ──────────────────────────────────────────────
export const COMMUNITY_POSTS: CommunityPost[] = [
  { id: 'cp1', username: '@austinvibes_512', message: 'Anyone else at Mohawk rn? This band is INSANE', timeAgo: '3m', likes: 12 },
  { id: 'cp2', username: '@tacolife_atx', message: 'Valentinas brisket taco = life changing. Go now.', timeAgo: '11m', likes: 28 },
  { id: 'cp3', username: '@zilker_runner', message: 'Sunrise at Zilker never gets old. 5 years in ATX and still hits different', timeAgo: '22m', likes: 45 },
  { id: 'cp4', username: '@keepitweird', message: 'Just saw a guy playing guitar for his dog at Barton Springs. Peak Austin.', timeAgo: '38m', likes: 67 },
  { id: 'cp5', username: '@eastside_eats', message: 'Who is going to the after-party at Whislers tonight??', timeAgo: '1h', likes: 19 },
];

// ──────────────────────────────────────────────
// ZETA / PUPPER WEEKLY
// ──────────────────────────────────────────────
// TODO: Replace with Rudy-supplied Zeta photos at go-live. Stock pup image used meanwhile.
export const ZETA_POST: ZetaPost = {
  id: 'zeta1',
  photoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
  caption: 'Zeta had the BEST week at Barkingham Place! Made three new friends and only stole one tennis ball.',
  venue: 'Barkingham Place',
  week: 'Week of April 4',
};

// ──────────────────────────────────────────────
// DEALS — with expiry + sponsor tier + recurring
// ──────────────────────────────────────────────
export const DEALS: Deal[] = [
  { id: 'd1', businessName: 'Jiffy Lube S. Lamar', description: '$20 off full service oil change', category: 'Auto', icon: '🚗', expiresDate: '2026-05-15', isRecurring: false, sponsorTier: 'free' },
  { id: 'd2', businessName: 'Martinizing Dry Clean', description: '20% off first dry cleaning order', category: 'Services', icon: '👕', expiresDate: '2026-06-01', isRecurring: false, sponsorTier: 'free' },
  { id: 'd3', businessName: 'H-E-B Mueller', description: 'BOGO deli sandwiches all week', category: 'Grocery', icon: '🛒', expiresDate: '2026-04-24', isRecurring: true, sponsorTier: 'featured' },
  { id: 'd4', businessName: 'SuperCuts Burnet', description: '$5 off any haircut', category: 'Beauty', icon: '💇', expiresDate: '2026-05-30', isRecurring: false, sponsorTier: 'free' },
  { id: 'd5', businessName: 'Pep Boys N. Lamar', description: 'Free brake inspection + 15% off pads', category: 'Auto', icon: '🚗', expiresDate: '2026-05-10', isRecurring: false, sponsorTier: 'free' },
  { id: 'd6', businessName: 'Austin Pet Ranch', description: 'Buy 2 bags of food, get 1 free', category: 'Pets', icon: '🐶', expiresDate: '2026-04-30', isRecurring: true, sponsorTier: 'featured' },
  { id: 'd7', businessName: 'Great Clips Anderson', description: '$3 off any haircut with check-in', category: 'Beauty', icon: '💇', expiresDate: '2026-06-15', isRecurring: true, sponsorTier: 'free' },
  { id: 'd8', businessName: 'Lone Star Cleaners', description: '30% off comforters and blankets', category: 'Services', icon: '👕', expiresDate: '2026-05-20', isRecurring: false, sponsorTier: 'free' },
  { id: 'd9', businessName: 'Randalls Westlake', description: '$10 off $50 grocery order', category: 'Grocery', icon: '🛒', expiresDate: '2026-04-28', isRecurring: true, sponsorTier: 'free' },
];

// ──────────────────────────────────────────────
// MAJOR EVENTS — drive "We're Austin — [X]" headline + AfterThis tab glow.
// Only specific 2026 festival windows. Austin FC + Longhorns season-placeholders
// were removed — Leonardo will scrape per-match dates Sunday and add them
// (with logoUrl) as discrete entries. Default fallback when none active = "Verdad".
// ──────────────────────────────────────────────
export const MAJOR_EVENTS: MajorEvent[] = [
  { id: 'me-sxsw', name: 'SXSW', label: 'SXSW', startDate: '2026-03-13', endDate: '2026-03-22', isRecurring: true },
  { id: 'me-rodeo', name: 'Rodeo', label: 'Rodeo', startDate: '2026-03-07', endDate: '2026-03-21', isRecurring: true },
  { id: 'me-cota', name: 'COTA', label: 'COTA', startDate: '2026-10-23', endDate: '2026-10-25', isRecurring: true },
  { id: 'me-acl-w1', name: 'ACL', label: 'ACL', startDate: '2026-10-02', endDate: '2026-10-04', isRecurring: true },
  { id: 'me-acl-w2', name: 'ACL', label: 'ACL', startDate: '2026-10-09', endDate: '2026-10-11', isRecurring: true },
];

/** Pick the highest-priority active event for a given date (or undefined). */
export function activeMajorEvent(now: Date = new Date()): MajorEvent | undefined {
  const iso = now.toISOString().slice(0, 10);
  const active = MAJOR_EVENTS.filter(e => iso >= e.startDate && iso <= e.endDate);
  if (active.length === 0) return undefined;
  // Priority order: single-city festivals first, then recurring seasons.
  const priority: MajorEvent['name'][] = ['SXSW', 'ACL', 'COTA', 'Rodeo', 'Longhorns', 'Austin FC'];
  return active.sort(
    (a, b) => priority.indexOf(a.name) - priority.indexOf(b.name),
  )[0];
}
