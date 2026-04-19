'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { LivePost } from '@/lib/types';

interface AustinPulseProps {
  posts: LivePost[];
  className?: string;
}

const BADGE_STYLES: Record<LivePost['type'], string> = {
  update: 'bg-blue-50 text-blue-700',
  deal: 'bg-green-50 text-green-700',
  event: 'bg-amber-50 text-amber-700',
  alert: 'bg-red/10 text-red',
  music: 'bg-purple-50 text-purple-700',
};

const BADGE_LABEL: Record<LivePost['type'], string> = {
  update: 'Update',
  deal: 'Deal',
  event: 'Event',
  alert: 'Alert',
  music: 'Music',
};

export function AustinPulse({ posts, className }: AustinPulseProps) {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [reportOpen, setReportOpen] = useState<string | null>(null);

  const toggleLike = (id: string) =>
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleExpand = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <section
      aria-label="Austin Pulse — live posts"
      className={clsx(
        'rounded-2xl border border-hairline bg-white p-4 shadow-sm md:p-5',
        className,
      )}
    >
      <h2 className="mb-3 font-display text-base font-extrabold text-ink md:text-lg">
        Austin Pulse <span aria-hidden>🔥</span>
      </h2>
      <ul className="divide-y divide-hairline">
        {posts.map(post => {
          const likeCount = post.likes + (liked[post.id] ? 1 : 0);
          const isExpanded = !!expanded[post.id];
          return (
            <li key={post.id} className="py-3">
              <button
                type="button"
                onClick={() => toggleExpand(post.id)}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} post from ${post.venue}`}
                className="flex w-full gap-3 rounded-lg text-left transition-colors hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                <div
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cream text-lg"
                >
                  {post.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-bold text-ink">
                      {post.venue}
                    </span>
                    <span className="text-[11px] text-ink-light">{post.timeAgo}</span>
                  </div>
                  <p className="mt-1 text-sm leading-snug text-ink-mid">{post.message}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={clsx(
                        'rounded px-2 py-0.5 font-display text-[10px] font-bold',
                        BADGE_STYLES[post.type],
                      )}
                    >
                      {BADGE_LABEL[post.type]}
                    </span>
                    <span className="text-[10px] text-ink-light">
                      {post.handle}
                    </span>
                    <span className="ml-auto text-[10px] text-ink-light" aria-hidden>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-3 ml-12 rounded-lg border border-hairline bg-cream p-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-mid">
                    <span className="rounded-md bg-white px-2 py-0.5 font-bold text-navy">
                      📍 {post.venue}
                    </span>
                    <span className="rounded-md bg-white px-2 py-0.5 font-bold text-teal">
                      3 posts · 2 images
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-ink-mid">
                    Full venue page + linked comments coming soon.
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        toggleLike(post.id);
                      }}
                      aria-pressed={!!liked[post.id]}
                      aria-label={liked[post.id] ? 'Unlike' : 'Like'}
                      className="rounded-md bg-white px-2.5 py-1 text-xs text-ink-light shadow-sm hover:text-red"
                    >
                      <span aria-hidden>{liked[post.id] ? '❤️' : '🤍'}</span> {likeCount}
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        aria-label={`Report post from ${post.venue}`}
                        aria-expanded={reportOpen === post.id}
                        onClick={e => {
                          e.stopPropagation();
                          setReportOpen(v => (v === post.id ? null : post.id));
                        }}
                        className="grid h-7 w-7 place-items-center rounded-md bg-white text-ink-light shadow-sm hover:bg-cream"
                      >
                        <span aria-hidden>⋯</span>
                      </button>
                      {reportOpen === post.id && (
                        <div
                          role="menu"
                          className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-hairline bg-white p-1 text-sm shadow-lg"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={e => {
                              e.stopPropagation();
                              setReportOpen(null);
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
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
