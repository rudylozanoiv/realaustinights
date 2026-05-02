'use client';

import { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type DateTab = 'Today' | 'Tonight' | 'This Weekend' | 'This Week';
type VibeFilter = 'chill' | 'loud' | 'live music' | 'sports' | 'date night' | 'pet friendly';
type CategoryFilter =
  | 'All' | 'Bars' | 'Restaurants' | 'Live Music' | 'Comedy'
  | 'Events' | 'Outdoors' | 'Hidden Gems'
  | 'Churches' | 'Groceries' | 'Gyms / Fitness';
type UserMode = 'austinnite' | 'tourist' | null;
type AfterPartyEvent = 'SXSW' | 'ACL' | 'COTA' | 'Longhorns' | 'Austin FC / MLS' | 'Rodeo Austin';
type ComedyVenueType = 'comedy club' | 'major venue' | 'all';

interface FeedCard {
  id: string; venueName: string; description: string; vibeTags: VibeFilter[];
  petFriendly: boolean; isSponsored?: boolean; isFoundingPartner?: boolean;
  time?: string; price?: string; neighborhood: string; likes: number;
  comments: number; category: Exclude<CategoryFilter, 'All'>; happening: DateTab[];
  address: string; image: string; verifiedOnly?: boolean;
}

interface LivePost {
  id: string; venue: string; handle: string; message: string;
  timeAgo: string; type: 'update' | 'deal' | 'event' | 'alert' | 'music';
  emoji: string; likes: number; isNew?: boolean;
}

interface QuePasaPhoto {
  id: string; photoUrl: string; caption: string; username: string;
  venueName: string; googleMapsUrl: string; appleMapsUrl: string;
  neighborhood: string;
}

interface AfterParty {
  id: string; event: AfterPartyEvent; venueName: string;
  address: string; neighborhood: string; time: string;
  description: string; price: string; verifiedOnly: boolean;
  googleMapsUrl: string; appleMapsUrl: string;
}

interface ComedyShow {
  id: string; title: string; comedian: string; venueName: string;
  venueType: 'comedy club' | 'major venue'; date: string;
  dateObj: Date; time: string; price: string; ticketUrl: string;
  hasAlcohol: boolean; hasFood: boolean; neighborhood: string;
  image: string; soldOut?: boolean;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const VIBE_FILTERS: { label: VibeFilter; emoji: string }[] = [
  { label: 'chill', emoji: '😌' }, { label: 'loud', emoji: '🔊' },
  { label: 'live music', emoji: '🎸' }, { label: 'sports', emoji: '🏈' },
  { label: 'date night', emoji: '💕' }, { label: 'pet friendly', emoji: '🐾' },
];

const CATEGORY_FILTERS: CategoryFilter[] = [
  'All', 'Bars', 'Restaurants', 'Live Music', 'Comedy',
  'Events', 'Outdoors', 'Hidden Gems', 'Churches', 'Groceries', 'Gyms / Fitness',
];

const CATEGORY_ICONS: Record<CategoryFilter, string> = {
  All: '🌟', Bars: '🍺', Restaurants: '🍽️', 'Live Music': '🎸',
  Comedy: '😂', Events: '🎉', Outdoors: '🌿', 'Hidden Gems': '💎',
  Churches: '⛪', Groceries: '🛒', 'Gyms / Fitness': '💪',
};

const DATE_TABS: DateTab[] = ['Today', 'Tonight', 'This Weekend', 'This Week'];
const AFTER_PARTY_EVENTS: AfterPartyEvent[] = ['SXSW', 'ACL', 'COTA', 'Longhorns', 'Austin FC / MLS', 'Rodeo Austin'];

const HEADLINES = [
  "🎸 Austin voted #1 Live Music City — again, obviously",
  "🌮 Best taco debate: Valentina's vs. Veracruz — fight",
  "🌧️ Muddy Paws Advisory: showers at 10pm — patios ready",
  "🐓 McConaughey spotted on SoCo — alright alright",
  "💧 Barton Springs 68 degrees — it's always the move",
  "🐾 Austin #2 most pet-friendly city in TX — we're coming",
  "🎭 Paramount summer lineup dropped — cinema on 6th lives",
  "🦇 Congress Bridge bats returned early this year",
];

// ─────────────────────────────────────────────
// DATA: QUE PASA CAROUSEL
// ─────────────────────────────────────────────
const QUE_PASA_PHOTOS: QuePasaPhoto[] = [
  {
    id: 'qp1', username: '@austintx_vibes',
    photoUrl: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=600&q=80',
    caption: 'Austin nightlife pulse 🍹', venueName: 'Craft Pride',
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

// ─────────────────────────────────────────────
// DATA: AFTER PARTIES
// ─────────────────────────────────────────────
const AFTER_PARTIES: AfterParty[] = [
  {
    id: 'ap1', event: 'SXSW', venueName: 'Stubbs Waller Creek Amphitheater',
    address: '801 Red River St', neighborhood: 'Red River',
    time: 'Midnight – 3am', description: 'Austin late-night showcase preview. Venue details and event timing update as confirmed.',
    price: 'Badge / $20', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Stubbs+Amphitheater+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Stubbs+Waller+Creek+Austin',
  },
  {
    id: 'ap2', event: 'SXSW', venueName: 'Mohawk ATX – Outdoor Stage',
    address: '912 Red River St', neighborhood: 'Red River',
    time: '11pm – 2am', description: 'Red River late-night sets, craft beer specials, and skyline views.',
    price: 'RSVP Free / $15 door', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Mohawk+ATX+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Mohawk+Austin',
  },
  {
    id: 'ap3', event: 'ACL', venueName: 'Rainey Street Bar Hop',
    address: 'Rainey St, Austin TX', neighborhood: 'Rainey St',
    time: 'Gates close - last call', description: 'Rainey St goes full ACL after-party mode. Craft Pride, Container Bar, Banger\'s all open late. Live DJs, extended pours.',
    price: 'Free entry, drinks $$', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Rainey+Street+Austin+TX',
    appleMapsUrl: 'https://maps.apple.com/?q=Rainey+St+Austin',
  },
  {
    id: 'ap4', event: 'COTA', venueName: 'Cedar Street Courtyard',
    address: '208 W 4th St', neighborhood: 'Downtown',
    time: '6pm – 2am', description: 'Post-race party. DJ, full bar, outdoor patio. Race-themed cocktail specials. Flags and fire pits.',
    price: '$10 cover', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Cedar+Street+Courtyard+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Cedar+Street+Courtyard+Austin',
  },
  {
    id: 'ap5', event: 'Longhorns', venueName: 'Scholz Garten',
    address: '1607 San Jacinto Blvd', neighborhood: 'UT Campus',
    time: 'Post-game – midnight', description: 'The OG Longhorn after-party. Since 1866. Biergarten, Texas drafts, live music on game nights. Burnt orange everything.',
    price: 'Free entry', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Scholz+Garten+Austin',
    appleMapsUrl: 'https://maps.apple.com/?q=Scholz+Garten+Austin',
  },
  {
    id: 'ap6', event: 'Austin FC / MLS', venueName: 'The Pitch at Q2 Stadium',
    address: '10414 McKalla Pl', neighborhood: 'North Austin',
    time: 'Post-match – 1am', description: 'Official Austin FC supporter bar. Verde kit-wearing staff, Verde cocktails, match replays on loop. Verde til it hurts.',
    price: 'Free entry', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Q2+Stadium+Austin+TX',
    appleMapsUrl: 'https://maps.apple.com/?q=Q2+Stadium+Austin',
  },
  {
    id: 'ap7', event: 'Rodeo Austin', venueName: 'Whisler\'s',
    address: '1816 E 6th St', neighborhood: 'East Austin',
    time: '10pm – 2am', description: 'Post-rodeo mezcal haven. No boots required but appreciated. DJ sets, dim lights, and the best mezcal selection in Texas.',
    price: 'Free', verifiedOnly: false,
    googleMapsUrl: 'https://maps.google.com/?q=Whislers+Austin+TX',
    appleMapsUrl: 'https://maps.apple.com/?q=Whislers+Austin',
  },
];

// ─────────────────────────────────────────────
// DATA: COMEDY SHOWS
// ─────────────────────────────────────────────
const now = new Date('2026-04-04');
const COMEDY_SHOWS: ComedyShow[] = [
  {
    id: 'c1', title: 'Joe Pera: Soft Thoughts Tour', comedian: 'Joe Pera',
    venueName: 'Cap City Comedy Club', venueType: 'comedy club',
    date: 'Upcoming', dateObj: new Date('2026-04-04'),
    time: '8pm & 10pm', price: '$28-38', ticketUrl: 'https://capcitycomedy.com',
    hasAlcohol: true, hasFood: true, neighborhood: 'North Lamar',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600&q=80',
    soldOut: false,
  },
  {
    id: 'c2', title: 'Nikki Glaser: Alive Tour', comedian: 'Nikki Glaser',
    venueName: 'Moody Center', venueType: 'major venue',
    date: 'Upcoming', dateObj: new Date('2026-04-05'),
    time: '7:30pm', price: '$55-125', ticketUrl: 'https://moodycenteratx.com',
    hasAlcohol: true, hasFood: true, neighborhood: 'UT Area',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80',
    soldOut: false,
  },
  {
    id: 'c3', title: 'Open Mic Extravaganza', comedian: 'Various Local Comics',
    venueName: 'Spider House Cafe', venueType: 'comedy club',
    date: 'Upcoming', dateObj: new Date('2026-04-06'),
    time: '8pm', price: 'Free', ticketUrl: '',
    hasAlcohol: true, hasFood: false, neighborhood: 'Hyde Park',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
    soldOut: false,
  },
  {
    id: 'c4', title: 'Bill Burr: Back for More', comedian: 'Bill Burr',
    venueName: 'ACL Live at the Moody Theater', venueType: 'major venue',
    date: 'Upcoming', dateObj: new Date('2026-04-11'),
    time: '8pm', price: '$75-150', ticketUrl: 'https://acl-live.com',
    hasAlcohol: true, hasFood: true, neighborhood: 'Warehouse District',
    image: 'https://images.unsplash.com/photo-1486693128850-a77436e7ba3c?w=600&q=80',
    soldOut: false,
  },
  {
    id: 'c5', title: 'Thursday Laugh Factory', comedian: 'Local Showcase',
    venueName: 'Cap City Comedy Club', venueType: 'comedy club',
    date: 'Upcoming', dateObj: new Date('2026-04-10'),
    time: '9pm', price: '$15', ticketUrl: 'https://capcitycomedy.com',
    hasAlcohol: true, hasFood: true, neighborhood: 'North Lamar',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600&q=80',
    soldOut: false,
  },
  {
    id: 'c6', title: 'Chappelle Works in Progress', comedian: 'Dave Chappelle',
    venueName: 'The Paramount Theatre', venueType: 'major venue',
    date: 'Upcoming', dateObj: new Date('2026-04-12'),
    time: '10:30pm', price: '$45-95', ticketUrl: 'https://austintheatre.org',
    hasAlcohol: false, hasFood: false, neighborhood: 'Congress Ave',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80',
    soldOut: true,
  },
];

// ─────────────────────────────────────────────
// DATA: FEED CARDS (V7 — with new categories)
// ─────────────────────────────────────────────
const FEED_CARDS: FeedCard[] = [
  { id: '1', venueName: "Evangeline's", description: "Austin's best-kept Cajun secret on Brodie Lane. The crawfish etouffee is a spiritual experience — smoky, buttery, dangerously addictive. Live zydeco weekends.", vibeTags: ['chill', 'date night', 'live music'], petFriendly: true, isFoundingPartner: true, time: 'Open until 10pm', price: '$$', neighborhood: 'South Austin', likes: 342, comments: 87, category: 'Hidden Gems', happening: ['Today', 'Tonight', 'This Weekend', 'This Week'], address: '7113 Brodie Ln', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80' },
  { id: '2', venueName: 'Mohawk ATX', description: "TONIGHT: Wild Child + Hovvdy outdoor stage. $5 Lone Stars til 9pm with the skyline as your backdrop. Doors at 7.", vibeTags: ['loud', 'live music'], petFriendly: false, time: 'Tonight 7pm', price: '$15-25', neighborhood: 'Red River', likes: 518, comments: 143, category: 'Live Music', happening: ['Today', 'Tonight'], address: '912 Red River St', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80' },
  { id: '3', venueName: "Torchy's Tacos", description: "The Governator taco is BACK for one week. Poblano, grilled corn, queso fresco, and that green sauce nobody can explain. $3 off today 2-4pm.", vibeTags: ['chill', 'date night'], petFriendly: true, isSponsored: true, time: 'Deal til 4pm', price: '$', neighborhood: 'South Congress', likes: 892, comments: 234, category: 'Restaurants', happening: ['Today', 'Tonight'], address: '1311 S 1st St', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80' },
  { id: '4', venueName: 'Spider House Cafe', description: "Fairy lights, weird art everywhere, best patio in Austin. Open mic at 8pm. Cheap crafts, strong coffee, zero pretension. Peak Keep Austin Weird.", vibeTags: ['chill', 'live music', 'date night'], petFriendly: true, time: 'Open Mic 8pm', price: '$', neighborhood: 'Hyde Park', likes: 267, comments: 61, category: 'Bars', happening: ['Today', 'Tonight'], address: '2908 Fruth St', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80' },
  { id: '5', venueName: 'Cap City Comedy', description: "Joe Pera this weekend. Soothing existential humor. Tickets going fast — 8pm & 10pm shows. Two-drink minimum that honestly improves the set.", vibeTags: ['chill', 'date night'], petFriendly: false, time: 'Fri & Sat 8+10pm', price: '$$', neighborhood: 'North Lamar', likes: 445, comments: 128, category: 'Comedy', happening: ['This Weekend'], address: '8120 Research Blvd', image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600&q=80', verifiedOnly: true },
  { id: '6', venueName: 'Barton Springs Pool', description: "68 degrees year-round. Spring-fed pool inside Zilker Park. $5 to swim. Sunsets here are aggressively beautiful.", vibeTags: ['chill'], petFriendly: false, time: '5am-10pm', price: '$5', neighborhood: 'Zilker', likes: 1204, comments: 312, category: 'Outdoors', happening: ['Today', 'Tonight', 'This Weekend', 'This Week'], address: '2201 Barton Springs Rd', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { id: '7', venueName: 'Rainey Street Bar Hop', description: "Bungalows-turned-bars. Craft Pride, Container Bar rooftop. Start at Whislers for a mezcal negroni. End wherever the night takes you.", vibeTags: ['loud', 'date night', 'live music'], petFriendly: true, time: 'All night', price: '$$', neighborhood: 'Rainey St', likes: 733, comments: 189, category: 'Bars', happening: ['Today', 'Tonight', 'This Weekend'], address: 'Rainey St', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&q=80' },
  { id: '8', venueName: 'East Austin Food Trucks', description: "Veracruz migas. Valentinas BBQ. Peached Tortilla Japanese-Southern fusion. All in one lot. Bring stretchy pants.", vibeTags: ['chill', 'pet friendly'], petFriendly: true, time: '11am-midnight', price: '$', neighborhood: 'East Austin', likes: 967, comments: 274, category: 'Restaurants', happening: ['Today', 'Tonight', 'This Weekend', 'This Week'], address: 'E 6th St', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80' },
  { id: '9', venueName: 'Franklin Barbecue', description: "The line is real. It is worth it. Pre-order and skip the 4-hour wait. Most important Austin hack since SXSW parking.", vibeTags: ['chill'], petFriendly: false, time: 'Pre-orders 8 AM', price: '$$$', neighborhood: 'East Side', likes: 567, comments: 89, category: 'Restaurants', happening: ['Today', 'Tonight', 'This Weekend', 'This Week'], address: '900 E 11th St', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80' },
  { id: '10', venueName: 'Waterloo Records', description: "FREE in-store show tonight: Gorgeous Bully at 6pm. Local section stocked with records no algorithm will find.", vibeTags: ['chill', 'live music'], petFriendly: false, time: 'Free show 6pm', price: 'Free', neighborhood: 'Guadalupe', likes: 381, comments: 95, category: 'Events', happening: ['Today', 'Tonight'], address: '600A N Lamar', image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=600&q=80' },
  { id: '11', venueName: 'St. Mary Cathedral', description: "Historic cathedral on 10th and Brazos. Sunday services at 8am, 10am & noon. Beautiful stained glass. Open for quiet reflection daily.", vibeTags: ['chill'], petFriendly: false, time: 'Daily 7am-6pm', price: 'Free', neighborhood: 'Downtown', likes: 142, comments: 28, category: 'Churches', happening: ['Today', 'Tonight', 'This Weekend', 'This Week'], address: '203 E 10th St', image: 'https://images.unsplash.com/photo-1548625149-720754763f5e?w=600&q=80' },
  { id: '12', venueName: 'Whole Foods Market (Flagship)', description: "The original Whole Foods flagship on Lamar. Six floors of groceries, a rooftop bar, hot bar, sushi counter, and a cheese cave. Austin flex.", vibeTags: ['chill'], petFriendly: false, time: '7am-10pm', price: '$$$', neighborhood: 'Lamar', likes: 523, comments: 67, category: 'Groceries', happening: ['Today', 'Tonight', 'This Weekend', 'This Week'], address: '525 N Lamar Blvd', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80' },
  { id: '13', venueName: 'Austin Bouldering Project', description: "Massive bouldering gym with yoga, fitness, sauna, and showers. The social climbing scene in Austin. Community vibes, hard problems.", vibeTags: ['chill', 'sports'], petFriendly: false, time: '6am-10pm daily', price: '$22/day', neighborhood: 'East Austin', likes: 389, comments: 74, category: 'Gyms / Fitness', happening: ['Today', 'Tonight', 'This Weekend', 'This Week'], address: '979 Springdale Rd', image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=80' },
];

const LIVE_POSTS = [
  { id: 'lp1', venue: 'Mohawk ATX', handle: '@mohawkatx', message: 'Wild Child soundcheck DONE. Doors in 45 min. First 50 get free drink tickets!', timeAgo: '2m', type: 'event' as const, emoji: '🎸', likes: 34, isNew: true },
  { id: 'lp2', venue: "Evangeline's", handle: '@evangelinesatx', message: "Fresh crawfish dropped. Etouffee on the board. Walk-ins til 9:30pm.", timeAgo: '8m', type: 'update' as const, emoji: '🦞', likes: 67, isNew: true },
  { id: 'lp3', venue: 'AustiNights HQ', handle: '@realaustinights', message: 'MUDDY PAWS ALERT: Rain ~10pm. Rainey covered patios OPEN.', timeAgo: '12m', type: 'alert' as const, emoji: '🌧️', likes: 112 },
  { id: 'lp4', venue: 'Craft Pride', handle: '@craftprideatx', message: 'Happy Hour EXTENDED til 8pm — $2 off all TX craft drafts. 54 taps.', timeAgo: '19m', type: 'deal' as const, emoji: '🍺', likes: 89 },
  { id: 'lp5', venue: 'Spider House', handle: '@spiderhouse', message: 'Open mic NOW. Next slot 9:15. $3 drafts. Dogs welcome.', timeAgo: '23m', type: 'music' as const, emoji: '🎤', likes: 45 },
  { id: 'lp6', venue: 'Veracruz', handle: '@veracruzatx', message: 'Migas tacos til midnight. Line moving fast. Come hungry.', timeAgo: '31m', type: 'update' as const, emoji: '🌮', likes: 156 },
  { id: 'lp7', venue: 'Barton Springs', handle: '@bartonsprings', message: 'Water: 68F. Crowd: mellow. Sunset: 2 hours. $5. GO.', timeAgo: '44m', type: 'update' as const, emoji: '💧', likes: 203 },
];


// ─────────────────────────────────────────────
// DATA: COMMUNITY POSTS
// ─────────────────────────────────────────────
const COMMUNITY_POSTS = [
  { id: 'cp1', username: '@austinvibes_512', message: 'Anyone else at Mohawk rn? This band is INSANE', timeAgo: '3m', likes: 12 },
  { id: 'cp2', username: '@tacolife_atx', message: 'Valentinas brisket taco = life changing. Go now.', timeAgo: '11m', likes: 28 },
  { id: 'cp3', username: '@zilker_runner', message: 'Sunrise at Zilker never gets old. 5 years in ATX and still hits different', timeAgo: '22m', likes: 45 },
  { id: 'cp4', username: '@keepitweird', message: 'Just saw a guy playing guitar for his dog at Barton Springs. Peak Austin.', timeAgo: '38m', likes: 67 },
  { id: 'cp5', username: '@eastside_eats', message: 'Who is going to the after-party at Whislers tonight??', timeAgo: '1h', likes: 19 },
];

const ZETA_POST = {
  id: 'zeta1',
  photoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
  caption: 'Zeta had the BEST time at Barkingham Place! Made three new friends and only stole one tennis ball.',
  venue: 'Barkingham Place',
  week: 'Weekly local spotlight',
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function liveBadge(type: LivePost['type']) {
  const m: Record<string, { label: string; bg: string; fg: string }> = {
    update: { label: 'Update', bg: '#EFF6FF', fg: '#1D4ED8' },
    deal: { label: 'Deal', bg: '#F0FDF4', fg: '#15803D' },
    event: { label: 'Event', bg: '#FFFBEB', fg: '#B45309' },
    alert: { label: 'Alert', bg: '#FEF2F2', fg: '#B91C1C' },
    music: { label: 'Music', bg: '#FAF5FF', fg: '#7C3AED' },
  };
  return m[type] || m.update;
}

// Public contact inbox for Founding Member requests + Austin tips.
const CONTACT_EMAIL = 'info@realaustinights.com';

const FOUNDING_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Founding Member Request — Real AustiNights',
)}&body=${encodeURIComponent(
  `Hi Real AustiNights,

I want to be notified when Founding Member access opens.

Name:
Instagram:
Austin neighborhood:
`,
)}`;

const TIP_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Austin Tip — Real AustiNights',
)}&body=${encodeURIComponent(
  `Hi Real AustiNights,

I found something worth checking out.

Tip:
Location:
Date/time:
Instagram/credit:
`,
)}`;

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/** Founding Member request modal. Mailto-only, no auth, no DB, no fake send. */
function UserModeModal({
  onClose, S,
}: {
  onClose: () => void;
  S: ReturnType<typeof buildStyles>;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="founding-member-title"
        style={{
          background: '#FFFAF3', borderRadius: 24, padding: 40, maxWidth: 460, width: '90%',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)', fontFamily: S.font,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>&#129312;</div>
          <h2 id="founding-member-title" style={{ fontSize: 24, fontWeight: 800, color: S.text }}>
            Become a Founding Member
          </h2>
          <p style={{ fontSize: 14, color: S.textMid, marginTop: 12, lineHeight: 1.6 }}>
            Founding Member access is opening soon. Send a request and we&apos;ll follow up when early access opens.
          </p>
        </div>
        <a
          href={FOUNDING_MAILTO}
          style={{
            display: 'block', width: '100%', padding: 16, borderRadius: 14,
            background: S.teal, color: 'white', fontWeight: 700, fontSize: 15,
            fontFamily: S.font, textDecoration: 'none', textAlign: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)', boxSizing: 'border-box',
          }}
        >
          Send request
        </a>
        <p style={{ fontSize: 11, color: S.textLight, marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
          This opens your email app so you can send the request directly.
        </p>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: 12, marginTop: 12, borderRadius: 14,
            border: `1.5px solid ${S.border}`, cursor: 'pointer',
            background: 'transparent', color: S.textMid, fontWeight: 600,
            fontSize: 14, fontFamily: S.font,
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

/** Que Pasa Photo Carousel */
function QuePasaCarousel({ photos, S }: { photos: QuePasaPhoto[]; S: ReturnType<typeof buildStyles> }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = (dir: 1 | -1) => {
    setIdx(i => (i + dir + photos.length) % photos.length);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % photos.length), 4000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % photos.length), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [photos.length]);

  const photo = photos[idx];

  return (
    <div style={{
      background: 'white', borderRadius: 20, overflow: 'hidden',
      boxShadow: S.shadow, marginBottom: 28, border: `1px solid ${S.border}`,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px', borderBottom: '3px solid #1B2A4A', boxShadow: 'none', border: 'none',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>📸</span>
        <div>
          <div style={{ fontFamily: S.font, fontWeight: 800, fontSize: 15, color: S.text }}>
            ¿Que Pasa, Austin?
          </div>
          <div style={{ fontSize: 11, color: S.textLight }}>Real people. Real nights. Real Austin.</div>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: S.textLight, fontWeight: 600 }}>
          {idx + 1} / {photos.length}
        </span>
      </div>

      {/* Photo */}
      <div style={{ position: 'relative', height: 260 }}>
        <div
          key={photo.id}
          style={{
            position: 'absolute', inset: 0,
            background: `url(${photo.photoUrl}) center/cover`,
            animation: 'fadeIn 0.5s ease',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.72))',
          padding: '40px 18px 16px',
        }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: 0 }}>
            {photo.caption}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{photo.username}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>📍 {photo.venueName}</span>
          </div>
        </div>

        {/* Nav arrows */}
        {(['←', '→'] as const).map((arrow, i) => (
          <button
            key={arrow}
            onClick={() => advance(i === 0 ? -1 : 1)}
            style={{
              position: 'absolute', top: '50%', transform: 'translateY(-50%)',
              [i === 0 ? 'left' : 'right']: 12,
              background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8,
              width: 34, height: 34, fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {arrow}
          </button>
        ))}
      </div>

      {/* Map links + dots */}
      <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href={photo.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: 11, fontWeight: 700, color: '#1A73E8',
              background: '#EAF2FF', padding: '5px 12px', borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            🗺️ Google Maps
          </a>
          <a
            href={photo.appleMapsUrl} target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: 11, fontWeight: 700, color: '#555',
              background: '#F3F4F6', padding: '5px 12px', borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            🍎 Apple Maps
          </a>
        </div>
        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 5 }}>
          {photos.map((_, i) => (
            <button
              key={i} onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 18 : 7, height: 7, borderRadius: 4, border: 'none',
                background: i === idx ? S.teal : S.border,
                cursor: 'pointer', transition: 'all 0.3s',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** After Parties Section */
function AfterPartiesSection({ S }: { S: ReturnType<typeof buildStyles> }) {
  const [activeEvent, setActiveEvent] = useState<AfterPartyEvent>('SXSW');
  const parties = AFTER_PARTIES.filter(p => p.event === activeEvent);

  return (
    <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: S.shadow, marginBottom: 28, border: `1px solid ${S.border}` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ fontFamily: S.font, fontWeight: 800, fontSize: 18, marginBottom: 4 }}>
            🎉 Where Y'all Going?
          </h3>
          <p style={{ fontSize: 12, color: S.textLight }}>
            Public venues only. &nbsp;
            <strong style={{ color: '#B91C1C' }}>⚠️ Please do not post personal party locations.</strong>
          </p>
        </div>
      </div>

      {/* Event tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {AFTER_PARTY_EVENTS.map(ev => (
          <button
            key={ev}
            onClick={() => setActiveEvent(ev)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              border: 'none', cursor: 'pointer', fontFamily: S.font,
              background: activeEvent === ev ? S.violet : S.bg,
              color: activeEvent === ev ? 'white' : S.textMid,
              boxShadow: activeEvent === ev ? '0 2px 8px rgba(91,33,182,0.25)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {ev}
          </button>
        ))}
      </div>

      {/* Party cards */}
      {parties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: S.textLight, fontSize: 14 }}>
          No public after-parties listed yet for {activeEvent}. Check back soon!
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {parties.map(party => (
            <div key={party.id} style={{
              background: S.bg, borderRadius: 14, padding: 16,
              border: `1px solid ${S.border}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontFamily: S.font, fontWeight: 700, fontSize: 15 }}>{party.venueName}</div>
                <span style={{ fontSize: 12, color: S.textLight, fontWeight: 500 }}>{party.time}</span>
              </div>
              <div style={{ fontSize: 12, color: S.textLight, marginBottom: 8 }}>
                📍 {party.neighborhood} · {party.price}
              </div>
              <p style={{ fontSize: 13, color: S.textMid, lineHeight: 1.6, marginBottom: 10 }}>
                {party.description}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={party.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, fontWeight: 700, color: '#1A73E8', background: '#EAF2FF', padding: '5px 12px', borderRadius: 8, textDecoration: 'none' }}>
                  🗺️ Google Maps
                </a>
                <a href={party.appleMapsUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, fontWeight: 700, color: '#555', background: '#F3F4F6', padding: '5px 12px', borderRadius: 8, textDecoration: 'none' }}>
                  🍎 Apple Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Comedy Section */
function ComedySection({ S }: { S: ReturnType<typeof buildStyles> }) {
  const [venueType, setVenueType] = useState<ComedyVenueType>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = COMEDY_SHOWS.filter(show => {
    const venueMatch = venueType === 'all' || show.venueType === venueType;
    const fromMatch = !dateFrom || show.dateObj >= new Date(dateFrom);
    const toMatch = !dateTo || show.dateObj <= new Date(dateTo);
    return venueMatch && fromMatch && toMatch;
  });

  return (
    <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: S.shadow, marginBottom: 28, border: `1px solid ${S.border}` }}>
      <h3 style={{ fontFamily: S.font, fontWeight: 800, fontSize: 18, marginBottom: 4 }}>😂 Comedy in Austin</h3>
      <p style={{ fontSize: 12, color: S.textLight, marginBottom: 16 }}>Stand-up, open mics, and big touring acts.</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
        {/* Venue type toggle */}
        <div style={{ display: 'flex', background: S.bg, borderRadius: 10, padding: 3, border: `1px solid ${S.border}` }}>
          {(['all', 'comedy club', 'major venue'] as ComedyVenueType[]).map(t => (
            <button
              key={t}
              onClick={() => setVenueType(t)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                border: 'none', cursor: 'pointer', fontFamily: S.font,
                background: venueType === t ? S.teal : 'transparent',
                color: venueType === t ? 'white' : S.textMid,
                textTransform: 'capitalize', transition: 'all 0.2s',
              }}
            >
              {t === 'all' ? 'All Venues' : t === 'comedy club' ? '🎤 Club' : '🏟️ Major'}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 8, border: `1.5px solid ${S.border}`, fontSize: 12, fontFamily: S.fontBody, color: S.text, background: S.bg, outline: 'none' }}
          />
          <span style={{ fontSize: 12, color: S.textLight }}>→</span>
          <input
            type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 8, border: `1.5px solid ${S.border}`, fontSize: 12, fontFamily: S.fontBody, color: S.text, background: S.bg, outline: 'none' }}
          />
        </div>
      </div>

      {/* Show cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: S.textLight, fontSize: 14 }}>
          No shows found. Try adjusting the filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(show => (
            <div key={show.id} style={{
              display: 'flex', gap: 14, background: S.bg,
              borderRadius: 14, overflow: 'hidden', border: `1px solid ${S.border}`,
            }}>
              <div style={{
                width: 90, height: 90, flexShrink: 0,
                background: `url(${show.image}) center/cover`,
              }} />
              <div style={{ padding: '12px 16px 12px 0', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: S.font, fontWeight: 700, fontSize: 14, color: S.text }}>
                      {show.comedian}
                      {show.soldOut && (
                        <span style={{ marginLeft: 8, fontSize: 10, background: '#FEE2E2', color: '#B91C1C', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                          SOLD OUT
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: S.textLight }}>{show.venueName} · {show.neighborhood}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: S.teal }}>{show.date}</div>
                    <div style={{ fontSize: 11, color: S.textLight }}>{show.time}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: S.orange }}>{show.price}</span>
                  {show.hasAlcohol && <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>🍺 Bar</span>}
                  {show.hasFood && <span style={{ fontSize: 10, background: '#F0FDF4', color: '#166534', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>🍽️ Food</span>}
                  <span style={{ fontSize: 10, background: S.violetLight, color: S.violet, padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
                    {show.venueType === 'comedy club' ? '🎤 Club' : '🏟️ Major Venue'}
                  </span>
                  {show.ticketUrl && !show.soldOut && (
                    <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer"
                      style={{
                        marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: 'white',
                        background: S.teal, padding: '5px 12px', borderRadius: 8,
                        textDecoration: 'none',
                      }}
                    >
                      Tickets →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Send a tip — mailto-only. No upload, no fake submission. */
function SubmitWeirdStuff({ S }: { S: ReturnType<typeof buildStyles> }) {
  return (
    <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: S.shadow, marginBottom: 28, border: `1px solid ${S.border}` }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>🤔</span>
        <div>
          <h3 style={{ fontFamily: S.font, fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
            Found something weird, funny, or cool we missed?
          </h3>
          <p style={{ fontSize: 13, color: S.textMid, lineHeight: 1.6 }}>
            Send us a tip and we may feature it.
          </p>
        </div>
      </div>
      <a
        href={TIP_MAILTO}
        style={{
          display: 'block', width: '100%', padding: 13, borderRadius: 12,
          background: S.orange, color: 'white', fontWeight: 700, fontSize: 14,
          fontFamily: S.font, textDecoration: 'none', textAlign: 'center',
          boxShadow: '0 4px 14px rgba(255,140,0,0.3)', boxSizing: 'border-box',
        }}
      >
        Send a tip
      </a>
      <p style={{ fontSize: 11, color: S.textLight, marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
        This opens your email app so you can send the tip directly.
      </p>
    </div>
  );
}

/** Verified badge indicator */
function VerifiedBadge({ size = 12 }: { size?: number }) {
  return (
    <span
      title="Verified AustiNite — reviews and comments are from verified users only"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: size, fontWeight: 700, color: '#0369A1',
        background: '#E0F2FE', padding: `${size * 0.3}px ${size * 0.8}px`,
        borderRadius: size, verticalAlign: 'middle',
      }}
    >
      ✓ Verified
    </span>
  );
}

// ─────────────────────────────────────────────
// STYLE BUILDER (memoizable)
// ─────────────────────────────────────────────
function buildStyles() {
  return {
    font: "'Montserrat', system-ui, sans-serif",
    fontBody: "'Open Sans', system-ui, sans-serif",
    bg: '#FFFAF3', card: '#FFFFFF', teal: '#007A7A', tealLight: '#E8F5F5',
    orange: '#FF8C00', orangeLight: '#FFF4E6', violet: '#1B2A4A', violetLight: '#E8EDF5',
    red: '#BF0A30', redLight: '#FFF0F0',
    text: '#1B2A4A', textMid: '#4A5568', textLight: '#A8A29E', border: '#E8DFD0',
    shadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
    shadowHover: '0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.04)',
    radius: 16, radiusSm: 10,
  };
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function RealAustiNightsV7() {
  const S = buildStyles();

  // State
  const [tab, setTab] = useState<DateTab>('Tonight');
  const [vibes, setVibes] = useState<VibeFilter[]>([]);
  const [cats, setCats] = useState<CategoryFilter[]>(['All']);
  const [selected, setSelected] = useState<FeedCard | null>(null);
  const [hlIdx, setHlIdx] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [userMode, setUserMode] = useState<UserMode>(null);
  const [yearsInAustin, setYearsInAustin] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showQuePasaFull, setShowQuePasaFull] = useState(false);
  const [showCommunityFull, setShowCommunityFull] = useState(false);
  const [showPupperFull, setShowPupperFull] = useState(false);
  const [showDealsFull, setShowDealsFull] = useState(false);
  const [quePasaComment, setQuePasaComment] = useState('');

  // Founding Member access is not yet open; gated CTAs route to the request modal.
  const [isSignedUp] = useState(false);
  const requireLogin = () => {
    if (!isSignedUp) {
      setShowModal(true);
      return true;
    }
    return false;
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const t = setInterval(() => setHlIdx(i => (i + 1) % HEADLINES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const toggleVibe = (v: VibeFilter) =>
    setVibes(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const toggleCat = (c: CategoryFilter) => {
    if (c === 'All') { setCats(['All']); return; }
    setCats(p => {
      const n = p.includes(c)
        ? p.filter(x => x !== c && x !== 'All')
        : [...p.filter(x => x !== 'All'), c];
      return n.length === 0 ? ['All'] : n;
    });
  };

  const filtered = FEED_CARDS.filter(c => {
    const v = vibes.length === 0 || c.vibeTags.some(t => vibes.includes(t));
    const ct = cats.includes('All') || cats.includes(c.category);
    const d = c.happening.includes(tab);
    return v && ct && d;
  });

  const isAustinNite = userMode === 'austinnite';

  return (
    <div style={{ fontFamily: S.fontBody, background: S.bg, color: S.text, minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; }
        ::selection { background: #FF8C00; color: white; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* Collapse the 272/1fr/312 grid to a single column on tablet/mobile so the
           sticky side columns don't trap horizontal scroll on narrow viewports. */
        @media (max-width: 1024px) {
          .raln-three-col {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .raln-side {
            position: static !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            border-right: none !important;
            border-left: none !important;
            padding: 16px !important;
          }
        }
        @media (max-width: 768px) {
          .raln-left { display: none !important; }
        }
      `}</style>

      {/* Onboarding modal */}
      {mounted && showModal && <UserModeModal onClose={() => setShowModal(false)} S={S} />}

      {/* ── HEADER ── */}
      <header style={{ background: '#FFFAF3', borderBottom: '3px solid #1B2A4A', boxShadow: 'none', border: 'none', position: 'sticky', top: 0, zIndex: 50 }}>
        {/* Founding Member banner */}
        <div id="partner-cta" style={{ background: `linear-gradient(90deg, #1B2A4A, ${S.teal})`, padding: '6px 24px', textAlign: 'center' }}>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 600, fontFamily: S.font }}>
            <span style={{ color: '#FFD700' }}>Become a Founding Member</span>
          </span>
        </div>

        <nav style={{ padding: '8px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFAF3' }}>
          <div style={{ background: 'transparent' }}>
            <img src="/logo.png" alt="Real AustiNights" style={{ height: 160, width: 250, objectFit: 'fill' }} />
          </div>

          <div style={{ display: 'flex', gap: 20, alignItems: 'center', fontSize: 14, fontWeight: 600, fontFamily: S.font }}>
            <input type="text" placeholder="What Y'all Looking For?" style={{ padding: '8px 16px', borderRadius: 20, border: '1.5px solid ' + S.border, fontSize: 13, fontFamily: S.fontBody, outline: 'none', width: 200, background: S.bg }} onFocus={e => e.target.style.borderColor = S.orange} onBlur={e => e.target.style.borderColor = S.border} />
            <span style={{ color: S.orange, cursor: 'pointer' }} onClick={() => { setTab('Tonight'); document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' }); }}>Tonight</span>
            <span style={{ color: S.textMid, cursor: 'pointer' }} onClick={() => { setCats(['Hidden Gems']); document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' }); }}>Hidden Gems</span>
            <span style={{ color: S.violet, cursor: 'pointer' }} onClick={() => document.getElementById('partner-cta')?.scrollIntoView({ behavior: 'smooth' })}>For Business</span>

            {/* User mode pill */}
            {userMode && (
              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  background: isAustinNite ? S.tealLight : S.orangeLight,
                  color: isAustinNite ? S.teal : S.orange,
                  fontSize: 12, fontWeight: 700, fontFamily: S.font,
                }}
              >
                {isAustinNite ? `🏡 AustiNite${yearsInAustin ? ` · ${yearsInAustin}y` : ''}` : '✈️ Tourist'}
              </button>
            )}

            <button onClick={() => setShowModal(true)} style={{ background: S.orange, color: 'white', border: 'none', padding: '10px 24px', borderRadius: 24, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: S.font, boxShadow: '0 2px 8px rgba(255,140,0,0.3)' }}>
              Founding Member
            </button>
          </div>
        </nav>

        {/* Live ticker */}
        <div style={{ background: S.tealLight, padding: '8px 24px', borderTop: `1px solid ${S.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 500, color: S.teal }}>
            <span style={{ background: S.teal, color: 'white', padding: '2px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700 }}>LIVE</span>
            <span key={hlIdx} style={{ animation: 'fadeIn 0.4s ease' }}>{HEADLINES[hlIdx]}</span>
          </div>
        </div>
      </header>

      {/* ── THREE-COLUMN LAYOUT ── */}
      <div className="raln-three-col" style={{ display: 'grid', gridTemplateColumns: '272px 1fr 312px', minHeight: 'calc(100vh - 130px)' }}>

        {/* ── LEFT SIDEBAR ── */}
        <aside className="raln-side raln-left" style={{
          background: 'white', borderRight: `1px solid ${S.border}`, padding: 24,
          position: 'sticky', top: 130, height: 'calc(100vh - 130px)', overflowY: 'auto',
        }}>
          {/* Weather widget - dynamic personality */}
          {(() => {
            const temp = 82; const condition = 'clear';
            const rainy = condition.includes('rain') || condition.includes('storm');
            const cold = temp < 50; const cool = temp >= 50 && temp < 65;
            const hot = temp > 95; const perfect = temp >= 72 && temp <= 85 && !rainy;
            const name = rainy && cold ? '&#10052; SNUGGLE DAY' : rainy ? '&#128062; MUDDY PAWS' : cold ? '&#129507; BUNDLE UP' : cool ? '&#129507; SWEATER WEATHER' : hot ? '&#9728;&#65039; MELT MODE' : perfect ? '&#127793; PATIO WEATHER' : '&#127793; PARK DAY';
            const tip = rainy && cold ? 'Stay in, cuddle Zeta, order delivery' : rainy ? 'Covered patios only! Bring a towel for the pup' : cold ? 'Layer up! Hot toddy weather at the bars' : cool ? 'Grab a hoodie! Perfect walking weather' : hot ? 'Stay hydrated! Pool day or AC bars only' : perfect ? 'Perfect patio weather! No mud for Zeta tonight' : 'Get outside! Zeta says park time';
            const bg = rainy ? 'linear-gradient(135deg, #E2E8F0, #CBD5E1)' : cold ? 'linear-gradient(135deg, #E0E7FF, #C7D2FE)' : hot ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)' : 'linear-gradient(135deg, #E8F5F5, #F0FFFE)';
            return (
              <div style={{ background: bg, borderRadius: S.radiusSm, padding: 16, marginBottom: 24 }}>
                <div style={{ fontFamily: S.font, fontWeight: 700, fontSize: 12, color: S.teal, marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: name + ' FORECAST' }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 32, fontWeight: 800, fontFamily: S.font }}>{temp}&#176;</span>
                  <span style={{ fontSize: 13, color: S.textMid }}>{condition}</span>
                </div>
                <div style={{ fontSize: 12, color: S.textMid, marginTop: 6 }}>{tip}</div>
              </div>
            );
          })()}

          


          
          {/* ── QUE PASA + COMMUNITY SPLIT (top of sidebar) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16, height: 180 }}>
            {/* Left half: Que Pasa mini */}
            <div
              onClick={() => setShowQuePasaFull(true)}
              style={{
                background: `linear-gradient(135deg, ${S.teal}11, ${S.orange}11)`,
                borderRadius: 14, padding: 10, cursor: 'pointer',
                border: `1px solid ${S.border}`, overflow: 'hidden',
                display: 'flex', flexDirection: 'column' as const,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontFamily: S.font, fontWeight: 800, fontSize: 11, color: S.teal, marginBottom: 6 }}>
                ¿Que Pasa? 📸
              </div>
              <div style={{
                flex: 1, borderRadius: 10, overflow: 'hidden', position: 'relative' as const,
                background: `url(${QUE_PASA_PHOTOS[0].photoUrl}) center/cover`,
              }}>
                <div style={{
                  position: 'absolute' as const, bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  padding: '16px 8px 6px',
                }}>
                  <div style={{ color: 'white', fontSize: 10, fontWeight: 600 }}>
                    {QUE_PASA_PHOTOS[0].caption}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, marginTop: 2 }}>
                    {QUE_PASA_PHOTOS[0].username}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 9, color: S.textLight, marginTop: 4, textAlign: 'center' as const, fontWeight: 600 }}>
                Tap to view all + comment
              </div>
            </div>

            {/* Right half: Community */}
            <div
              onClick={() => setShowCommunityFull(true)}
              style={{
                background: 'white', borderRadius: 14, padding: 10, cursor: 'pointer',
                border: `1px solid ${S.border}`, overflow: 'hidden',
                display: 'flex', flexDirection: 'column' as const,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontFamily: S.font, fontWeight: 800, fontSize: 11, color: S.violet, marginBottom: 6 }}>
                Community 💬
              </div>
              <div style={{ flex: 1, overflowY: 'hidden' as const }}>
                {COMMUNITY_POSTS.slice(0, 3).map(post => (
                  <div key={post.id} style={{ marginBottom: 6, fontSize: 10, lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 700, color: S.teal }}>{post.username}</span>
                    <span style={{ color: S.textMid }}> {post.message.slice(0, 45)}...</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 9, color: S.textLight, marginTop: 4, textAlign: 'center' as const, fontWeight: 600 }}>
                Tap to join the conversation
              </div>
            </div>
          </div>

          {/* ── PUPPER WEEKLY POST ── */}
          <div onClick={() => setShowPupperFull(true)} style={{ cursor: 'pointer',
            background: `linear-gradient(135deg, ${S.tealLight}, ${S.orangeLight})`, borderRadius: 12,
            padding: 12, marginBottom: 20, border: `1px solid ${S.border}`,
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                width: 48, height: 120, objectFit: 'cover', objectPosition: 'center', borderRadius: 12, flexShrink: 0,
                background: `url(${ZETA_POST.photoUrl}) center/cover`,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: S.font, fontWeight: 800, fontSize: 11, color: S.orange }}>
                  PUPPER WEEKLY 🐾
                </div>
                <div style={{ fontSize: 10, color: S.textMid, lineHeight: 1.4, marginTop: 2 }}>
                  {ZETA_POST.caption.slice(0, 60)}...
                </div>
                <div style={{ fontSize: 9, color: S.textLight, marginTop: 2 }}>
                  @ {ZETA_POST.venue} &middot; {ZETA_POST.week}
                </div>
              </div>
            </div>
          </div>

          {/* ── DEALS ── */}
          <div onClick={() => setShowDealsFull(true)} style={{ cursor: 'pointer', background: 'white', borderRadius: 12, padding: 14, marginBottom: 20, border: '1px solid ' + S.border }}>
            <div style={{ fontFamily: S.font, fontWeight: 800, fontSize: 13, color: '#15803D', marginBottom: 10 }}>
              &#128176; DEALS
              <span style={{ fontSize: 10, color: S.textLight, fontWeight: 400, marginLeft: 6 }}>Local savings</span>
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: S.text }}>
              <div style={{ padding: '6px 0', borderBottom: '1px solid ' + S.border, display: 'flex', justifyContent: 'space-between' }}>
                <span>&#128663; Jiffy Lube S. Lamar</span>
                <span style={{ color: '#15803D', fontWeight: 700, fontSize: 11 }}>$20 off</span>
              </div>
              <div style={{ padding: '6px 0', borderBottom: '1px solid ' + S.border, display: 'flex', justifyContent: 'space-between' }}>
                <span>&#128085; Martinizing Dry Clean</span>
                <span style={{ color: '#15803D', fontWeight: 700, fontSize: 11 }}>20% off</span>
              </div>
              <div style={{ padding: '6px 0', borderBottom: '1px solid ' + S.border, display: 'flex', justifyContent: 'space-between' }}>
                <span>&#128722; H-E-B Mueller</span>
                <span style={{ color: '#15803D', fontWeight: 700, fontSize: 11 }}>BOGO deli</span>
              </div>
              <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>&#128136; SuperCuts Burnet</span>
                <span style={{ color: '#15803D', fontWeight: 700, fontSize: 11 }}>$5 off</span>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <span style={{ fontSize: 11, color: S.teal, fontWeight: 600, cursor: 'pointer' }}>View All Deals &#8594;</span>
            </div>
          </div>

          
          {/* Categories — now includes Churches, Groceries, Gyms */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: S.font, fontWeight: 700, fontSize: 11, color: S.textLight, letterSpacing: '0.08em', marginBottom: 10 }}>CATEGORIES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CATEGORY_FILTERS.map(c => (
                <button key={c} onClick={() => toggleCat(c)} style={{
                  padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  border: 'none', fontFamily: S.fontBody,
                  background: cats.includes(c) ? S.teal : S.bg,
                  color: cats.includes(c) ? 'white' : S.textMid,
                  transition: 'all 0.2s',
                }}>{CATEGORY_ICONS[c]} {c}</button>
              ))}
            </div>
          </div>

          {/* Tonight's pick */}
          <div style={{ background: S.orangeLight, borderRadius: S.radiusSm, padding: 16 }}>
            <div style={{ fontFamily: S.font, fontWeight: 700, fontSize: 12, color: S.orange, marginBottom: 6 }}>🍽️ TONIGHT&apos;S PICK</div>
            <div style={{ fontSize: 13, color: S.textMid, lineHeight: 1.6 }}>
              <strong style={{ color: S.text }}>Evangeline&apos;s</strong> — Cajun on Brodie. The etouffee will change your life. 🦞
            </div>
          </div>
        </aside>

        {/* ── MAIN FEED ── */}
        <main id="feed" style={{ padding: 28, overflowY: 'auto' }}>

          {/* Tourist restriction notice */}
          {userMode === 'tourist' && (
            <div style={{
              background: '#FFFBEB', border: `1.5px solid #FDE68A`, borderRadius: 14,
              padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#92400E',
              display: 'flex', gap: 10, alignItems: 'center',
            }}>
              <span style={{ fontSize: 20 }}>✈️</span>
              <div>
                <strong>Guest Access active.</strong> You can browse freely. Negative reviews require sign-in. Submitted photos are reviewed before going public.
                <span
                  onClick={() => setShowModal(true)}
                  style={{ marginLeft: 8, color: S.teal, cursor: 'pointer', fontWeight: 700 }}>
                  Sign in as AustiNite →
                </span>
              </div>
            </div>
          )}


          {/* Date tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {DATE_TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '10px 22px', borderRadius: 24, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', border: 'none', fontFamily: S.font,
                background: tab === t ? S.orange : 'white',
                color: tab === t ? 'white' : S.teal,
                boxShadow: tab === t ? '0 4px 14px rgba(255,140,0,0.3)' : S.shadow,
                transition: 'all 0.25s',
              }}>{t}</button>
            ))}
          </div>

          <h2 style={{ fontFamily: S.font, fontSize: 22, fontWeight: 800, marginBottom: 20 }}>
            What&apos;s Poppin&apos; <span style={{ color: S.orange }}>{tab}</span>
          </h2>

          {/* Feed Cards */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: S.textLight }}>No weirdness found. Try adjusting!</div>
          ) : filtered.map(card => (
            <div
              key={card.id}
              onClick={() => setSelected(card)}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: card.isFoundingPartner ? '#FFFCF0' : 'white',
                borderRadius: S.radius, marginBottom: 16, cursor: 'pointer',
                boxShadow: hovered === card.id ? S.shadowHover : S.shadow,
                transform: hovered === card.id ? 'translateY(-2px)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden', border: `1px solid ${hovered === card.id ? '#e0d8c8' : S.border}`,
              }}
            >
              <div style={{ height: 180, background: `url(${card.image}) center/cover`, position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
                  {card.isFoundingPartner && <span style={{ background: S.violet, color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 8, fontFamily: S.font }}>Founding Member</span>}
                  {card.isSponsored && <span style={{ background: 'rgba(255,140,0,0.9)', color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 8, fontFamily: S.font }}>Recommendation</span>}
                  {card.petFriendly && <span style={{ background: 'rgba(255,255,255,0.92)', color: S.teal, fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8, fontFamily: S.font }}>🐾 Pet Friendly</span>}
                </div>
              </div>
              <div style={{ padding: '16px 20px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontFamily: S.font, fontWeight: 800, fontSize: 17 }}>{card.venueName}</span>
                  {card.verifiedOnly && <VerifiedBadge />}
                </div>
                <div style={{ fontSize: 12, color: S.textLight, marginTop: 2 }}>{card.neighborhood} · {card.time} · {card.price}</div>
                <p style={{ fontSize: 14, color: S.textMid, lineHeight: 1.65, margin: '10px 0 14px' }}>{card.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {card.vibeTags.slice(0, 3).map(v => (
                      <span key={v} style={{ fontSize: 11, background: S.bg, color: S.textMid, padding: '4px 10px', borderRadius: 8, fontWeight: 500 }}>{v}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 13, color: S.textLight, fontWeight: 500 }}>
                    <span>❤️ {card.likes}</span>
                    <span>💬 {card.comments}</span>
                  </div>
                </div>
                {/* Verified-only comment notice */}
                {card.verifiedOnly && (
                  <div style={{ marginTop: 10, fontSize: 11, color: '#0369A1', background: '#E0F2FE', borderRadius: 8, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    ✓ Reviews &amp; comments for verified AustiNites only
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button style={{ background: S.teal, color: 'white', border: 'none', padding: '9px 20px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>View Details</button>
                  <button style={{ background: 'transparent', color: S.teal, border: `1.5px solid ${S.teal}`, padding: '8px 20px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: S.font }}>Get a Ride 🚗</button>
                </div>
              </div>
            </div>
          ))}

          {/* ── AFTER PARTIES ── */}
          <AfterPartiesSection S={S} />

          {/* ── COMEDY SECTION ── */}
          <ComedySection S={S} />

          {/* ── SUBMIT WEIRD STUFF ── */}
          <SubmitWeirdStuff S={S} />
        </main>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="raln-side raln-right" style={{
          background: 'white', borderLeft: `1px solid ${S.border}`, padding: 24,
          position: 'sticky', top: 130, height: 'calc(100vh - 130px)', overflowY: 'auto',
        }}>
          {selected ? (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <button onClick={() => setSelected(null)} style={{ background: S.bg, border: 'none', padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: S.textMid, marginBottom: 20, fontFamily: S.font }}>← Back</button>
              <div style={{ borderRadius: S.radius, height: 160, background: `url(${selected.image}) center/cover`, marginBottom: 16 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <h3 style={{ fontFamily: S.font, fontSize: 20, fontWeight: 800 }}>{selected.venueName}</h3>
                {selected.verifiedOnly && <VerifiedBadge size={11} />}
              </div>
              {selected.isFoundingPartner && (
                <span style={{ background: S.violetLight, color: S.violet, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 8, display: 'inline-block', marginBottom: 12, fontFamily: S.font }}>
                  Founding Member
                </span>
              )}
              <p style={{ fontSize: 14, color: S.textMid, lineHeight: 1.65, marginBottom: 16 }}>{selected.description}</p>
              <div style={{ fontSize: 13, color: S.textMid, lineHeight: 2.2 }}>
                <div>📍 {selected.address}</div>
                <div>🕐 {selected.time}</div>
                <div>💸 {selected.price}</div>
                <div>🐾 {selected.petFriendly ? 'Pet friendly — leash on!' : 'No pets, sorry'}</div>
              </div>
              {selected.verifiedOnly && !isAustinNite && (
                <div style={{ marginTop: 14, background: '#E0F2FE', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#0369A1' }}>
                  ✓ Reviews &amp; comments are for verified AustiNites only.
                  <span onClick={() => setShowModal(true)} style={{ marginLeft: 6, cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>Sign in →</span>
                </div>
              )}
              <button style={{ width: '100%', marginTop: 20, background: S.orange, color: 'white', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: S.font, boxShadow: '0 4px 14px rgba(255,140,0,0.3)' }}>
                Get a Ride Here 🚗
              </button>
              <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 13, color: S.textLight, justifyContent: 'center' }}>
                <span>❤️ {selected.likes}</span>
                <span>💬 {selected.comments}</span>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ fontFamily: S.font, fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Austin Pulse 🔥</h3>
              {LIVE_POSTS.map(post => {
                const b = liveBadge(post.type);
                return (
                  <div key={post.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '3px solid #1B2A4A', boxShadow: 'none', border: 'none' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                        {post.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontFamily: S.font, fontWeight: 700, fontSize: 13 }}>{post.venue}</span>
                          <span style={{ fontSize: 11, color: S.textLight }}>{post.timeAgo}</span>
                        </div>
                        <p style={{ fontSize: 13, color: S.textMid, lineHeight: 1.5, margin: '0 0 8px' }}>{post.message}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: b.bg, color: b.fg, fontFamily: S.font }}>{b.label}</span>
                          <span style={{ fontSize: 11, color: S.textLight }}>❤️ {post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </div>


      {/* ── QUE PASA FULLSCREEN MODAL ── */}
      {showQuePasaFull && (
        <div style={{
          position: 'fixed', inset: 0, background: '#FFFAF3', zIndex: 999,
          overflowY: 'auto',
        }}>
          {/* Newspaper Header */}
          <div style={{
            maxWidth: 1100, margin: '0 auto', padding: '24px 32px', position: 'relative' as const,
            borderBottom: '4px double #1B2A4A',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 42, fontWeight: 900, color: '#1B2A4A', margin: 0, letterSpacing: '-0.02em' }}>
                  ¿Que Pasa, Austin?
                </h1>
                <p style={{ fontFamily: S.fontBody, fontSize: 14, color: S.textMid, margin: '4px 0 0' }}>
                  Real photos from real locals. What's happening right now.
                </p>
              </div>
              <img src="/logo.png" alt="Real AustiNights" style={{ height: 100, width: 160, objectFit: 'fill' }} />
              <button onClick={() => setShowQuePasaFull(false)} style={{
                background: '#1B2A4A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: S.font,
              }}>&#10005; Close</button>
            </div>
          </div>

          {/* Photo Grid - Newspaper Style */}
          <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {QUE_PASA_PHOTOS.map((photo, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 16, overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s',
                }}>
                  <div style={{
                    width: '100%', height: 280, background: 'url(' + photo.photoUrl + ') center/cover',
                  }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ fontFamily: S.font, fontWeight: 700, fontSize: 15, color: '#1B2A4A', marginBottom: 4 }}>
                      {photo.caption}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span style={{ fontSize: 12, color: S.teal, fontWeight: 600 }}>{photo.username}</span>
                      <span style={{ fontSize: 11, color: S.textLight }}>{photo.venueName}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 12, color: S.textMid }}>
                      <span>&#10084; {0}</span>
                      <span>&#128172; {0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tip prompt */}
            <div style={{
              textAlign: 'center', padding: '32px 0', marginTop: 20,
              borderTop: '2px solid #1B2A4A',
            }}>
              <p style={{ fontFamily: S.font, fontSize: 18, fontWeight: 700, color: '#1B2A4A' }}>
                Got a photo? Share what&apos;s happening in YOUR Austin.
              </p>
              <a href={TIP_MAILTO} style={{
                display: 'inline-block',
                background: S.teal, color: 'white', padding: '14px 32px',
                borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: S.font,
                boxShadow: '0 4px 14px rgba(0,122,122,0.3)', marginTop: 12,
              }}>
                Send a tip &#128248;
              </a>
              <p style={{ fontSize: 12, color: S.textLight, marginTop: 8 }}>
                This opens your email app so you can send the tip directly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── COMMUNITY FULLSCREEN MODAL ── */}
      {showCommunityFull && (
        <div style={{
          position: 'fixed', inset: 0, background: '#FFFAF3', zIndex: 999,
          overflowY: 'auto',
        }}>
          <div style={{
            maxWidth: 1100, margin: '0 auto', padding: '24px 32px', position: 'relative' as const,
            borderBottom: '4px double #1B2A4A',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 42, fontWeight: 900, color: '#1B2A4A', margin: 0 }}>
                  Community
                </h1>
                <p style={{ fontFamily: S.fontBody, fontSize: 14, color: S.textMid, margin: '4px 0 0' }}>
                  Real talk from real AustiNites. What's on your mind?
                </p>
              </div>
              <img src="/logo.png" alt="Real AustiNights" style={{ height: 100, width: 160, objectFit: 'fill' }} />
              <button onClick={() => setShowCommunityFull(false)} style={{
                background: '#1B2A4A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: S.font,
              }}>&#10005; Close</button>
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 32px' }}>
            {COMMUNITY_POSTS.map(post => (
              <div key={post.id} style={{
                background: 'white', borderRadius: 16, padding: 24, marginBottom: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: S.font, fontWeight: 700, fontSize: 15, color: S.teal }}>{post.username}</span>
                  <span style={{ fontSize: 12, color: S.textLight }}>{post.timeAgo}</span>
                </div>
                <p style={{ fontSize: 16, color: '#1B2A4A', lineHeight: 1.7, margin: '8px 0' }}>{post.message}</p>
                <div style={{ fontSize: 13, color: S.textMid }}>&#10084; {post.likes}</div>
              </div>
            ))}
            <div style={{ textAlign: 'center', padding: '32px 0', marginTop: 20, borderTop: '2px solid #1B2A4A' }}>
              <p style={{ fontFamily: S.font, fontSize: 18, fontWeight: 700, color: '#1B2A4A' }}>
                Got something to say? Send us a tip.
              </p>
              <a href={TIP_MAILTO} style={{
                display: 'inline-block',
                background: '#1B2A4A', color: 'white', padding: '14px 32px',
                borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: S.font,
                boxShadow: '0 4px 14px rgba(27,42,74,0.3)', marginTop: 12,
              }}>
                Send a tip
              </a>
              <p style={{ fontSize: 12, color: S.textLight, marginTop: 8 }}>
                This opens your email app so you can send the tip directly.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* ── PUPPER WEEKLY FULLSCREEN ── */}
      {showPupperFull && (
        <div style={{
          position: 'fixed', inset: 0, background: '#FFFAF3', zIndex: 999,
          overflowY: 'auto',
        }}>
          <div style={{
            maxWidth: 1100, margin: '0 auto', padding: '24px 32px', position: 'relative' as const,
            borderBottom: '4px double #1B2A4A',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 42, fontWeight: 900, color: '#1B2A4A', margin: 0 }}>
                  Pupper Weekly
                </h1>
                <p style={{ fontFamily: S.fontBody, fontSize: 14, color: S.textMid, margin: '4px 0 0' }}>
                  Austin's cutest pups. Powered by Barkingham Place.
                </p>
              </div>
              <img src="/logo.png" alt="Real AustiNights" style={{ height: 100, width: 160, objectFit: 'fill' }} />
              <button onClick={() => setShowPupperFull(false)} style={{
                background: '#1B2A4A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: S.font,
              }}>&#10005; Close</button>
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ width: '100%', height: 280, background: 'url(https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80) center/cover' }} />
                <div style={{ padding: 16 }}>
                  <div style={{ fontFamily: S.font, fontWeight: 700, fontSize: 15, color: '#1B2A4A' }}>Zeta's Big Week at Barkingham Place</div>
                  <div style={{ fontSize: 12, color: S.teal, fontWeight: 600, marginTop: 6 }}>@ Barkingham Place</div>
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ width: '100%', height: 280, background: 'url(https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&q=80) center/cover' }} />
                <div style={{ padding: 16 }}>
                  <div style={{ fontFamily: S.font, fontWeight: 700, fontSize: 15, color: '#1B2A4A' }}>Max the Golden at Zilker Park</div>
                  <div style={{ fontSize: 12, color: S.teal, fontWeight: 600, marginTop: 6 }}>@ Zilker Park</div>
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ width: '100%', height: 280, background: 'url(https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&q=80) center/cover' }} />
                <div style={{ padding: 16 }}>
                  <div style={{ fontFamily: S.font, fontWeight: 700, fontSize: 15, color: '#1B2A4A' }}>Luna loves Lady Bird Lake trails</div>
                  <div style={{ fontSize: 12, color: S.teal, fontWeight: 600, marginTop: 6 }}>@ Lady Bird Lake</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '32px 0', marginTop: 20, borderTop: '2px solid #1B2A4A' }}>
              <p style={{ fontFamily: S.font, fontSize: 18, fontWeight: 700, color: '#1B2A4A' }}>
                Got a cute pup? Send us a tip.
              </p>
              <a href={TIP_MAILTO} style={{
                display: 'inline-block',
                background: S.orange, color: 'white', padding: '14px 32px',
                borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: S.font,
                boxShadow: '0 4px 14px rgba(255,140,0,0.3)', marginTop: 12,
              }}>
                Send a tip
              </a>
              <p style={{ fontSize: 12, color: S.textLight, marginTop: 8 }}>
                This opens your email app so you can send the tip directly.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* ── DEALS FULLSCREEN ── */}
      {showDealsFull && (
        <div style={{
          position: 'fixed', inset: 0, background: '#FFFAF3', zIndex: 999,
          overflowY: 'auto',
        }}>
          <div style={{
            maxWidth: 1100, margin: '0 auto', padding: '24px 32px', position: 'relative' as const,
            borderBottom: '4px double #15803D',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 42, fontWeight: 900, color: '#15803D', margin: 0 }}>
                  Austin Deals
                </h1>
                <p style={{ fontFamily: S.fontBody, fontSize: 14, color: S.textMid, margin: '4px 0 0' }}>
                  Local savings from businesses you trust.
                </p>
              </div>
              <img src="/logo.png" alt="Real AustiNights" style={{ height: 100, width: 160, objectFit: 'fill' }} />
              <button onClick={() => setShowDealsFull(false)} style={{
                background: '#15803D', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: S.font,
              }}>&#10005; Close</button>
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {[
                { name: 'Jiffy Lube S. Lamar', deal: '$20 off full service oil change', category: 'Auto', icon: '&#128663;' },
                { name: 'Martinizing Dry Clean', deal: '20% off first dry cleaning order', category: 'Services', icon: '&#128085;' },
                { name: 'H-E-B Mueller', deal: 'BOGO deli sandwiches all week', category: 'Grocery', icon: '&#128722;' },
                { name: 'SuperCuts Burnet', deal: '$5 off any haircut', category: 'Beauty', icon: '&#128136;' },
                { name: 'Pep Boys N. Lamar', deal: 'Free brake inspection + 15% off pads', category: 'Auto', icon: '&#128663;' },
                { name: 'Austin Pet Ranch', deal: 'Buy 2 bags of food, get 1 free', category: 'Pets', icon: '&#128054;' },
                { name: 'Great Clips Anderson', deal: '$3 off any haircut with check-in', category: 'Beauty', icon: '&#128136;' },
                { name: 'Lone Star Cleaners', deal: '30% off comforters and blankets', category: 'Services', icon: '&#128085;' },
                { name: 'Randalls Westlake', deal: '$10 off $50 grocery order', category: 'Grocery', icon: '&#128722;' },
              ].map((d, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 16, padding: 24,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, background: '#E8F5E9', color: '#15803D', padding: '4px 10px', borderRadius: 8, fontWeight: 700 }}>{d.category}</span>
                    <span dangerouslySetInnerHTML={{ __html: d.icon }} style={{ fontSize: 24 }} />
                  </div>
                  <div style={{ fontFamily: S.font, fontWeight: 700, fontSize: 17, color: '#1B2A4A', marginBottom: 8 }}>{d.name}</div>
                  <div style={{ fontSize: 14, color: '#15803D', fontWeight: 700, marginBottom: 4 }}>{d.deal}</div>
                  <div style={{ fontSize: 12, color: S.textLight, marginTop: 'auto', paddingTop: 8 }}>Show this screen at checkout</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', padding: '32px 0', marginTop: 20, borderTop: '2px solid #15803D' }}>
              <p style={{ fontFamily: S.font, fontSize: 18, fontWeight: 700, color: '#1B2A4A' }}>
                Own a business? Get your deals in front of Austin.
              </p>
              <button onClick={() => { if (requireLogin()) return; }} style={{
                background: '#15803D', color: 'white', border: 'none', padding: '14px 32px',
                borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: S.font,
                boxShadow: '0 4px 14px rgba(21,128,61,0.3)', marginTop: 12,
              }}>
                List Your Business
              </button>
            </div>
          </div>
        </div>
      )}



      {/* ── FOOTER ── */}
      <footer style={{ background: S.teal, color: 'white', textAlign: 'center', padding: '28px 24px' }}>
        <div style={{ fontFamily: S.font, fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
          Real<span style={{ color: '#FFD700' }}>AustiNights</span>
        </div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>Real locals. Real vibes. Real fun.</div>
        <div style={{ fontSize: 11, opacity: 0.4, marginTop: 8 }}>
          &copy; 2026 Real AustiNights. Keep it weird, y&apos;all. ✝️
        </div>
      </footer>
    </div>
  );
}
