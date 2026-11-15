/* Eigene Vektorgrafiken für die Gerätekarten. */

let uid = 0;
const nid = (p: string) => `${p}${++uid}`;

/** Hängeleuchte; bei "an" mit Lichtkegel in der aktuellen Farbe. */
export function PendantLamp({ color, on, shade = "#2f6f5a", width = 120 }: { color: string; on: boolean; shade?: string; width?: number }) {
  const g = nid("pl");
  return (
    <svg width={width} height={width * 1.25} viewBox="0 0 120 150" className="illus">
      <defs>
        <linearGradient id={`${g}s`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={shade} stopOpacity="1" />
          <stop offset="1" stopColor={shade} stopOpacity=".75" />
        </linearGradient>
        <radialGradient id={`${g}l`} cx=".5" cy="0" r="1">
          <stop offset="0" stopColor={color} stopOpacity=".75" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${g}h`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="60" y1="0" x2="60" y2="52" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" />
      {on && <path d="M30 86 L-10 150 L130 150 L90 86 Z" fill={`url(#${g}l)`} />}
      <rect x="55" y="50" width="10" height="8" rx="2" fill="#1f2937" />
      <path d="M60 56 C 38 58 26 72 24 88 L96 88 C94 72 82 58 60 56 Z" fill={`url(#${g}s)`} />
      <path d="M60 56 C 44 58 34 70 32 84 L44 84 C46 70 52 62 60 58 Z" fill={`url(#${g}h)`} />
      <ellipse cx="60" cy="88" rx="36" ry="5" fill={on ? color : "#1c2523"} />
      {on && <ellipse cx="60" cy="90" rx="18" ry="4" fill="#fff" opacity=".9" />}
    </svg>
  );
}

/** Zwei Hängeleuchten nebeneinander. */
export function TwinPendant({ color, on }: { color: string; on: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 0, marginRight: -10 }}>
      <PendantLamp color={color} on={on} shade="#b4232c" width={86} />
      <PendantLamp color={color} on={on} shade="#b4232c" width={86} />
    </div>
  );
}

/** Wandleuchten an einer Treppe. */
export function StairLight({ color, on }: { color: string; on: boolean }) {
  const g = nid("st");
  return (
    <svg width="150" height="100" viewBox="0 0 150 100" className="illus">
      <defs>
        <radialGradient id={g} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor={color} stopOpacity=".8" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M0 95 H30 V78 H60 V61 H90 V44 H120 V27 H150 V100 H0 Z" fill="#c9b79a" opacity=".85" />
      <path d="M0 95 H30 V78 H60 V61 H90 V44 H120 V27 H150" fill="none" stroke="#8b7355" strokeWidth="2" />
      {[30, 90].map((x, i) => (
        <g key={i}>
          {on && <circle cx={x + 10} cy={52 - i * 34 + 20} r="22" fill={`url(#${g})`} />}
          <rect x={x + 4} y={46 - i * 34 + 20} width="12" height="8" rx="3" fill={on ? "#fff" : "#4b5563"} />
        </g>
      ))}
    </svg>
  );
}

/** Saugroboter in Absaugstation. */
export function VacuumDock({ active }: { active: boolean }) {
  const g = nid("vd");
  return (
    <svg width="150" height="140" viewBox="0 0 150 140" className="illus">
      <defs>
        <linearGradient id={`${g}a`} x1="0" x2="1">
          <stop offset="0" stopColor="#1f2326" />
          <stop offset=".5" stopColor="#3a3f44" />
          <stop offset="1" stopColor="#15181a" />
        </linearGradient>
        <linearGradient id={`${g}b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4b5056" />
          <stop offset="1" stopColor="#1b1e21" />
        </linearGradient>
      </defs>
      <rect x="62" y="8" width="64" height="104" rx="12" fill={`url(#${g}a)`} />
      <rect x="70" y="18" width="48" height="14" rx="5" fill="#0b0d0e" />
      <circle cx="94" cy="25" r="3" fill={active ? "#4ade80" : "#60a5fa"} />
      <rect x="66" y="58" width="56" height="5" rx="2" fill="#8a7a5c" opacity=".8" />
      <path d="M50 112 H140 L146 124 H44 Z" fill="#111416" />
      <ellipse cx={active ? 40 : 82} cy="118" rx="38" ry="12" fill={`url(#${g}b)`}>
        {active && <animate attributeName="cx" values="30;60;30" dur="6s" repeatCount="indefinite" />}
      </ellipse>
      <ellipse cx={active ? 40 : 82} cy="113" rx="12" ry="4" fill="#2b3035">
        {active && <animate attributeName="cx" values="30;60;30" dur="6s" repeatCount="indefinite" />}
      </ellipse>
    </svg>
  );
}

/** Flachbildfernseher. */
export function TvSet({ on, color = "#22d3ee", width = 150 }: { on: boolean; color?: string; width?: number }) {
  const g = nid("tv");
  return (
    <svg width={width} height={width * 0.72} viewBox="0 0 150 108" className="illus">
      <defs>
        <linearGradient id={g} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={on ? color : "#0f1514"} />
          <stop offset="1" stopColor={on ? "#7c3aed" : "#060908"} />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="142" height="84" rx="6" fill="#0b0f0e" />
      <rect x="9" y="9" width="132" height="74" rx="3" fill={`url(#${g})`} opacity={on ? 0.9 : 1} />
      {!on && <path d="M18 14 L60 14 L30 78 L14 78 Z" fill="#fff" opacity=".06" />}
      <rect x="66" y="88" width="18" height="10" fill="#1f2937" />
      <rect x="40" y="98" width="70" height="5" rx="2" fill="#111827" />
    </svg>
  );
}

/** Steckdosenleiste. */
export function PlugStrip({ count, onCount }: { count: number; onCount: number }) {
  const n = Math.max(3, Math.min(count, 6));
  return (
    <svg width="170" height="70" viewBox="0 0 170 70" className="illus">
      <rect x="6" y="18" width="158" height="38" rx="12" fill="#e8ece9" />
      <rect x="6" y="44" width="158" height="12" rx="6" fill="#c9cfcb" />
      {Array.from({ length: n }).map((_, i) => {
        const x = 20 + i * ((140 - 20) / (n - 1));
        const lit = i < onCount;
        return (
          <g key={i}>
            <circle cx={x} cy="34" r="9" fill="#cfd5d1" />
            <circle cx={x - 3} cy="34" r="1.6" fill="#555" />
            <circle cx={x + 3} cy="34" r="1.6" fill="#555" />
            <circle cx={x} cy="49" r="2" fill={lit ? "#4ade80" : "#94a3b8"} />
          </g>
        );
      })}
      <path d="M164 37 C 180 37 168 66 150 66" fill="none" stroke="#c9cfcb" strokeWidth="4" />
    </svg>
  );
}

/** Kamera auf Wandhalter. */
export function CamIllus({ live }: { live: boolean }) {
  return (
    <svg width="110" height="80" viewBox="0 0 110 80" className="illus">
      <rect x="10" y="20" width="70" height="36" rx="16" fill="#f1f5f4" />
      <circle cx="30" cy="38" r="11" fill="#111" />
      <circle cx="30" cy="38" r="5" fill="#1e3a8a" />
      <circle cx="68" cy="30" r="3" fill={live ? "#ef4444" : "#64748b"} />
      <path d="M80 38 H96 V70" stroke="#cbd5e1" strokeWidth="6" fill="none" />
      <rect x="88" y="66" width="18" height="8" rx="2" fill="#94a3b8" />
    </svg>
  );
}

/** Wetter-Symbol aus Wolken und Sonne. */
export function WeatherGlyph({ condition, size = 110 }: { condition: string; size?: number }) {
  const sun = ["sunny", "clear-night", "partlycloudy"].includes(condition);
  const night = condition === "clear-night";
  const rain = ["rainy", "pouring", "lightning-rainy"].includes(condition);
  const snow = ["snowy", "snowy-rainy"].includes(condition);
  const cloud = !["sunny", "clear-night"].includes(condition);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 120 90">
      {sun && !night && <circle cx="40" cy="34" r="20" fill="#fcd34d" />}
      {night && <path d="M48 14 A22 22 0 1 0 66 48 A18 18 0 1 1 48 14 Z" fill="#e2e8f0" />}
      {cloud && (
        <g>
          <ellipse cx="50" cy="58" rx="34" ry="18" fill="#cbd5e1" />
          <circle cx="44" cy="46" r="18" fill="#e2e8f0" />
          <circle cx="66" cy="44" r="22" fill="#f8fafc" />
          <ellipse cx="62" cy="60" rx="38" ry="16" fill="#f1f5f9" />
        </g>
      )}
      {rain &&
        [40, 56, 72, 88].map((x, i) => (
          <line key={i} x1={x} y1="76" x2={x - 5} y2="88" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" />
        ))}
      {snow && [42, 60, 78].map((x, i) => <circle key={i} cx={x} cy="82" r="3" fill="#fff" />)}
    </svg>
  );
}
