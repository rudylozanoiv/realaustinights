'use client';

import Link from 'next/link';
import clsx from 'clsx';
import type { HomepageCategoryPill } from '@/lib/homepage-types';

interface CategoryPillsProps {
  items: HomepageCategoryPill[];
  hrefBase?: string;
}

function categorySlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function CategoryPills({ items, hrefBase = '/tonight' }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Tonight categories">
      {items.map((item) => (
        <Link
          key={item.label}
          href={`${hrefBase}?category=${categorySlug(item.label)}`}
          role="listitem"
          aria-pressed={item.active ? 'true' : undefined}
          data-category={item.label}
          className={clsx(
            'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70',
            item.active
              ? 'border-pink/50 bg-[rgba(255,45,135,0.08)] text-pink shadow-[0_0_18px_rgba(255,45,135,0.12)]'
              : 'border-white/10 bg-[rgba(255,255,255,0.03)] text-white/78 hover:border-white/25 hover:text-white',
          )}
        >
          {item.icon ? <span aria-hidden>{item.icon}</span> : null}
          {item.label}
        </Link>
      ))}
    </div>
  );
}
