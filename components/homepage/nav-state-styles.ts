import clsx from 'clsx';

export function getDesktopNavLinkClasses(isActive: boolean) {
  return clsx(
    'group inline-flex flex-col items-center gap-1 pb-1 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70',
    isActive ? 'text-pink' : 'text-white/78 hover:text-white',
  );
}

export function getDesktopNavAccentClasses(isActive: boolean) {
  return clsx(
    'h-0.5 rounded-full transition-all duration-200',
    isActive
      ? 'w-full bg-pink shadow-[0_0_14px_rgba(255,105,180,0.45)]'
      : 'w-0 bg-white/30 group-hover:w-full group-hover:bg-white/45',
  );
}

export function getRoutePillNavLinkClasses(isActive: boolean) {
  return clsx(
    'rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70',
    isActive
      ? 'border-pink/45 bg-pink/10 text-pink shadow-[0_0_18px_rgba(255,105,180,0.12)]'
      : 'border-white/10 bg-white/6 text-white/72 hover:border-white/18 hover:bg-white/10 hover:text-white',
  );
}
