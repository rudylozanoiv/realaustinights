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
  const [reportOpen, setReportOpen] = useState<string | null>(null);

  const toggleLike = (id: string) =>
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));

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
          return (
            <li key={post.id} className="py-3">
              <div className="flex gap-3">
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
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span
                      className={clsx(
                        'rounded px-2 py-0.5 font-display text-[10px] font-bold',
                        BADGE_STYLES[post.type],
                      )}
                    >
                      {BADGE_LABEL[post.type]}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        aria-pressed={!!liked[post.id]}
                        aria-label={liked[post.id] ? 'Unlike' : 'Like'}
                        className="text-xs text-ink-light hover:text-red"
                      >
                        <span aria-hidden>{liked[post.id] ? '❤️' : '🤍'}</span> {likeCount}
                      </button>
                      <div className="relative">
                        <button
                          type="button"
                          aria-label={`Report post from ${post.venue}`}
                          aria-expanded={reportOpen === post.id}
                          onClick={() => setReportOpen(v => (v === post.id ? null : post.id))}
                          className="grid h-7 w-7 place-items-center rounded-md text-ink-light hover:bg-cream"
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
                              onClick={() => {
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
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
