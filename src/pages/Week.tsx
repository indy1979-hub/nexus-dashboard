import { useMemo } from "react";
import { Bar, Card, Icon } from "../ui";
import { dayDiff, fmtTime, relDay, sameDay, useAll, type CalEvent } from "../ha";
import { useWaste } from "../common";

const WD = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];

function days(n: number) {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) out.push(new Date(d.getTime() + i * 86400000));
  return out;
}

function NextEvents({ events }: { events: CalEvent[] }) {
  const next = events.filter((e) => e.end.getTime() > Date.now()).slice(0, 3);
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="section-title" style={{ margin: 0 }}>
        <span className="icon-chip">
          <Icon icon="mdi:calendar-star" width={20} />
        </span>
        Demnächst
      </div>
      {next.length === 0 && <div className="sub">Nichts geplant.</div>}
      {next.map((e, i) => (
        <div key={i} className="list-row" style={{ borderLeft: `4px solid ${e.color}`, padding: "12px 14px" }}>
          <div style={{ textAlign: "center", minWidth: 46 }}>
            <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{e.start.getDate()}</div>
            <div className="eyebrow">{e.start.toLocaleDateString("de-DE", { month: "short" })}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.summary}</div>
            <div className="sub">
              {e.start.toLocaleDateString("de-DE", { weekday: "short" })} · {e.allDay ? "ganztägig" : fmtTime(e.start)}
            </div>
          </div>
          <span className="chip">{relDay(dayDiff(e.start))}</span>
        </div>
      ))}
    </Card>
  );
}

function FortnightGrid({ events }: { events: CalEvent[] }) {
  const muell = useWaste();
  const list = days(14);
  return (
    <Card>
      <div className="between" style={{ marginBottom: 12 }}>
        <div className="section-title" style={{ margin: 0 }}>
          <span className="icon-chip">
            <Icon icon="mdi:calendar-range" width={20} />
          </span>
          14 Tage
        </div>
        <span className="sub">Müll · Termine</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 10 }}>
        {list.map((d, i) => {
          const m = muell.filter((x) => x.date && sameDay(x.date, d));
          const ev = events.filter((e) => (e.allDay ? d >= e.start && d < e.end : sameDay(e.start, d)));
          const glow = m.length ? m[0].color : null;
          return (
            <div
              key={i}
              className="list-row"
              style={{
                display: "block", margin: 0, minHeight: 92, padding: "10px 10px",
                border: i === 0 ? "2px solid rgba(255,255,255,.7)" : glow ? `2px solid ${glow}` : undefined,
                boxShadow: glow ? `0 0 16px ${glow}55` : undefined,
                background: glow ? `${glow}22` : undefined,
              }}
            >
              <div className="between">
                <span className="eyebrow" style={{ color: "var(--ink-2)" }}>
                  {i === 0 ? "HEUTE" : WD[d.getDay()]}
                </span>
                <span style={{ fontWeight: 700 }}>{d.getDate()}</span>
              </div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {m.map((x) => (
                  <span key={x.id} className="chip" style={{ background: x.color, color: "#111", border: 0, fontWeight: 700, justifyContent: "center" }}>
                    <Icon icon={x.icon} /> {x.name.split(" ")[0]}
                  </span>
                ))}
                {ev.length > 0 && (
                  <span className="sub" style={{ fontSize: 12 }}>
                    <Icon icon="mdi:calendar" style={{ verticalAlign: "-2px" }} /> {ev.length} Termin{ev.length > 1 ? "e" : ""}
                  </span>
                )}
                {!m.length && !ev.length && <span className="muted" style={{ fontSize: 14 }}>frei</span>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ChristmasCountdown() {
  const now = new Date();
  const year = now.getMonth() === 11 && now.getDate() > 24 ? now.getFullYear() + 1 : now.getFullYear();
  const xmas = new Date(year, 11, 24);
  const d = dayDiff(xmas);
  const start = new Date(year, 10, 1);
  const pct = Math.max(0, Math.min(100, ((now.getTime() - start.getTime()) / (xmas.getTime() - start.getTime())) * 100));
  return (
    <Card style={{ padding: 0, background: "linear-gradient(180deg,#1e3a5f 0%,#2b5876 60%,#dbeafe 60.5%,#f1f5f9 100%)", minHeight: 240 }}>
      <svg viewBox="0 0 400 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMax slice">
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={(i * 47) % 400} cy={(i * 31) % 140} r={1.5 + (i % 3)} fill="#fff" opacity=".8">
            <animate attributeName="cy" values={`${(i * 31) % 140};${150 + ((i * 31) % 140)}`} dur={`${6 + (i % 5)}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <g transform="translate(335 112) scale(.82)">
          <rect x="-6" y="40" width="12" height="18" fill="#7c4a1e" />
          <path d="M0 -60 L-44 44 H44 Z" fill="#15803d" />
          <path d="M0 -60 L-30 10 H30 Z" fill="#16a34a" />
          <path d="M0 -70 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#facc15" />
          {[[-20, 20, "#ef4444"], [14, 6, "#60a5fa"], [-6, -14, "#f472b6"], [24, 32, "#facc15"]].map(([x, y, c], i) => (
            <circle key={i} cx={x as number} cy={y as number} r="4" fill={c as string} />
          ))}
        </g>
      </svg>
      <div style={{ position: "relative", padding: 22 }}>
        <div className="between">
          <h2>Heiligabend</h2>
          <span style={{ background: "#fff", color: "#111", borderRadius: 99, padding: "6px 14px", fontWeight: 700, fontSize: 20 }}>{d} Tage</span>
        </div>
        <div className="sub" style={{ color: "#e0f2fe", marginTop: 4 }}>24. Dezember {year}</div>
      </div>
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 18 }}>
        <div className="between" style={{ color: "#0f172a", fontWeight: 600, marginBottom: 6 }}>
          <span>Weihnachten lädt …</span>
          <span>{Math.round(pct)} %</span>
        </div>
        <div className="bar" style={{ background: "rgba(15,23,42,.2)" }}>
          <i style={{ width: `${pct}%`, background: "linear-gradient(90deg,#fde68a,#f97316)" }} />
        </div>
      </div>
    </Card>
  );
}

function MyWeek({ events }: { events: CalEvent[] }) {
  const muell = useWaste();
  const list = days(7);
  return (
    <Card className="section">
      <div className="section-title">
        <span className="icon-chip">
          <Icon icon="mdi:checkbox-marked-outline" width={20} />
        </span>
        Meine Woche
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
        {list.map((d, i) => {
          const ev = events.filter((e) => (e.allDay ? d >= e.start && d < e.end : sameDay(e.start, d)));
          const m = muell.filter((x) => x.date && sameDay(x.date, d));
          return (
            <div key={i} className="list-row" style={{ display: "block", margin: 0, minHeight: 220, padding: 14, border: i === 0 ? "2px solid rgba(147,197,253,.8)" : undefined }}>
              <div className="eyebrow">{i === 0 ? "HEUTE" : d.toLocaleDateString("de-DE", { weekday: "long" }).toUpperCase()}</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>{d.getDate()}.</div>
              {m.map((x) => (
                <div key={x.id} className="list-row" style={{ padding: "7px 10px", background: `${x.color}33`, borderColor: `${x.color}88` }}>
                  <Icon icon={x.icon} style={{ color: x.color }} />
                  <span style={{ fontSize: 14 }}>{x.name} raus</span>
                </div>
              ))}
              {ev.map((e, j) => (
                <div key={j} className="list-row" style={{ padding: "7px 10px", borderLeft: `3px solid ${e.color}` }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.summary}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{e.allDay ? "ganztägig" : fmtTime(e.start)}</div>
                  </div>
                </div>
              ))}
              {!ev.length && !m.length && <div className="muted" style={{ fontSize: 14 }}>Nichts eingetragen.</div>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Batteries() {
  const all = useAll();
  const list = useMemo(
    () =>
      Object.values(all)
        .filter((e) => e.entity_id.startsWith("sensor.") && e.attributes.device_class === "battery" && Number.isFinite(Number(e.state)))
        .sort((a, b) => Number(a.state) - Number(b.state))
        .slice(0, 8),
    [all],
  );
  const charging = (id: string) => {
    const base = id.replace(/^sensor\./, "").replace(/_battery_level$|_batterie$|_battery$/, "");
    const st = all[`sensor.${base}_battery_state`]?.state ?? all[`binary_sensor.${base}_is_charging`]?.state;
    return st === "charging" || st === "on";
  };
  return (
    <Card className="section">
      <div className="between" style={{ marginBottom: 14 }}>
        <div className="section-title" style={{ margin: 0 }}>
          <span className="icon-chip">
            <Icon icon="mdi:battery-heart-variant" width={20} />
          </span>
          Akkus
        </div>
        <div className="row">
          <span className="chip ok">
            <Icon icon="mdi:lightning-bolt" /> {list.filter((e) => charging(e.entity_id)).length} lädt
          </span>
          <span className="chip">{list.length} Geräte</span>
        </div>
      </div>
      {list.length === 0 && <div className="sub">Keine Akkusensoren gefunden.</div>}
      <div className="grid-auto">
        {list.map((e) => {
          const v = Number(e.state);
          const c = charging(e.entity_id);
          const col = v < 20 ? "var(--bad)" : v < 40 ? "var(--warn)" : "var(--ok)";
          return (
            <div key={e.entity_id} className="list-row" style={{ display: "block", margin: 0, padding: 16 }}>
              <div className="between">
                <div className="row" style={{ minWidth: 0 }}>
                  <span className="icon-chip" style={{ width: 34, height: 34 }}>
                    <Icon icon={(e.attributes.icon as string) || "mdi:battery"} />
                  </span>
                  <span style={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {String(e.attributes.friendly_name ?? e.entity_id).replace(/ ?(Akku(stand)?|Batterie(stand)?|Battery( level)?)$/i, "")}
                  </span>
                </div>
                {c && <Icon icon="mdi:lightning-bolt" color="#facc15" />}
              </div>
              <div style={{ fontSize: 40, fontWeight: 700, margin: "10px 0 8px" }}>
                {v}
                <span style={{ fontSize: 18, fontWeight: 400 }}> %</span>
              </div>
              <Bar value={v} color={c ? "linear-gradient(90deg,#facc15,#f59e0b)" : col} />
              <div className="sub" style={{ marginTop: 8, color: c ? "#fde68a" : undefined }}>{c ? "Lädt" : "Im Akkubetrieb"}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function WeekPage({ events }: { events: CalEvent[] }) {
  return (
    <div className="col" style={{ gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1fr) minmax(0, 2.4fr) minmax(240px, 1fr)", gap: 18 }} className="week-top">
        <NextEvents events={events} />
        <FortnightGrid events={events} />
        <ChristmasCountdown />
      </div>
      <MyWeek events={events} />
      <Batteries />
    </div>
  );
}
