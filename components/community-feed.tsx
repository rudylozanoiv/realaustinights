'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { CommunityPost } from '@/lib/types';

interface CommunityFeedProps {
  posts: CommunityPost[];
  onPostClick: () => void;
  className?: string;
}

export function CommunityFeed({ posts, onPostClick, className }: CommunityFeedProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [reportOpenFor, setReportOpenFor] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      aria-label="Community feed"
      className={clsx(
        'rounded-2xl border border-hairline bg-white p-4 shadow-sm md:p-5',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-extrabold text-ink md:text-lg">
            Community <span aria-hidden>💬</span>
          </h2>
          <p className="text-[11px] text-ink-light">Real talk from real AustiNights.</p>
        </div>
        <button
          type="button"
          onClick={onPostClick}
          className="rounded-lg bg-navy px-4 py-2 font-display text-xs font-bold text-white shadow hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Post to Community
        </button>
      </div>

      <ul className="divide-y divide-hairline">
        {posts.map(post => {
          const isExpanded = expanded.has(post.id);
          const short = post.message.length > 120 && !isExpanded
            ? post.message.slice(0, 120) + '…'
            : post.message;
          return (
            <li key={post.id} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-display font-bold text-teal">{post.username}</span>
                    <span className="text-ink-light">{post.timeAgo}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{short}</p>
                  {post.message.length > 120 && (
                    <button
                      type="button"
                      onClick={() => toggle(post.id)}
                      className="mt-1 text-[11px] font-semibold text-teal hover:underline"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                  <div className="mt-1.5 text-xs text-ink-light">
                    <span aria-label={`${post.likes} likes`}>
                      <span aria-hidden>❤️</span> {post.likes}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    aria-label={`Report post by ${post.username}`}
                    aria-expanded={reportOpenFor === post.id}
                    onClick={() => setReportOpenFor(v => (v === post.id ? null : post.id))}
                    className="grid h-8 w-8 place-items-center rounded-md text-ink-light hover:bg-cream"
                  >
                    <span aria-hidden>⋯</span>
                  </button>
                  {reportOpenFor === post.id && (
                    <div
                      role="menu"
                      className="absolute right-0 top-9 z-10 w-36 rounded-lg border border-hairline bg-white p-1 text-sm shadow-lg"
                    >
                      <button
                        role="menuitem"
                        type="button"
                        onClick={() => {
                          setReportOpenFor(null);
                          alert('Report submitted. Thanks for keeping Austin kind.');
                        }}
                        className="block w-full rounded px-2 py-1.5 text-left text-red hover:bg-cream"
                      >
                        Report post
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
