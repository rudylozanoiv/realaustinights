'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export interface BusinessPartnerSubmission {
  businessName: string;
  address: string;
  category: string;
  ownerContact: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  photoDataUrl: string | null;
  offering: string;
}

interface BusinessPartnerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: BusinessPartnerSubmission) => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const CATEGORIES = [
  'Bar',
  'Restaurant',
  'Live Music Venue',
  'Comedy Club',
  'Event Space',
  'Outdoors / Park',
  'Church',
  'Grocery',
  'Gym / Fitness',
  'Services',
  'Auto',
  'Pets',
  'Beauty',
  'Other',
];

export function BusinessPartnerModal({ open, onClose, onSubmit }: BusinessPartnerModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [ownerContact, setOwnerContact] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [offering, setOffering] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
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
  }, [open, onClose]);

  if (!open) return null;

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  const canSubmit = businessName && address && ownerContact && offering;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      businessName: businessName.trim(),
      address: address.trim(),
      category,
      ownerContact: ownerContact.trim(),
      instagram: instagram.trim(),
      twitter: twitter.trim(),
      tiktok: tiktok.trim(),
      photoDataUrl: photo,
      offering: offering.trim(),
    });
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bp-title"
        onClick={e => e.stopPropagation()}
        className={clsx(
          'relative max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-cream shadow-2xl',
          'md:rounded-3xl',
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-cream px-5 py-3">
          <h2 id="bp-title" className="font-display text-lg font-extrabold text-ink">
            Become a Business Partner
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink-mid"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div aria-hidden className="text-4xl">✝️</div>
            <p className="mt-2 font-display text-base font-bold text-teal">
              Thanks! Your submission is in our moderation queue.
            </p>
            <p className="mt-1 text-sm text-ink-mid">
              We&apos;ll reach out to {ownerContact}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-xl bg-teal px-5 py-2.5 font-display text-sm font-bold text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-3 p-5">
            <label className="block text-xs">
              <span className="font-bold text-ink">Business name *</span>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </label>
            <label className="block text-xs">
              <span className="font-bold text-ink">Address *</span>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                placeholder="Street, city"
                className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </label>
            <label className="block text-xs">
              <span className="font-bold text-ink">Category</span>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs">
              <span className="font-bold text-ink">Owner contact (phone or email) *</span>
              <input
                type="text"
                value={ownerContact}
                onChange={e => setOwnerContact(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </label>

            <fieldset className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <legend className="mb-1 text-xs font-bold text-ink">Social handles</legend>
              <label className="text-xs">
                <span className="text-ink-mid">Instagram</span>
                <input
                  type="text"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="@handle"
                  className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </label>
              <label className="text-xs">
                <span className="text-ink-mid">X / Twitter</span>
                <input
                  type="text"
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="@handle"
                  className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </label>
              <label className="text-xs">
                <span className="text-ink-mid">TikTok</span>
                <input
                  type="text"
                  value={tiktok}
                  onChange={e => setTiktok(e.target.value)}
                  placeholder="@handle"
                  className="mt-1 w-full rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </label>
            </fieldset>

            <label className="block text-xs">
              <span className="font-bold text-ink">Storefront photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                className="mt-1 block w-full text-xs"
              />
              {photo && (
                <img
                  src={photo}
                  alt="Uploaded preview"
                  className="mt-2 max-h-40 rounded-md object-cover"
                />
              )}
            </label>

            <label className="block text-xs">
              <span className="font-bold text-ink">Proposed offering *</span>
              <textarea
                rows={3}
                value={offering}
                onChange={e => setOffering(e.target.value)}
                required
                placeholder="e.g. 20% off first order with code AUSTIN"
                className="mt-1 w-full resize-none rounded-xl border-[1.5px] border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-1 w-full rounded-xl bg-navy px-4 py-3 font-display text-sm font-bold text-white shadow disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
            >
              Submit for review
            </button>
            <p className="text-center text-[11px] text-ink-light">
              Submissions go to our moderation queue — we verify before listing.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
