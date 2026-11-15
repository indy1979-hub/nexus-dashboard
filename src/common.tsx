import { useState } from "react";
import { Card, Icon, Slider, Toggle } from "./ui";
import { PendantLamp, PlugStrip, StairLight, TvSet, TwinPendant, WeatherGlyph } from "./illus";
import {
  call,
  dayDiff,
  fmtDay,
  fmtTime,
  hsToRgb,
  isNa,
  isOn,
  lightColor,
  name,
  parseDate,
  relDay,
  useAll,
  useEnt,
  useForecast,
  useNow,
  useTodo,
  type CalEvent,
} from "./ha";
import { colorAt, useConf, type RoomConf } from "./config";

export const CONDITION: Record<string, string> = {
  "clear-night": "Klar",
  cloudy: "Bewölkt",
  exceptional: "Unwetter",
  fog: "Nebel",
  hail: "Hagel",
  lightning: "Gewitter",
  "lightning-rainy": "Gewitter, Regen",
  partlycloudy: "Teils bewölkt",
  pouring: "Starkregen",
  rainy: "Regen",
  snowy: "Schnee",
  "snowy-rainy": "Schneeregen",
  sunny: "Sonnig",
  windy: "Windig",
  "windy-variant": "Windig, bewölkt",
};

const rnd = (v?: number) => (v !== undefined && v !== null && !Number.isNaN(v) ? Math.round(v) : "–");

/* ---------- Uhr & Wetter ---------- */
export function ClockWeather() {
  const conf = useConf();
  const now = useNow(1000);
  const w = useEnt(conf.weather);
  const fc = useForecast(conf.weather);
  const day = fc[0];
  const t = w?.attributes.temperature as number | undefined;
  const feels = (w?.attributes.apparent_temperature as number | undefined) ?? t;
  const cond = w?.state ?? "cloudy";
  return (
    <Card>
      <div style={{ textAlign: "center", padding: "10px 0 18px" }}>
        <div className="mono" style={{ fontSize: "clamp(64px, 7.2vw, 118px)", fontWeight: 200, letterSpacing: "-0.03em", lineHeight: 1 }}>
          {fmtTime(now)}
        </div>
        <div style={{ fontSize: 22, marginTop: 10 }}>{fmtDay(now)}</div>
        {conf.location && (
          <div className="eyebrow" style={{ marginTop: 6 }}>
            <Icon icon="mdi:map-marker-outline" style={{ verticalAlign: "-2px" }} /> {conf.location}
          </div>
        )}
      </div>
      {w && (
        <div style={{ borderTop: "1px solid var(--line-2)", paddingTop: 16 }} className="row">
          <WeatherGlyph condition={cond} size={96} />
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1 }}>{rnd(t)}°</div>
          <div className="col" style={{ gap: 6 }}>
            <div style={{ fontSize: 20 }}>{CONDITION[cond] ?? cond}</div>
            <span className="chip">
              Gefühlt {rnd(feels)}° · H {rnd(day?.temperature)}° · T {rnd(day?.templow)}°
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ---------- Müllabfuhr ---------- */
export function useWaste() {
  const conf = useConf();
  const all = useAll();
  return (conf.waste ?? [])
    .map((m, i) => {
      const days = Number(all[m.entity]?.state);
      const date = parseDate(m.date ? all[m.date]?.state : undefined);
      return { ...m, id: m.entity, icon: m.icon ?? "mdi:trash-can-outline", color: colorAt(i + 3, m.color), days: Number.isFinite(days) ? days : null, date };
    })
    .filter((m) => m.days !== null)
    .sort((a, b) => (a.days ?? 999) - (b.days ?? 999));
}

export function MuellList() {
  const conf = useConf();
  const list = useWaste();
  const next = list[0];
  if (!next) return null;
  return (
    <Card>
      <div className="between">
        <h2 style={{ fontVariant: "small-caps", letterSpacing: ".04em" }}>Müllabfuhr</h2>
        <Icon icon="mdi:truck-outline" className="muted" width={22} />
      </div>
      {conf.address && (
        <div className="sub" style={{ marginTop: 4 }}>
          <Icon icon="mdi:map-marker-outline" style={{ verticalAlign: "-2px" }} /> {conf.address}
        </div>
      )}
      <div className="list-row hl" style={{ marginTop: 16, display: "block" }}>
        <div className="between">
          <span>
            Nächste: <b style={{ color: next.color }}>{next.name}</b>
          </span>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#93c5fd" }}>{relDay(next.days!)}</span>
        </div>
        <div className="bar" style={{ marginTop: 10, height: 5 }}>
          <i style={{ width: `${100 - Math.min(100, (next.days! / 14) * 100)}%`, background: "#60a5fa" }} />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        {list.map((m, i) => (
          <div key={m.id} className={`list-row ${i === 0 ? "hl" : ""}`}>
            <Icon icon={m.icon} width={22} style={{ color: m.color, flex: "0 0 auto" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
              <div className="mono" style={{ fontSize: 13, color: "var(--ink-3)" }}>
                {m.date ? m.date.toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "2-digit" }) : ""}
              </div>
            </div>
            <span className={`chip ${m.days! <= 1 ? "warn" : ""}`}>{relDay(m.days!)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Abholung als Lieferweg dargestellt. */
export function PickupTrack() {
  const list = useWaste();
  const next = list[0];
  if (!next) return null;
  const pct = 100 - Math.min(100, (next.days! / 14) * 100);
  const n = list.filter((m) => m.days! <= 7).length;
  return (
    <Card>
      <div className="row">
        <div className="icon-chip" style={{ background: "rgba(251,146,60,.2)" }}>
          <Icon icon="mdi:dump-truck" width={20} color="#fb923c" />
        </div>
        <div>
          <h3 style={{ letterSpacing: ".04em" }}>NÄCHSTE ABHOLUNG</h3>
          <div className="sub">
            {n} {n === 1 ? "Abholung" : "Abholungen"} in den nächsten 7 Tagen
          </div>
        </div>
      </div>
      <div className="list-row hl" style={{ marginTop: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, color: "var(--ink-2)" }}>{relDay(next.days!).replace(/^./, (c) => c.toUpperCase())}</div>
          <div style={{ fontSize: 18 }}>
            {next.name}
            {next.date ? ` – ${next.date.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}` : ""}
          </div>
        </div>
        <Icon icon={next.icon} width={26} style={{ color: next.color }} />
      </div>
      <div style={{ position: "relative", height: 40, marginTop: 16 }}>
        <div style={{ position: "absolute", left: 0, right: 30, top: 24, borderTop: "2px dashed rgba(255,255,255,.25)" }} />
        <div style={{ position: "absolute", left: 0, width: `calc(${pct}% * 0.9)`, top: 23, height: 3, background: "#60a5fa", borderRadius: 2 }} />
        <div style={{ position: "absolute", left: `calc(${pct}% * 0.9)`, top: 4, animation: "drive 3s ease-in-out infinite" }}>
          <Icon icon="mdi:truck" width={28} color="#facc15" />
        </div>
        <div style={{ position: "absolute", right: 0, top: 2 }}>
          <Icon icon="mdi:home" width={28} color="#f87171" />
        </div>
      </div>
    </Card>
  );
}

/* ---------- Licht pro Raum ---------- */
const SWATCHES: { label: string; data: Record<string, unknown>; css: string }[] = [
  { label: "Warmweiß", data: { color_temp_kelvin: 2700 }, css: "#ffc58a" },
  { label: "Neutral", data: { color_temp_kelvin: 4000 }, css: "#fff1dc" },
  { label: "Kaltweiß", data: { color_temp_kelvin: 6000 }, css: "#e8f1ff" },
  { label: "Rot", data: { hs_color: [0, 90] }, css: hsToRgb(0, 75) },
  { label: "Orange", data: { hs_color: [28, 95] }, css: hsToRgb(28, 85) },
  { label: "Grün", data: { hs_color: [140, 80] }, css: hsToRgb(140, 65) },
  { label: "Cyan", data: { hs_color: [188, 90] }, css: hsToRgb(188, 80) },
  { label: "Blau", data: { hs_color: [222, 90] }, css: hsToRgb(222, 75) },
  { label: "Lila", data: { hs_color: [270, 85] }, css: hsToRgb(270, 65) },
  { label: "Magenta", data: { hs_color: [312, 85] }, css: hsToRgb(312, 70) },
];

export function LightRoom({ room }: { room: RoomConf }) {
  const all = useAll();
  const ents = (room.lights ?? []).map((id) => all[id]).filter(Boolean);
  const on = ents.filter((e) => isOn(e));
  const ids = ents.filter((e) => !isNa(e)).map((e) => e.entity_id);
  const bri = on.length ? Math.round(on.reduce((s, e) => s + ((e.attributes.brightness as number) ?? 255), 0) / on.length / 2.55) : 0;
  const color = on[0] ? lightColor(on[0]) : "#3a4a46";
  const toggle = () => ids.length && call("light", on.length ? "turn_off" : "turn_on", {}, ids);
  const style = room.style ?? "pendant";
  return (
    <Card>
      <div className="between" style={{ alignItems: "flex-start" }}>
        <div>
          <h2>
            {room.title}
            <br />
            Licht
          </h2>
          <div className="sub" style={{ marginTop: 6 }}>
            {on.length} von {ents.length} an
          </div>
        </div>
        <div onClick={toggle} className="illus tap" title="Tippen: alle an/aus">
          {style === "pendant" && <PendantLamp color={color} on={on.length > 0} width={96} />}
          {style === "twin" && <TwinPendant color={color} on={on.length > 0} />}
          {style === "stairs" && <StairLight color={color} on={on.length > 0} />}
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div className="label-row">
          <span>Helligkeit</span>
          <span className="mono">{bri}%</span>
        </div>
        <Slider
          value={bri}
          gradient={`linear-gradient(90deg, rgba(255,255,255,.15), ${on.length ? color : "#9ca3af"})`}
          onCommit={(v) => (v === 0 ? call("light", "turn_off", {}, ids) : call("light", "turn_on", { brightness_pct: v }, ids))}
          disabled={!ids.length}
        />
        <div className="swatches">
          {SWATCHES.map((s) => (
            <div key={s.label} title={s.label} className="swatch" style={{ background: s.css, color: s.css }} onClick={() => ids.length && call("light", "turn_on", s.data, ids)} />
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ---------- Steckdosen ---------- */
export function PlugsCard({ room, compact }: { room: RoomConf; compact?: boolean }) {
  const all = useAll();
  const [open, setOpen] = useState(!compact);
  const ents = (room.switches ?? []).map((id) => ({ id, e: all[id] }));
  const onCount = ents.filter((x) => isOn(x.e)).length;
  return (
    <Card>
      <div className="between">
        <div>
          <h2>{room.title}</h2>
          <div className="eyebrow" style={{ marginTop: 6 }}>
            Steckdosen · {onCount}/{ents.length} an
          </div>
        </div>
        <button className="btn round" onClick={() => setOpen(!open)} title="Liste ein-/ausklappen">
          <Icon icon={open ? "mdi:chevron-up" : "mdi:chevron-down"} width={20} />
        </button>
      </div>
      <PlugStrip count={ents.length} onCount={onCount} />
      {open && (
        <div style={{ marginTop: 10 }}>
          {ents.map(({ id, e }) => (
            <div key={id} className="list-row" style={{ padding: "8px 12px" }}>
              <Icon icon={id.includes("usb") ? "mdi:usb-port" : "mdi:power-socket-de"} width={20} className="muted" />
              <div style={{ flex: 1, fontSize: 15, opacity: isNa(e) ? 0.5 : 1 }}>{name(e, id)}</div>
              {isNa(e) && <span className="chip bad">offline</span>}
              <Toggle on={isOn(e)} na={isNa(e)} onClick={() => call(id.split(".")[0], "toggle", {}, id)} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ---------- Termine ---------- */
export function EventsCard({ events, limit = 4 }: { events: CalEvent[]; limit?: number }) {
  const future = events.filter((e) => e.end.getTime() > Date.now());
  const upcoming = future.slice(0, limit);
  return (
    <Card>
      <div className="row">
        <div className="icon-chip">
          <Icon icon="mdi:calendar-month-outline" width={20} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ letterSpacing: ".06em" }}>NÄCHSTE TERMINE</h3>
          <div className="sub">{future.length} in 14 Tagen</div>
        </div>
      </div>
      <div style={{ marginTop: 14, borderLeft: "2px solid rgba(255,255,255,.15)", marginLeft: 8, paddingLeft: 14 }}>
        {upcoming.length === 0 && <div className="sub">Keine Termine. Freie Bahn.</div>}
        {upcoming.map((e, i) => (
          <div key={i} style={{ position: "relative", marginBottom: 10 }}>
            <span style={{ position: "absolute", left: -21, top: 18, width: 12, height: 12, borderRadius: "50%", background: e.color, boxShadow: `0 0 10px ${e.color}` }} />
            <div className="list-row" style={{ borderColor: `${e.color}66`, background: `${e.color}1f` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sub" style={{ color: "var(--ink)" }}>
                  {relDay(Math.max(0, dayDiff(e.start))).replace(/^./, (c) => c.toUpperCase())} · {e.allDay ? "ganztägig" : fmtTime(e.start)}
                </div>
                <div style={{ fontSize: 17, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.summary}</div>
              </div>
              <Icon icon="mdi:calendar-blank" width={20} style={{ color: e.color }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Aufgaben ---------- */
export function TasksCard() {
  const conf = useConf();
  const lists = (conf.todos ?? []).map((l, i) => ({ ...l, color: colorAt(i, l.color) }));
  const [idx, setIdx] = useState(0);
  const list = lists[Math.min(idx, Math.max(0, lists.length - 1))];
  const { items, add, toggle, remove } = useTodo(list);
  const [text, setText] = useState("");
  if (!list) return null;
  const open = items.filter((i) => i.status === "needs_action");
  const done = items.filter((i) => i.status === "completed").slice(0, 3);
  const submit = () => {
    if (text.trim()) add(text.trim());
    setText("");
  };
  return (
    <Card style={{ display: "flex", flexDirection: "column" }}>
      <h2 style={{ color: "#c4b5fd" }}>Aufgaben</h2>
      <div className="sub" style={{ color: "#f9a8d4", marginTop: 4 }}>
        {open.length} offen in „{list.label}“
      </div>
      <div className="row" style={{ marginTop: 12, flexWrap: "wrap", gap: 6 }}>
        {lists.map((l, i) => (
          <button key={l.entity} className="chip" onClick={() => setIdx(i)} style={{ cursor: "pointer", borderColor: i === idx ? l.color : undefined, color: i === idx ? l.color : undefined }}>
            {l.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12, flex: 1 }}>
        {open.length === 0 && <div className="sub">Nichts offen.</div>}
        {[...open, ...done].map((it) => (
          <div key={it.uid} className="list-row" style={{ borderLeft: `3px solid ${list.color}`, background: `${list.color}22` }}>
            <span
              onClick={() => toggle(it)}
              style={{
                width: 22, height: 22, borderRadius: "50%", border: `2px solid ${list.color}`, cursor: "pointer", flex: "0 0 auto",
                background: it.status === "completed" ? list.color : "transparent",
              }}
            />
            <div style={{ flex: 1, fontSize: 17, textDecoration: it.status === "completed" ? "line-through" : "none", opacity: it.status === "completed" ? 0.55 : 1 }}>
              {it.summary}
            </div>
            <Icon icon="mdi:close" className="muted" style={{ cursor: "pointer" }} onClick={() => remove(it)} />
          </div>
        ))}
      </div>
      <div className="row" style={{ marginTop: 14 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Aufgabe hinzufügen …"
          style={{ flex: 1, minWidth: 0, padding: "14px 16px", borderRadius: 14, border: "1px solid var(--line)", background: "rgba(0,0,0,.25)", color: "var(--ink)", outline: "none" }}
        />
        <button className="btn primary" style={{ width: 50, height: 50, borderRadius: 14, flex: "0 0 auto" }} onClick={submit} title="Hinzufügen">
          <Icon icon="mdi:plus" width={24} />
        </button>
      </div>
    </Card>
  );
}

/* ---------- Fernseher ---------- */
export function TvBar() {
  const conf = useConf();
  const entity = conf.tv;
  const e = useEnt(entity);
  if (!entity) return null;
  const on = !!e && !["off", "standby", "unavailable", "unknown"].includes(e.state);
  const vol = Math.round(((e?.attributes.volume_level as number) ?? 0) * 100);
  const title = (e?.attributes.media_title as string) || (e?.attributes.source as string) || (on ? "Läuft" : "Aus");
  return (
    <div className="card" style={{ borderRadius: 0, border: 0, background: "rgba(80,70,20,.18)", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
      <div onClick={() => call("media_player", "toggle", {}, entity)} style={{ cursor: "pointer" }} title="Ein/Aus">
        <TvSet on={on} width={150} />
      </div>
      <div style={{ flex: "1 1 200px", minWidth: 0 }}>
        <div className="sub">
          <Icon icon="mdi:television" style={{ verticalAlign: "-2px" }} /> {name(e, "Fernseher")}
        </div>
        <div style={{ fontSize: 24, fontWeight: 600 }}>Fernseher</div>
        <div className="sub">{isNa(e) ? "nicht erreichbar" : title}</div>
      </div>
      <div className="row" style={{ gap: 12 }}>
        <button className="btn round" onClick={() => call("media_player", "media_previous_track", {}, entity)} disabled={!on}>
          <Icon icon="mdi:skip-previous" width={22} />
        </button>
        <button className="btn big" onClick={() => call("media_player", on ? "media_play_pause" : "turn_on", {}, entity)}>
          <Icon icon={on ? (e?.state === "playing" ? "mdi:pause" : "mdi:play") : "mdi:power"} width={34} />
        </button>
        <button className="btn round" onClick={() => call("media_player", "media_next_track", {}, entity)} disabled={!on}>
          <Icon icon="mdi:skip-next" width={22} />
        </button>
      </div>
      <div className="row" style={{ flex: "1 1 220px" }}>
        <Icon
          icon={e?.attributes.is_volume_muted ? "mdi:volume-off" : "mdi:volume-high"}
          width={22}
          style={{ cursor: "pointer" }}
          onClick={() => call("media_player", "volume_mute", { is_volume_muted: !e?.attributes.is_volume_muted }, entity)}
        />
        <div style={{ flex: 1 }}>
          <Slider value={vol} onCommit={(v) => call("media_player", "volume_set", { volume_level: v / 100 }, entity)} disabled={!on} />
        </div>
      </div>
    </div>
  );
}
