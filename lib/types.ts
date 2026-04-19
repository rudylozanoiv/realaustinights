export type DateTab = 'Today' | 'Tonight' | 'This Weekend' | 'This Week';

export type VibeFilter =
  | 'chill'
  | 'loud'
  | 'live music'
  | 'sports'
  | 'date night'
  | 'pet friendly';

export type CategoryFilter =
  | 'All'
  | 'Bars'
  | 'Restaurants'
  | 'Live Music'
  | 'Comedy'
  | 'Events'
  | 'Outdoors'
  | 'Hidden Gems'
  | 'Churches'
  | 'Groceries'
  | 'Gyms / Fitness';

export type UserMode = 'austinight' | 'tourist' | null;

export type AfterPartyEvent =
  | 'SXSW'
  | 'ACL'
  | 'COTA'
  | 'Longhorns'
  | 'Austin FC / MLS'
  | 'Rodeo Austin';

export type ComedyVenueType = 'comedy club' | 'major venue' | 'all';

export interface FeedCard {
  id: string;
  venueName: string;
  description: string;
  vibeTags: VibeFilter[];
  petFriendly: boolean;
  isSponsored?: boolean;
  isFoundingPartner?: boolean;
  isFeaturedPartner?: boolean;
  isHiddenGem?: boolean;
  time?: string;
  price?: string;
  neighborhood: string;
  likes: number;
  comments: number;
  category: Exclude<CategoryFilter, 'All'>;
  happening: DateTab[];
  address: string;
  image: string;
  verifiedOnly?: boolean;
}

export interface LivePost {
  id: string;
  venue: string;
  handle: string;
  message: string;
  timeAgo: string;
  type: 'update' | 'deal' | 'event' | 'alert' | 'music';
  emoji: string;
  likes: number;
  isNew?: boolean;
}

export interface QuePasaPhoto {
  id: string;
  photoUrl: string;
  caption: string;
  username: string;
  venueName: string;
  googleMapsUrl: string;
  appleMapsUrl: string;
  neighborhood: string;
}

export interface AfterParty {
  id: string;
  event: AfterPartyEvent;
  venueName: string;
  address: string;
  neighborhood: string;
  time: string;
  description: string;
  price: string;
  verifiedOnly: boolean;
  googleMapsUrl: string;
  appleMapsUrl: string;
}

export interface ComedyShow {
  id: string;
  title: string;
  comedian: string;
  venueName: string;
  venueType: 'comedy club' | 'major venue';
  date: string;
  dateObj: Date;
  time: string;
  price: string;
  ticketUrl: string;
  hasAlcohol: boolean;
  hasFood: boolean;
  neighborhood: string;
  image: string;
  soldOut?: boolean;
}

export interface CommunityPost {
  id: string;
  username: string;
  message: string;
  timeAgo: string;
  likes: number;
}

export interface ZetaPost {
  id: string;
  photoUrl: string;
  caption: string;
  venue: string;
  week: string;
}

export type SponsorTier = 'free' | 'featured' | 'founding';

export interface Deal {
  id: string;
  businessName: string;
  description: string;
  category: 'Auto' | 'Services' | 'Grocery' | 'Beauty' | 'Pets' | 'Food' | 'Other';
  icon: string;
  /** ISO date string (YYYY-MM-DD). Expired deals are auto-hidden. */
  expiresDate: string;
  isRecurring: boolean;
  sponsorTier: SponsorTier;
}

/** Major Austin event windows — drive calendar headlines and AfterThis tab glow. */
export interface MajorEvent {
  id: string;
  name: 'SXSW' | 'ACL' | 'COTA' | 'Rodeo' | 'Longhorns' | 'Austin FC';
  /** Display label for "We're Austin — …" headline. */
  label: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  /** Optional event logo. Renders alongside the "We're Austin — X" headline when present. */
  logoUrl?: string;
}
