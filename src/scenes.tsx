import { useMemo, type CSSProperties } from "react";

/* Animierte Hintergrundszenen – alles eigene Grafik, nur CSS/SVG. */

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const full: CSSProperties = { position: "absolute", inset: 0 };

/* ---------- Regengarten ---------- */
function Sprout({ x, scale, delay, hue }: { x: number; scale: number; delay: number; hue: number }) {
  const leaf = `hsl(${hue} 55% 42%)`;
  const leaf2 = `hsl(${hue} 60% 55%)`;
  return (
    <g transform={`translate(${x} 0) scale(${scale})`}>
      <g style={{ transformOrigin: "0px 0px", animation: `sway ${4 + delay}s ease-in-out ${delay}s infinite` }}>
        <path d="M0 0 C -2 -20 2 -36 0 -52" stroke={leaf} strokeWidth="3" fill="none" />
        <path d="M0 -40 C -26 -54 -34 -30 -10 -30 C -4 -30 -2 -36 0 -40 Z" fill={leaf2} />
        <path d="M0 -44 C 24 -60 36 -36 12 -34 C 6 -34 2 -40 0 -44 Z" fill={leaf} />
        <path d="M0 -52 C -12 -70 -22 -54 -8 -50 Z" fill={leaf2} />
        <path d="M0 -52 C 12 -72 24 -56 8 -50 Z" fill={leaf} />
      </g>
    </g>
  );
}

export function RainGarden() {
  const drops = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 70 }, () => ({ left: r() * 100, delay: r() * 3, dur: 0.9 + r() * 0.8, h: 40 + r() * 60, o: 0.15 + r() * 0.3 }));
  }, []);
  const sprouts = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 26 }, (_, i) => ({ x: i * 80 + r() * 40, scale: 0.7 + r() * 0.8, delay: r() * 2, hue: 120 + r() * 30 }));
  }, []);
  return (
    <div className="scene">
      <div style={{ ...full, background: "linear-gradient(180deg,#3d5f52 0%,#2a4a3f 45%,#1c362e 75%,#14261f 100%)" }} />
      <div style={{ ...full, background: "radial-gradient(900px 400px at 15% 5%, rgba(255,255,255,.12), transparent 60%)" }} />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute", top: 20 + i * 50, left: 0, width: 420, height: 120, borderRadius: 120,
            background: "rgba(255,255,255,.06)", filter: "blur(18px)",
            animation: `cloud ${80 + i * 30}s linear ${-i * 25}s infinite`,
          }}
        />
      ))}
      {drops.map((d, i) => (
        <i
          key={i}
          style={{
            position: "absolute", top: 0, left: `${d.left}%`, width: 1.5, height: d.h,
            background: `linear-gradient(180deg, transparent, rgba(220,240,255,${d.o}))`,
            animation: `rain ${d.dur}s linear ${d.delay}s infinite`, transform: "rotate(8deg)",
          }}
        />
      ))}
      <svg viewBox="0 0 2000 220" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: 220 }}>
        <defs>
          <linearGradient id="soil" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2b2a26" />
            <stop offset="1" stopColor="#141412" />
          </linearGradient>
        </defs>
        <g transform="translate(0 150)">
          {sprouts.map((s, i) => (
            <Sprout key={i} {...s} />
          ))}
        </g>
        <path d="M0 150 C 300 140 600 158 1000 148 C 1400 138 1700 156 2000 146 V220 H0 Z" fill="url(#soil)" />
        {Array.from({ length: 40 }).map((_, i) => (
          <ellipse key={i} cx={(i * 53) % 2000} cy={170 + (i % 4) * 9} rx={8 + (i % 5) * 4} ry={5 + (i % 3) * 2} fill={i % 3 ? "#3a3935" : "#4a4843"} />
        ))}
      </svg>
    </div>
  );
}

/* ---------- Herbstwald ---------- */
const LEAF = "M0 -10 C 6 -6 10 -2 10 4 C 6 3 3 6 0 10 C -3 6 -6 3 -10 4 C -10 -2 -6 -6 0 -10 Z";

export function Autumn() {
  const leaves = useMemo(() => {
    const r = rng(23);
    const cols = ["#f97316", "#ea580c", "#facc15", "#dc2626", "#fb923c"];
    return Array.from({ length: 22 }, () => ({ left: r() * 100, delay: r() * 14, dur: 10 + r() * 10, size: 14 + r() * 14, c: cols[Math.floor(r() * cols.length)] }));
  }, []);
  const bokeh = useMemo(() => {
    const r = rng(5);
    return Array.from({ length: 16 }, () => ({ x: r() * 100, y: 15 + r() * 60, s: 80 + r() * 200, c: r() > 0.5 ? "rgba(249,115,22,.35)" : "rgba(220,38,38,.3)" }));
  }, []);
  return (
    <div className="scene">
      <div style={{ ...full, background: "linear-gradient(180deg,#3a3566 0%,#5b4277 30%,#8c4f6e 60%,#b35f4c 85%,#3b1f1c 100%)" }} />
      {bokeh.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s, borderRadius: "50%", background: b.c, filter: "blur(30px)" }} />
      ))}
      <svg viewBox="0 0 2000 600" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: "70%" }}>
        {[120, 420, 760, 1180, 1520, 1860].map((x, i) => (
          <g key={i} opacity={0.55 + (i % 2) * 0.2}>
            <rect x={x - 8} y={240} width={16} height={360} fill="#2a1a24" />
            <path d={`M${x} 120 L${x - 90} 330 L${x + 90} 330 Z`} fill="#2f1d2b" />
            <path d={`M${x} 60 L${x - 70} 230 L${x + 70} 230 Z`} fill="#331f2f" />
          </g>
        ))}
        <path d="M0 560 C 300 540 700 575 1000 555 C 1300 540 1700 572 2000 550 V600 H0 Z" fill="#3a1c14" />
        {Array.from({ length: 70 }).map((_, i) => (
          <path key={i} d={LEAF} transform={`translate(${(i * 29) % 2000} ${565 + (i % 5) * 7}) rotate(${(i * 47) % 360}) scale(1.2)`} fill={["#f97316", "#facc15", "#dc2626", "#ea580c"][i % 4]} />
        ))}
      </svg>
      {leaves.map((l, i) => (
        <svg
          key={i}
          width={l.size}
          height={l.size}
          viewBox="-12 -12 24 24"
          style={{ position: "absolute", top: 0, left: `${l.left}%`, animation: `fall ${l.dur}s linear ${-l.delay}s infinite` }}
        >
          <path d={LEAF} fill={l.c} />
          <path d="M0 -9 L0 9" stroke="rgba(0,0,0,.25)" strokeWidth="1" />
        </svg>
      ))}
    </div>
  );
}

/* ---------- Lagerfeuer bei Nacht ---------- */
function Fire({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 520)`}>
      <ellipse cx="0" cy="10" rx="70" ry="12" fill="rgba(251,146,60,.25)" />
      <rect x="-34" y="4" width="68" height="8" rx="4" fill="#5b3a1f" transform="rotate(12)" />
      <rect x="-34" y="4" width="68" height="8" rx="4" fill="#4a2e18" transform="rotate(-12)" />
      <g style={{ transformOrigin: "0px 6px", animation: "flame 0.9s ease-in-out infinite" }}>
        <path d="M0 -60 C 20 -30 26 -10 0 6 C -26 -10 -20 -30 0 -60 Z" fill="#f97316" />
        <path d="M0 -40 C 12 -20 14 -6 0 6 C -14 -6 -12 -20 0 -40 Z" fill="#fde047" />
      </g>
      {[-10, 4, 14].map((dx, i) => (
        <circle key={i} cx={dx} cy={-70 - i * 10} r="2" fill="#fbbf24">
          <animate attributeName="cy" values={`${-60 - i * 8};${-140 - i * 10}`} dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
}

export function Campfire() {
  const stars = useMemo(() => {
    const r = rng(31);
    return Array.from({ length: 90 }, () => ({ x: r() * 100, y: r() * 60, s: 1 + r() * 2, d: r() * 4 }));
  }, []);
  const flies = useMemo(() => {
    const r = rng(41);
    return Array.from({ length: 22 }, () => ({ x: r() * 100, y: 30 + r() * 60, d: r() * 6, dur: 5 + r() * 6, c: r() > 0.5 ? "#bef264" : "#93c5fd", s: 6 + r() * 10 }));
  }, []);
  return (
    <div className="scene">
      <div style={{ ...full, background: "linear-gradient(180deg,#0b1030 0%,#18205a 45%,#1d2a4f 75%,#0a0f1c 100%)" }} />
      {stars.map((s, i) => (
        <i key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, borderRadius: "50%", background: "#fff", animation: `twinkle ${3 + s.d}s ease-in-out ${s.d}s infinite` }} />
      ))}
      {flies.map((f, i) => (
        <i
          key={i}
          style={{
            position: "absolute", left: `${f.x}%`, top: `${f.y}%`, width: f.s, height: f.s, borderRadius: "50%",
            background: f.c, boxShadow: `0 0 18px 6px ${f.c}`, filter: "blur(1px)",
            animation: `float ${f.dur}s ease-in-out ${-f.d}s infinite`,
          }}
        />
      ))}
      <svg viewBox="0 0 2000 600" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: "55%" }}>
        <path d="M0 420 C 300 360 500 400 800 370 C 1100 340 1400 400 1700 360 C 1850 345 1950 370 2000 360 V600 H0 Z" fill="#0e1530" />
        {[60, 240, 1620, 1820, 1960].map((x, i) => (
          <path key={i} d={`M${x} 280 L${x - 50} 470 L${x + 50} 470 Z`} fill="#0b1126" />
        ))}
        {[420, 1360].map((x, i) => (
          <g key={i}>
            <path d={`M${x} 440 L${x - 70} 530 L${x + 70} 530 Z`} fill="#1e293b" />
            <path d={`M${x} 440 L${x - 14} 530 L${x + 14} 530 Z`} fill="#f59e0b" opacity=".55" />
          </g>
        ))}
        <path d="M0 520 C 400 505 800 530 1200 512 C 1500 500 1800 525 2000 515 V600 H0 Z" fill="#070b16" />
        <Fire x={760} />
        <Fire x={1640} />
        {Array.from({ length: 120 }).map((_, i) => (
          <line key={i} x1={i * 17} y1={600} x2={i * 17 + ((i % 3) - 1) * 4} y2={575 - (i % 4) * 6} stroke="#0f172a" strokeWidth="3" />
        ))}
      </svg>
    </div>
  );
}

/* ---------- Weltraum (Netzkarte) ---------- */
export function Space() {
  const stars = useMemo(() => {
    const r = rng(53);
    return Array.from({ length: 140 }, () => ({ x: r() * 100, y: r() * 100, s: 0.8 + r() * 1.8, d: r() * 5 }));
  }, []);
  return (
    <div className="scene">
      <div style={{ ...full, background: "radial-gradient(1200px 800px at 30% 20%, #12352d 0%, #0b1a1a 45%, #0a0f1c 100%)" }} />
      <div style={{ ...full, background: "radial-gradient(700px 500px at 85% 80%, rgba(99,102,241,.18), transparent 60%)" }} />
      {stars.map((s, i) => (
        <i key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, borderRadius: "50%", background: "#fff", opacity: 0.6, animation: `twinkle ${3 + s.d}s ease-in-out ${s.d}s infinite` }} />
      ))}
    </div>
  );
}

/* ---------- Weser bei Nacht (Lage) ---------- */
export function River() {
  const stars = useMemo(() => {
    const r = rng(61);
    return Array.from({ length: 60 }, () => ({ x: r() * 100, y: r() * 45, s: 1 + r() * 1.5, d: r() * 5 }));
  }, []);
  const wave = (y: number, amp: number) => {
    let d = `M0 ${y}`;
    for (let x = 0; x <= 4000; x += 200) d += ` Q ${x + 100} ${y - amp} ${x + 200} ${y}`;
    return d + ` V400 H0 Z`;
  };
  return (
    <div className="scene">
      <div style={{ ...full, background: "linear-gradient(180deg,#0d1b2e 0%,#163352 45%,#1b4a6b 70%,#0b2236 100%)" }} />
      {stars.map((s, i) => (
        <i key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, borderRadius: "50%", background: "#fff", animation: `twinkle ${3 + s.d}s ease-in-out ${s.d}s infinite` }} />
      ))}
      <div style={{ position: "absolute", right: "30%", top: "62%", width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff, #cbd5e1)", boxShadow: "0 0 60px 20px rgba(226,232,240,.25)" }} />
      <svg viewBox="0 0 2000 400" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: 0, width: "200%", height: 260, animation: "wave 30s linear infinite" }}>
        <path d={wave(120, 18)} fill="rgba(56,189,248,.18)" />
      </svg>
      <svg viewBox="0 0 2000 400" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: 0, width: "200%", height: 200, animation: "wave 18s linear infinite reverse" }}>
        <path d={wave(150, 22)} fill="rgba(14,116,144,.35)" />
      </svg>
      <svg viewBox="0 0 2000 400" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: 0, width: "200%", height: 140, animation: "wave 12s linear infinite" }}>
        <path d={wave(180, 16)} fill="#0b2236" />
      </svg>
    </div>
  );
}

/* ---------- Abenddämmerung mit Haus (Seite Haus) ---------- */
export function Dusk({ litRatio = 0.5 }: { litRatio?: number }) {
  const stars = useMemo(() => {
    const r = rng(71);
    return Array.from({ length: 50 }, () => ({ x: r() * 100, y: r() * 35, s: 1 + r() * 1.4, d: r() * 5 }));
  }, []);
  const windows = [
    [880, 430], [940, 430], [1060, 430], [1120, 430], [880, 500], [940, 500], [1060, 500], [1120, 500], [1000, 360],
  ];
  const lit = Math.round(windows.length * litRatio);
  return (
    <div className="scene">
      <div style={{ ...full, background: "linear-gradient(180deg,#141a3a 0%,#3b2c63 35%,#a24f6b 62%,#f19a5b 78%,#2a1b2e 100%)" }} />
      {stars.map((s, i) => (
        <i key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, borderRadius: "50%", background: "#fff", animation: `twinkle ${3 + s.d}s ease-in-out ${s.d}s infinite` }} />
      ))}
      <div style={{ position: "absolute", left: "12%", top: "14%", width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff7ed, #fde68a)", boxShadow: "0 0 50px 14px rgba(253,230,138,.35)" }} />
      <svg viewBox="0 0 2000 700" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: "70%" }}>
        <path d="M0 520 C 300 470 600 500 900 470 C 1200 440 1500 500 2000 460 V700 H0 Z" fill="#2b1b33" />
        <path d="M0 590 C 400 560 800 600 1200 575 C 1500 560 1800 590 2000 580 V700 H0 Z" fill="#1a1022" />
        {[200, 330, 1500, 1640, 1800].map((x, i) => (
          <g key={i}>
            <rect x={x - 6} y={480} width={12} height={110} fill="#140c19" />
            <circle cx={x} cy={470} r={48 + (i % 2) * 14} fill="#1a1022" />
          </g>
        ))}
        <g>
          <rect x="840" y="390" width="320" height="200" fill="#1c1426" />
          <path d="M820 400 L1000 290 L1180 400 Z" fill="#241a31" />
          <rect x="1090" y="300" width="28" height="60" fill="#1c1426" />
          {windows.map(([x, y], i) => (
            <rect key={i} x={x - 18} y={y - 22} width={36} height={40} rx={3} fill={i < lit ? "#fcd34d" : "#2e2340"} opacity={i < lit ? 0.9 : 1}>
              {i < lit && <animate attributeName="opacity" values=".85;1;.85" dur={`${4 + i}s`} repeatCount="indefinite" />}
            </rect>
          ))}
          <rect x="985" y="520" width="30" height="70" fill={lit > 0 ? "#f59e0b" : "#2e2340"} opacity=".8" />
        </g>
      </svg>
    </div>
  );
}

/* ---------- Nordlicht ---------- */
export function Aurora() {
  const stars = useMemo(() => {
    const r = rng(83);
    return Array.from({ length: 110 }, () => ({ x: r() * 100, y: r() * 70, s: 0.8 + r() * 1.6, d: r() * 5 }));
  }, []);
  const band = (top: string, c1: string, c2: string, dur: number, delay: number): CSSProperties => ({
    position: "absolute", left: "-20%", right: "-20%", top, height: "38%",
    background: `linear-gradient(90deg, transparent, ${c1} 25%, ${c2} 55%, transparent 85%)`,
    filter: "blur(40px)", opacity: 0.55, borderRadius: "50%",
    transformOrigin: "50% 50%", animation: `aurora ${dur}s ease-in-out ${delay}s infinite alternate`,
  });
  return (
    <div className="scene">
      <div style={{ ...full, background: "linear-gradient(180deg,#020617 0%,#071a2b 45%,#0b2a2a 75%,#04110f 100%)" }} />
      {stars.map((s, i) => (
        <i key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, borderRadius: "50%", background: "#fff", animation: `twinkle ${3 + s.d}s ease-in-out ${s.d}s infinite` }} />
      ))}
      <div style={band("6%", "rgba(52,211,153,.9)", "rgba(45,212,191,.7)", 14, 0)} />
      <div style={band("18%", "rgba(167,139,250,.7)", "rgba(52,211,153,.6)", 18, -6)} />
      <div style={band("28%", "rgba(34,211,238,.5)", "rgba(244,114,182,.45)", 22, -11)} />
      <svg viewBox="0 0 2000 500" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: "45%" }}>
        <path d="M0 360 L180 220 L330 320 L520 160 L700 300 L860 210 L1040 330 L1220 180 L1420 310 L1600 200 L1800 300 L2000 230 V500 H0 Z" fill="#0a1d22" />
        <path d="M520 160 L560 200 L540 196 L580 230 L470 230 L500 200 Z M1220 180 L1260 220 L1240 216 L1280 246 L1170 246 L1200 216 Z" fill="#cbd5e1" opacity=".35" />
        <path d="M0 420 C 300 380 600 430 1000 400 C 1400 370 1700 420 2000 395 V500 H0 Z" fill="#061214" />
        {Array.from({ length: 34 }).map((_, i) => {
          const x = i * 60 + ((i * 37) % 30);
          const hgt = 50 + ((i * 53) % 50);
          return <path key={i} d={`M${x} ${470 - hgt} L${x - 16} 470 L${x + 16} 470 Z`} fill="#03100f" />;
        })}
        <rect x="0" y="468" width="2000" height="32" fill="#03100f" />
      </svg>
    </div>
  );
}
