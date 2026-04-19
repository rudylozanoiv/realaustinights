'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export interface PhotoItem {
  id: string;
  photoUrl: string;
  caption: string;
  username?: string;
  venueName?: string;
  neighborhood?: string;
  googleMapsUrl?: string;
  appleMapsUrl?: string;
}

interface QuePasaModalProps {
  photos: PhotoItem[];
  startIndex: number;
  onClose: () => void;
  onCommentRequireLogin?: () => void;
}

const SWIPE_THRESHOLD = 40;
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function QuePasaModal({
  photos,
  startIndex,
  onClose,
  onCommentRequireLogin,
}: QuePasaModalProps) {
  const [idx, setIdx] = useState(startIndex);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIdx(startIndex);
  }, [startIndex]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') {
        setIdx(i => Math.min(i + 1, photos.length - 1));
        return;
      }
      if (e.key === 'ArrowLeft') {
        setIdx(i => Math.max(i - 1, 0));
        return;
      }
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    const raf = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    return () => {
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose, photos.length]);

  const photo = photos[idx];
  if (!photo) return null;
  const isLiked = liked.has(photo.id);

  const toggleLike = () => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(photo.id)) next.delete(photo.id);
      else next.add(photo.id);
      return next;
    });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (
      Math.abs(dy) > SWIPE_THRESHOLD &&
      dy > 0 &&
      Math.abs(dy) > Math.abs(dx)
    ) {
      onClose();
      return;
    }
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) setIdx(i => Math.min(i + 1, photos.length - 1));
      else setIdx(i => Math.max(i - 1, 0));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-black/95"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={photo.caption}
        tabIndex={-1}
        className="relative flex h-full flex-col outline-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
        >
          ✕
        </button>

        {idx > 0 && (
          <button
            type="button"
            onClick={() => setIdx(i => Math.max(i - 1, 0))}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
          >
            ←
          </button>
        )}
        {idx < photos.length - 1 && (
          <button
            type="button"
            onClick={() => setIdx(i => Math.min(i + 1, photos.length - 1))}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
          >
            →
          </button>
        )}

        <div
          className="flex flex-1 items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative h-full w-full max-w-3xl">
            <Image
              key={photo.id}
              src={photo.photoUrl}
              alt={photo.caption}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="bg-black/85 px-4 pb-6 pt-3 text-white">
          <div className="text-sm font-semibold">{photo.caption}</div>
          {(photo.username || photo.venueName) && (
            <div className="mt-0.5 text-xs text-white/70">
              {photo.username && <span>{photo.username}</span>}
              {photo.username && photo.venueName && <span> · </span>}
              {photo.venueName && (
                <>
                  <span aria-hidden>📍</span> {photo.venueName}
                </>
              )}
              {photo.neighborhood && (
                <span className="text-white/50"> · {photo.neighborhood}</span>
              )}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {photo.googleMapsUrl && (
                <a
                  href={photo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/10 px-2.5 py-1.5 text-[11px] font-bold hover:bg-white/20"
                >
                  🗺️ Google Maps
                </a>
              )}
              {photo.appleMapsUrl && (
                <a
                  href={photo.appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/10 px-2.5 py-1.5 text-[11px] font-bold hover:bg-white/20"
                >
                  🍎 Apple Maps
                </a>
              )}
            </div>
            <div className="flex gap-2">
              {/* Sacred pink when liked — fills only on active state. */}
              <button
                type="button"
                onClick={toggleLike}
                aria-pressed={isLiked}
                aria-label={isLiked ? 'Unlike' : 'Like'}
                className={clsx(
                  'rounded-md px-3 py-1.5 text-sm font-bold shadow transition-colors',
                  isLiked
                    ? 'bg-pink text-white'
                    : 'bg-white/10 text-white hover:bg-white/20',
                )}
              >
                <span aria-hidden>{isLiked ? '❤️' : '🤍'}</span>
              </button>
              <button
                type="button"
                onClick={() => onCommentRequireLogin?.()}
                aria-label="Comment"
                className="rounded-md bg-white/10 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/20"
              >
                <span aria-hidden>💬</span>
              </button>
            </div>
          </div>
          <div className="mt-2 text-center text-[11px] text-white/60">
            {idx + 1} / {photos.length} · swipe for more, down to close
          </div>
        </div>
      </div>
    </div>
  );
}
