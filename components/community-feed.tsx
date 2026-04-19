'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { CommunityPost } from '@/lib/types';

interface CommunityFeedProps {
  posts: CommunityPost[];
  onPostClick: () => void;
  isSignedIn?: boolean;
  onSignInRequired?: () => void;
  className?: string;
}

export function CommunityFeed({
  posts,
  onPostClick,
  isSignedIn = false,
  onSignInRequired,
  className,
}: CommunityFeedProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [reportOpenFor, setReportOpenFor] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

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
          const needsTruncate = post.message.length > 120;
          const short =
            needsTruncate && !isExpanded
              ? post.message.slice(0, 120) + '…'
              : post.message;
          return (
            <li key={post.id} className="py-3">
              <div className="flex items-start justify-between gap-3">
                {/* Whole post is a button — tap anywhere to expand/collapse. */}
                <button
                  type="button"
                  onClick={() => toggle(post.id)}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} post by ${post.username}`}
                  className="min-w-0 flex-1 rounded-lg text-left transition-colors hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-display font-bold text-teal">{post.username}</span>
                    <span className="text-ink-light">{post.timeAgo}</span>
                    <span className="ml-auto text-[10px] text-ink-light" aria-hidden>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{short}</p>
                  <div className="mt-1.5 text-xs text-ink-light">
                    <span aria-label={`${post.likes} likes`}>
                      <span aria-hidden>❤️</span> {post.likes}
                    </span>
                  </div>
                </button>
                <div className="relative shrink-0">
                  <button
                    type="button"
                    aria-label={`Report post by ${post.username}`}
                    aria-expanded={reportOpenFor === post.id}
                    onClick={e => {
                      e.stopPropagation();
                      setReportOpenFor(v => (v === post.id ? null : post.id));
                    }}
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

              {/* Expanded panel: thread placeholder + Reply (signed in) / Sign in prompt */}
              {isExpanded && (
                <div className="mt-3 rounded-lg border border-hairline bg-cream p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-light">
                    Thread
                  </p>
                  <p className="mt-1 text-xs text-ink-mid">
                    No replies yet. Be the first to chime in.
                  </p>

                  {isSignedIn ? (
                    <div className="mt-3 flex flex-col gap-2">
                      <textarea
                        value={replyDrafts[post.id] ?? ''}
                        onChange={e =>
                          setReplyDrafts(prev => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        rows={2}
                        placeholder="Reply to this post…"
                        className="w-full resize-none rounded-md border border-hairline bg-white px-2 py-1.5 text-sm outline-none focus:border-teal"
                      />
                      <button
                        type="button"
                        disabled={!replyDrafts[post.id]?.trim()}
                        onClick={() => {
                          alert('Reply queued for moderation. ✝️');
                          setReplyDrafts(prev => ({ ...prev, [post.id]: '' }));
                        }}
                        className="self-end rounded-md bg-teal px-3 py-1.5 text-xs font-bold text-white shadow disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        Reply
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSignInRequired?.()}
                      className="mt-3 rounded-md bg-white px-3 py-1.5 text-xs font-bold text-teal underline-offset-2 hover:underline"
                    >
                      Sign in to reply →
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
