import { useEffect, useState } from "react";
import { Card, Icon } from "../ui";
import { WeatherGlyph } from "../illus";
import { fmtTime, isOn, name, useAll, useEnt, useForecast } from "../ha";
import { CONDITION } from "../common";
import { useConf } from "../config";

function WeatherCard() {
  const conf = useConf();
  const w = useEnt(conf.weather);
  const fc = useForecast(conf.weather).slice(0, 6);
  if (!w) return null;
  const a = w.attributes;
  return (
    <Card className="span2">
      <div className="row" style={{ alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <WeatherGlyph condition={w.state} size={120} />
        <div>
          <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1 }}>{a.temperature !== undefined ? Math.round(a.temperature) : "–"}°</div>
          <div style={{ fontSize: 22 }}>{CONDITION[w.state] ?? w.state}</div>
        </div>
        <div className="row" style={{ marginLeft: "auto", gap: 8, flexWrap: "wrap" }}>
          {a.humidity !== undefined && (
            <span className="chip">
              <Icon icon="mdi:water-percent" /> {a.humidity} %
            </span>
          )}
          {a.wind_speed !== undefined && (
            <span className="chip">
              <Icon icon="mdi:weather-windy" /> {a.wind_speed} {a.wind_speed_unit ?? "km/h"}
            </span>
          )}
          {a.pressure !== undefined && (
            <span className="chip">
              <Icon icon="mdi:gauge" /> {a.pressure} {a.pressure_unit ?? "hPa"}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginTop: 18 }}>
        {fc.map((f, i) => (
          <div key={i} className="list-row" style={{ display: "block", textAlign: "center", margin: 0 }}>
            <div className="eyebrow">{i === 0 ? "HEUTE" : new Date(f.datetime).toLocaleDateString("de-DE", { weekday: "short" }).toUpperCase()}</div>
            <div style={{ display: "grid", placeItems: "center" }}>
              <WeatherGlyph condition={f.condition ?? "cloudy"} size={64} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{f.temperature !== undefined ? `${Math.round(f.temperature)}°` : "–"}</div>
            <div className="muted">{f.templow !== undefined ? `${Math.round(f.templow)}°` : ""}</div>
            {f.precipitation_probability !== undefined && (
              <div className="sub" style={{ color: "#7dd3fc" }}>
                <Icon icon="mdi:water" /> {f.precipitation_probability} %
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function WarnCard() {
  const cfg = useConf().warnings;
  const all = useAll();
  if (!cfg) return null;
  const level = Number(cfg.level ? all[cfg.level]?.state : NaN);
  const pre = Number(cfg.prelevel ? all[cfg.prelevel]?.state : NaN);
  const active = (cfg.alerts ?? []).map((id) => all[id]).filter((w) => isOn(w));
  const motion = cfg.motion ? all[cfg.motion.entity] : undefined;
  const col = level >= 3 ? "var(--bad)" : level >= 1 ? "var(--warn)" : "var(--ok)";
  return (
    <Card>
      <div className="section-title" style={{ margin: 0 }}>
        <span className="icon-chip">
          <Icon icon="mdi:alert-outline" width={20} />
        </span>
        Warnlage
      </div>
      <div className="row" style={{ marginTop: 16, gap: 22 }}>
        {Number.isFinite(level) && (
          <div>
            <div className="eyebrow">Warnstufe</div>
            <div style={{ fontSize: 56, fontWeight: 700, color: col, lineHeight: 1.05 }}>{level}</div>
          </div>
        )}
        {Number.isFinite(pre) && (
          <div>
            <div className="eyebrow">Vorwarnung</div>
            <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.05 }}>{pre}</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 14 }}>
        {active.length === 0 && (
          <div className="list-row">
            <Icon icon="mdi:shield-check-outline" color="#4ade80" width={22} />
            <span>Keine aktiven Warnungen{cfg.region ? ` für ${cfg.region}` : ""}</span>
          </div>
        )}
        {active.map((w) => (
          <div key={w.entity_id} className="list-row" style={{ borderColor: "rgba(251,191,36,.5)" }}>
            <Icon icon="mdi:alert" color="#fbbf24" width={22} />
            <span style={{ flex: 1 }}>{(w.attributes.headline as string) || name(w, w.entity_id)}</span>
          </div>
        ))}
        {motion && cfg.motion && (
          <div className="list-row">
            <Icon icon={isOn(motion) ? "mdi:motion-sensor" : "mdi:motion-sensor-off"} width={22} color={isOn(motion) ? "#f87171" : undefined} />
            <span style={{ flex: 1 }}>{cfg.motion.label}</span>
            <span className={`chip ${isOn(motion) ? "bad" : "ok"}`}>{isOn(motion) ? "Bewegung" : "ruhig"}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function GaugeCard() {
  const cfg = useConf().gauge;
  const all = useAll();
  if (!cfg) return null;
  const p = all[cfg.entity];
  const v = Number(p?.state);
  const gelb = Number(cfg.yellow ? all[cfg.yellow]?.state : NaN);
  const rot = Number(cfg.red ? all[cfg.red]?.state : NaN);
  const max = Number.isFinite(rot) ? rot * 1.15 : Number.isFinite(v) ? v * 1.6 : 100;
  const col = Number.isFinite(rot) && v >= rot ? "var(--bad)" : Number.isFinite(gelb) && v >= gelb ? "var(--warn)" : "#38bdf8";
  return (
    <Card>
      <div className="section-title" style={{ margin: 0 }}>
        <span className="icon-chip">
          <Icon icon="mdi:waves-arrow-up" width={20} />
        </span>
        {cfg.name}
      </div>
      <div style={{ fontSize: 64, fontWeight: 700, marginTop: 10, color: col }}>
        {Number.isFinite(v) ? v : "–"}
        <span style={{ fontSize: 22, fontWeight: 400, color: "var(--ink-2)" }}> {String(p?.attributes.unit_of_measurement ?? "")}</span>
      </div>
      <div style={{ position: "relative", height: 16, borderRadius: 99, background: "rgba(255,255,255,.1)", marginTop: 10, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100, (v / max) * 100)}%`, background: `linear-gradient(90deg,#0ea5e9,${col})` }} />
        {Number.isFinite(gelb) && <div style={{ position: "absolute", left: `${(gelb / max) * 100}%`, top: 0, bottom: 0, width: 3, background: "#fbbf24" }} />}
        {Number.isFinite(rot) && <div style={{ position: "absolute", left: `${(rot / max) * 100}%`, top: 0, bottom: 0, width: 3, background: "#ef4444" }} />}
      </div>
      <div className="row" style={{ marginTop: 10, gap: 8 }}>
        {Number.isFinite(gelb) && <span className="chip warn">Gelb ab {gelb}</span>}
        {Number.isFinite(rot) && <span className="chip bad">Rot ab {rot}</span>}
      </div>
    </Card>
  );
}

const PHASE: Record<string, string> = {
  new_moon: "Neumond", waxing_crescent: "Zunehmende Sichel", first_quarter: "Erstes Viertel", waxing_gibbous: "Zunehmender Mond",
  full_moon: "Vollmond", waning_gibbous: "Abnehmender Mond", last_quarter: "Letztes Viertel", waning_crescent: "Abnehmende Sichel",
};

function SkyCard() {
  const cfg = useConf().sky;
  const all = useAll();
  if (!cfg) return null;
  const rows: [string | undefined, string, string][] = [
    [cfg.dawn, "Morgendämmerung", "mdi:weather-sunset"],
    [cfg.rising, "Sonnenaufgang", "mdi:weather-sunset-up"],
    [cfg.setting, "Sonnenuntergang", "mdi:weather-sunset-down"],
    [cfg.dusk, "Abenddämmerung", "mdi:weather-night"],
  ];
  const moon = cfg.moon_phase ? all[cfg.moon_phase]?.state : undefined;
  return (
    <Card>
      <div className="section-title" style={{ margin: 0 }}>
        <span className="icon-chip">
          <Icon icon="mdi:weather-night-partly-cloudy" width={20} />
        </span>
        Sonne & Mond
      </div>
      <div style={{ marginTop: 14 }}>
        {rows
          .filter(([id]) => id && all[id])
          .map(([id, label, icon]) => {
            const d = new Date(all[id!].state);
            return (
              <div key={id} className="list-row">
                <Icon icon={icon} width={20} color="#fcd34d" />
                <span style={{ flex: 1 }}>{label}</span>
                <span className="mono">{!isNaN(d.getTime()) ? fmtTime(d) : "–"}</span>
              </div>
            );
          })}
        {moon && (
          <div className="list-row">
            <Icon icon="mdi:moon-waning-crescent" width={20} color="#e2e8f0" />
            <span style={{ flex: 1 }}>{PHASE[moon] ?? moon}</span>
            {cfg.moon_elevation && all[cfg.moon_elevation] && <span className="mono">{all[cfg.moon_elevation].state}°</span>}
          </div>
        )}
      </div>
    </Card>
  );
}

function CameraCard({ id, title }: { id: string; title: string }) {
  const e = useEnt(id);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 10000);
    return () => clearInterval(t);
  }, []);
  const pic = e?.attributes.entity_picture as string | undefined;
  const src = pic ? `${pic}${pic.includes("?") ? "&" : "?"}t=${tick}` : null;
  return (
    <Card className="span2" style={{ padding: 0 }}>
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#0b1220" }}>
        {src ? (
          <img src={src} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }} className="muted">
            Kein Bild
          </div>
        )}
        <span className="chip" style={{ position: "absolute", left: 12, top: 12, background: "rgba(0,0,0,.55)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: e && e.state !== "unavailable" ? "#ef4444" : "#64748b" }} /> {title}
        </span>
      </div>
    </Card>
  );
}

export function LagePage() {
  const conf = useConf();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}>
      <WeatherCard />
      <WarnCard />
      <GaugeCard />
      <SkyCard />
      {(conf.cameras ?? []).map((c) => (
        <CameraCard key={c.entity} id={c.entity} title={c.title} />
      ))}
    </div>
  );
}
