'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  /** Shown in the fallback UI so users know which area failed. */
  label: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time errors in a single section so a crash doesn't blank
 * the whole page. Use one per major section in page.tsx.
 */
export class SectionBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Intentionally light — we don't have a telemetry sink yet.
    if (typeof console !== 'undefined') {
      console.error(`[SectionBoundary: ${this.props.label}]`, error, info);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <section
          role="alert"
          aria-label={`${this.props.label} — failed to load`}
          className="rounded-2xl border border-red/30 bg-red/5 p-4 text-sm text-red md:p-5"
        >
          <p className="font-display font-bold">
            {this.props.label} couldn&apos;t load.
          </p>
          <p className="mt-1 text-ink-mid">
            The rest of the page is still fine. Try again in a bit.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-3 rounded-md bg-white px-3 py-1.5 text-xs font-bold text-ink shadow"
          >
            Retry
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}
