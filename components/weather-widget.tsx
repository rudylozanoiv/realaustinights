import clsx from 'clsx';

interface WeatherWidgetProps {
  /** Fahrenheit. Defaults to a pleasant Austin afternoon. */
  temp?: number;
  /** Free-text forecast like "clear", "rain", "thunderstorm". */
  condition?: string;
  className?: string;
}

/** Deterministic personality: matches the V7 weather widget copy/moods. */
function personality(temp: number, condition: string) {
  const c = condition.toLowerCase();
  const rainy = c.includes('rain') || c.includes('storm');
  const cold = temp < 50;
  const cool = temp >= 50 && temp < 65;
  const hot = temp > 95;
  const perfect = temp >= 72 && temp <= 85 && !rainy;

  const name = rainy && cold
    ? '❄️ SNUGGLE DAY'
    : rainy
      ? '🐾 MUDDY PAWS'
      : cold
        ? '🧣 BUNDLE UP'
        : cool
          ? '🧥 SWEATER WEATHER'
          : hot
            ? '☀️ MELT MODE'
            : perfect
              ? '🌳 PATIO WEATHER'
              : '🌳 PARK DAY';

  const tip = rainy && cold
    ? 'Stay in, cuddle Zeta, order delivery'
    : rainy
      ? 'Covered patios only! Bring a towel for the pup'
      : cold
        ? 'Layer up! Hot toddy weather at the bars'
        : cool
          ? 'Grab a hoodie! Perfect walking weather'
          : hot
            ? 'Stay hydrated! Pool day or AC bars only'
            : perfect
              ? 'Perfect patio weather! No mud for Zeta tonight'
              : 'Get outside! Zeta says park time';

  const bgClass = rainy
    ? 'from-slate-200 to-slate-300'
    : cold
      ? 'from-indigo-100 to-indigo-200'
      : hot
        ? 'from-amber-100 to-amber-200'
        : 'from-teal-light to-teal-light/50';

  return { name, tip, bgClass };
}

export function WeatherWidget({ temp = 82, condition = 'clear', className }: WeatherWidgetProps) {
  const { name, tip, bgClass } = personality(temp, condition);

  return (
    <section
      aria-label="Austin weather forecast"
      className={clsx(
        'rounded-2xl bg-gradient-to-br p-4',
        bgClass,
        className,
      )}
    >
      <div className="font-display text-xs font-bold text-teal">{name} FORECAST</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-4xl font-extrabold text-ink">
          {temp}
          <span aria-hidden>°</span>
          <span className="sr-only"> degrees Fahrenheit</span>
        </span>
        <span className="text-sm text-ink-mid">{condition}</span>
      </div>
      <p className="mt-2 text-xs text-ink-mid">{tip}</p>
    </section>
  );
}
