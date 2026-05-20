export interface HomepageNavItem {
  label: string;
  href: string;
}

export interface HomepageCategoryPill {
  label: string;
  icon?: string;
  active?: boolean;
}

export interface HomepageVenueCard {
  id: string;
  slug: string;
  title: string;
  venueName: string;
  neighborhood: string;
  category: string;
  image: string;
  statusBadge: string;
  timeLabel: string;
  ratingLabel: string;
  availabilityLabel: string;
  availabilityTone?: 'hot' | 'warm' | 'steady';
  tags: string[];
  ctaLabel: string;
  href: string;
  hasDetailPage?: boolean;
}

export interface HomepageSignalItem {
  id: string;
  district: string;
  heatLabel: string;
  trendLabel: string;
  categoryHint: string;
  href: string;
  rank: number;
  mapX: string;
  mapY: string;
  previewSignals?: string[];
  anchorVenues?: string[];
  vibeNote?: string;
}

export interface HomepageLowerModule {
  id: string;
  title: string;
  caption: string;
  icon: string;
  accent: 'pink' | 'amber' | 'violet' | 'cyan' | 'lime';
  href: string;
  eyebrow?: string;
  honestyLabel?: string;
}

export interface HomepageImageRailItem {
  id: string;
  image: string;
  caption: string;
  neighborhood: string;
  category: string;
  href: string;
  rightsStatus: 'curated' | 'approved' | 'permissioned';
  attribution: string;
}

export interface HomepageCalendarItem {
  id: string;
  dayLabel: string;
  dateLabel: string;
  timeLabel: string;
  title: string;
  venue: string;
  neighborhood: string;
  category: string;
  status: string;
  href: string;
}
