import { useMemo } from "react";
import { Icon } from "../ui";
import { dayDiff, fmtTime, isOn, relDay, useAll, type CalEvent } from "../ha";
import { useWaste } from "../common";
import { useConf } from "../config";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  value?: string;
  icon: string;
  color: string;
  size?: number;
  parent?: string;
}

const W = 1600;
const H = 900;
const ROOM_SLOTS = [
  [160, 405],
  [130, 540],
  [210, 710],
  [420, 760],
  [250, 220],
];
const HEALTH_SLOTS = [
  [80, 95],
  [255, 45],
  [430, 95],
  [70, 265],
  [440, 270],
  [255, 300],
];

/** Messwert lesbar: Stunden als „4 h 02 min“, Schritte, Meter ab 1000 als km. */
function fmtMeasure(state: string | undefined, unit: string | undefined): string {
  const n = Number(state);
  if (!Number.isFinite(n)) return state ?? "–";
  if (unit === "h") {
    const m = Math.round(n * 60);
    return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min`;
  }
  if (unit === "steps") return `${Math.round(n).toLocaleString("de-DE")} Schritte`;
  if (unit === "m" && n >= 1000) return `${(n / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} km`;
  return `${n.toLocaleString("de-DE", { maximumFractionDigits: 1 })}${unit ? ` ${unit}` : ""}`;
}

const VAC: Record<string, string> = { docked: "angedockt", cleaning: "saugt", returning: "fährt heim", paused: "pausiert", idle: "bereit", error: "Fehler" };

export function NetworkPage({ events }: { events: CalEvent[] }) {
  const conf = useConf();
  const all = useAll();
  const waste = useWaste();

  const nodes = useMemo<Node[]>(() => {
    const C = { me: "#38bdf8", rooms: "#fb923c", dev: "#facc15", lage: "#2dd4bf", waste: "#f472b6", home: "#4ade80" };
    const out: Node[] = [];
    const ids = Object.keys(all);
    const lights = ids.filter((k) => k.startsWith("light.") && k !== conf.all_lights && !Array.isArray(all[k].attributes.entity_id));
    const sw = ids.filter((k) => k.startsWith("switch.") && !k.includes("adaptive_lighting") && !(conf.house_switches ?? []).some((h) => h.entity === k));
    const todos = (conf.todos ?? []).reduce((s, t) => s + (Number(all[t.entity]?.state) || 0), 0);
    const next = events.find((e) => e.end.getTime() > Date.now());
    const persons = Object.values(all).filter((e) => e.entity_id.startsWith("person."));
    const phone = conf.phone_battery_match
      ? Object.values(all).find((e) => e.entity_id.includes(conf.phone_battery_match!) && e.attributes.device_class === "battery")
      : undefined;

    out.push({ id: "me", x: 820, y: 190, label: conf.person ?? "Ich", icon: "mdi:account-outline", color: C.me, size: 108 });
    if (phone) out.push({ id: "tel", parent: "me", x: 610, y: 95, label: "Telefon", value: `${phone.state} %`, icon: "mdi:cellphone", color: C.me });
    if ((conf.calendars ?? []).length)
      out.push({ id: "kal", parent: "me", x: conf.network_health ? 640 : 520, y: conf.network_health ? 300 : 250, label: "Kalender", value: next ? `${relDay(Math.max(0, dayDiff(next.start)))}: ${next.summary.slice(0, 22)}` : "frei", icon: "mdi:calendar-month-outline", color: C.me });
    if ((conf.todos ?? []).length) out.push({ id: "todo", parent: "me", x: 1030, y: 90, label: "Aufgaben", value: `${todos} offen`, icon: "mdi:checkbox-marked-outline", color: C.me });

    const health = conf.network_health;
    if (health && health.items.length) {
      const H = "#fb7185";
      out.push({ id: "health", x: 255, y: 170, label: health.label ?? "Gesundheit", icon: health.icon ?? "mdi:heart-pulse", color: H, size: 96 });
      health.items.slice(0, HEALTH_SLOTS.length).forEach((it, i) => {
        const a = all[it.entity];
        if (!a) return;
        const b = it.entity2 ? all[it.entity2] : undefined;
        const unit = a.attributes.unit_of_measurement as string | undefined;
        const value = b ? `${Math.round(Number(a.state))}/${Math.round(Number(b.state))}${unit ? ` ${unit}` : ""}` : fmtMeasure(a.state, unit);
        out.push({ id: `h${i}`, parent: "health", x: HEALTH_SLOTS[i][0], y: HEALTH_SLOTS[i][1], label: it.label, value, icon: it.icon ?? "mdi:heart-outline", color: H });
      });
    }

    const rooms = (conf.rooms ?? []).slice(0, ROOM_SLOTS.length);
    if (rooms.length) {
      out.push({ id: "rooms", x: 400, y: 500, label: "Räume", icon: "mdi:floor-plan", color: C.rooms, size: 108 });
      rooms.forEach((r, i) => {
        const l = r.lights ?? [];
        const on = l.filter((id) => isOn(all[id])).length;
        const s = r.switches ?? [];
        out.push({
          id: `r${i}`, parent: "rooms", x: ROOM_SLOTS[i][0], y: ROOM_SLOTS[i][1], label: r.title,
          value: l.length ? `${on}/${l.length} Licht` : s.length ? `${s.filter((id) => isOn(all[id])).length}/${s.length} Schalter` : undefined,
          icon: r.icon ?? "mdi:door", color: C.rooms,
        });
      });
    }

    if (waste.length) {
      out.push({ id: "waste", x: 760, y: 790, label: "Müll", icon: "mdi:trash-can-outline", color: C.waste, size: 96 });
      waste.slice(0, 2).forEach((m, i) => out.push({ id: `w${i}`, parent: "waste", x: 600 + i * 330, y: 870, label: m.name, value: relDay(m.days!), icon: m.icon, color: C.waste }));
    }

    out.push({ id: "dev", x: 1180, y: 700, label: "Geräte", icon: "mdi:lightbulb-group-outline", color: C.dev, size: 108 });
    out.push({ id: "li", parent: "dev", x: 1470, y: 600, label: "Lichter", value: `${lights.filter((k) => isOn(all[k])).length}/${lights.length} an`, icon: "mdi:lightbulb-outline", color: C.dev });
    out.push({ id: "st", parent: "dev", x: 1460, y: 800, label: "Schalter", value: `${sw.filter((k) => isOn(all[k])).length}/${sw.length} an`, icon: "mdi:power-socket-de", color: C.dev });
    if (conf.vacuum && all[conf.vacuum]) {
      const v = all[conf.vacuum];
      out.push({ id: "vac", parent: "dev", x: 1240, y: 870, label: conf.vacuum_name ?? "Saugroboter", value: VAC[v.state] ?? v.state, icon: "mdi:robot-vacuum", color: C.dev });
    }

    const w = conf.weather ? all[conf.weather] : undefined;
    const lvl = conf.warnings?.level ? all[conf.warnings.level] : undefined;
    const g = conf.gauge ? all[conf.gauge.entity] : undefined;
    const fuelBest = conf.fuel?.cheapest ? all[conf.fuel.cheapest] : undefined;
    if (w || lvl || g || fuelBest) {
      out.push({ id: "lage", x: 1260, y: 310, label: "Lage", icon: "mdi:radar", color: C.lage, size: 104 });
      if (w) out.push({ id: "wx", parent: "lage", x: 1470, y: 160, label: "Wetter", value: `${Math.round(Number(w.attributes.temperature))}°`, icon: "mdi:weather-partly-cloudy", color: C.lage });
      if (lvl) out.push({ id: "warn", parent: "lage", x: 1510, y: 360, label: "Warnstufe", value: lvl.state, icon: "mdi:alert-outline", color: C.lage });
      if (fuelBest && Number.isFinite(Number(fuelBest.state)))
        out.push({ id: "fuel", parent: "lage", x: 1450, y: 470, label: conf.fuel?.label ?? "Diesel", value: `${Number(fuelBest.state).toLocaleString("de-DE", { minimumFractionDigits: 3 })} €`, icon: "mdi:gas-station", color: C.lage });
      if (g) out.push({ id: "gauge", parent: "lage", x: 1130, y: 120, label: conf.gauge!.name, value: `${g.state} ${g.attributes.unit_of_measurement ?? ""}`, icon: "mdi:waves", color: C.lage });
    }

    if (persons.length) {
      const home = persons.filter((p) => p.state === "home").length;
      out.push({ id: "home", x: 1180, y: 505, label: "Wer ist da", value: `${home} zu Hause`, icon: "mdi:home-outline", color: C.home, size: 92 });
    }
    return out;
  }, [all, events, waste, conf]);

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const cx = 800;
  const cy = 470;
  const now = new Date();

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 1600, margin: "0 auto", aspectRatio: `${W}/${H}`, minHeight: 560 }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="nx-core" cx=".5" cy=".4" r=".6">
            <stop offset="0" stopColor="#6ee7b7" />
            <stop offset=".6" stopColor="#047857" />
            <stop offset="1" stopColor="#022c22" />
          </radialGradient>
        </defs>
        {nodes.map((n) => {
          const p = n.parent ? byId[n.parent] : { x: cx, y: cy };
          if (!p) return null;
          const hub = !n.parent;
          return (
            <g key={`l${n.id}`}>
              <line x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke={n.color} strokeOpacity={hub ? 0.7 : 0.45} strokeWidth={hub ? 3 : 1.6} />
              <line x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke={n.color} strokeWidth={hub ? 3 : 2} strokeDasharray="4 36" style={{ animation: `dash ${hub ? 3 : 5}s linear infinite` }} />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={175} fill="none" stroke="rgba(110,231,183,.15)" strokeWidth="1" />
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spin 60s linear infinite" }}>
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2;
            const r1 = 150;
            const r2 = i % 5 === 0 ? 168 : 160;
            return <line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} stroke="rgba(110,231,183,.55)" strokeWidth={i % 5 === 0 ? 3 : 1.5} />;
          })}
        </g>
        <circle cx={cx} cy={cy} r={125} fill="url(#nx-core)" style={{ transformOrigin: `${cx}px ${cy}px`, animation: "pulse 4s ease-in-out infinite" }} />
        <circle cx={cx} cy={cy} r={125} fill="none" stroke="rgba(255,255,255,.35)" />
        <g transform={`translate(${cx} ${cy - 18})`}>
          <path d="M0 -52 L45 -26 L45 26 L0 52 L-45 26 L-45 -26 Z" fill="rgba(255,255,255,.92)" />
          <rect x="-34" y="-16" width="68" height="34" rx="17" fill="#0b1f1a" />
          {[-14, 14].map((x) => (
            <circle key={x} cx={x} cy="1" r="8" fill="#5eead4">
              <animate attributeName="r" values="8;8;1;8" keyTimes="0;.9;.95;1" dur="5s" repeatCount="indefinite" />
            </circle>
          ))}
        </g>
        <text x={cx} y={cy + 78} textAnchor="middle" fill="#ecfdf5" fontSize="30" fontWeight="600" fontFamily="inherit">
          {conf.title ?? "Nexus"}
        </text>
        <text x={cx} y={cy + 104} textAnchor="middle" fill="rgba(236,253,245,.6)" fontSize="16" fontFamily="inherit">
          {fmtTime(now)} · alles im Blick
        </text>
      </svg>
      {nodes.map((n) => {
        const s = n.size ?? 66;
        return (
          <div key={n.id} style={{ position: "absolute", left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%`, transform: "translate(-50%, -50%)", textAlign: "center", width: 200, pointerEvents: "none" }}>
            <div
              style={{
                width: `clamp(${s * 0.55}px, ${(s / W) * 100}vw, ${s}px)`, aspectRatio: "1", margin: "0 auto", borderRadius: "50%", display: "grid", placeItems: "center",
                background: `radial-gradient(circle at 35% 30%, ${n.color}55, rgba(10,20,25,.9) 70%)`,
                border: `2px solid ${n.color}aa`, boxShadow: `0 0 ${n.parent ? 14 : 30}px ${n.color}55`,
              }}
            >
              <Icon icon={n.icon} width={n.parent ? 26 : 40} color="#f1f5f9" />
            </div>
            <div style={{ marginTop: 6, fontSize: n.parent ? 14 : 19, fontWeight: n.parent ? 500 : 700, color: "#f1f5f9", textShadow: "0 2px 6px rgba(0,0,0,.8)" }}>{n.label}</div>
            {n.value && <div style={{ fontSize: 12.5, color: n.color, fontFamily: "ui-monospace, Menlo, monospace", textShadow: "0 2px 6px rgba(0,0,0,.8)" }}>{n.value}</div>}
          </div>
        );
      })}
    </div>
  );
}
