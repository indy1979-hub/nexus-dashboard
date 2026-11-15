import { useRef, useState } from "react";
import { Card, Icon, Slider } from "../ui";
import { TvSet } from "../illus";
import { call, fmtDay, fmtTime, isNa, isOn, useAll, useEnt, useNow } from "../ha";
import { CONDITION } from "../common";
import { colorAt, useConf, type ActionConf } from "../config";

const runAction = (a: ActionConf) => call(a.domain ?? a.entity.split(".")[0], a.service ?? (a.entity.startsWith("script.") ? "turn_on" : "toggle"), a.data ?? {}, a.entity);

function RoundClock() {
  const conf = useConf();
  const now = useNow(1000);
  const w = useEnt(conf.weather);
  const t = w?.attributes.temperature as number | undefined;
  return (
    <Card style={{ display: "flex", flexDirection: "column", minHeight: 620 }}>
      <div className="between">
        <div className="row">
          <span className="icon-chip" style={{ background: "#0e7490" }}>
            <Icon icon="mdi:circle-outline" width={20} />
          </span>
          <h3 style={{ fontSize: 22 }}>Nachtwache</h3>
        </div>
        {conf.night_room && <span className="chip">{conf.night_room}</span>}
      </div>
      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "26px 0" }}>
        <div style={{ position: "relative", width: 300, height: 300, maxWidth: "80vw", maxHeight: "80vw" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", transform: "translate(18px, 6px)", filter: "brightness(.8)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#2563eb", boxShadow: "0 30px 60px rgba(0,0,0,.45)" }} />
          <div style={{ position: "absolute", inset: 18, borderRadius: "50%", overflow: "hidden", background: "#000" }}>
            <div style={{ position: "absolute", inset: "54% 0 0 0", background: "repeating-linear-gradient(45deg,#3b82f6 0 3px,#2563eb 3px 6px)" }} />
            <div style={{ position: "absolute", top: "18%", width: "100%", textAlign: "center" }}>
              {t !== undefined && (
                <div className="sub" style={{ color: "#bfdbfe" }}>
                  <Icon icon="mdi:weather-cloudy" style={{ verticalAlign: "-2px" }} /> {Math.round(t)}°
                </div>
              )}
              <div className="mono" style={{ fontSize: 66, fontWeight: 300, lineHeight: 1.05 }}>{fmtTime(now)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="list-row" style={{ padding: 14 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#94a3b8" }} />
        <span className="sub">
          {fmtDay(now)}
          {w ? ` · ${CONDITION[w.state] ?? w.state}` : ""}
        </span>
      </div>
      <div className="row" style={{ flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {(conf.night_actions ?? []).map((a) => (
          <button key={a.entity + a.label} className="btn" onClick={() => runAction(a)}>
            {a.icon && <Icon icon={a.icon} />} {a.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function StatusTile({ a }: { a: ActionConf }) {
  const e = useEnt(a.entity);
  const on = isOn(e);
  return (
    <div
      onClick={() => !isNa(e) && call(a.entity.split(".")[0], "toggle", {}, a.entity)}
      style={{
        cursor: "pointer", borderRadius: 14, padding: "12px 8px", textAlign: "center", flex: 1, minWidth: 90,
        background: on ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.08)", color: on ? "#111" : "var(--ink)",
        border: "1px solid var(--line)", transition: "all .2s",
      }}
    >
      <Icon icon={a.icon ?? "mdi:toggle-switch-outline"} width={22} />
      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{a.label}</div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{isNa(e) ? "offline" : on ? "An" : "Aus"}</div>
    </div>
  );
}

function HoldButton({ onFire }: { onFire: () => void }) {
  const [p, setP] = useState(0);
  const timer = useRef<number | null>(null);
  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setP(0);
  };
  const start = () => {
    const t0 = Date.now();
    timer.current = window.setInterval(() => {
      const v = Math.min(100, ((Date.now() - t0) / 1600) * 100);
      setP(v);
      if (v >= 100) {
        stop();
        onFire();
      }
    }, 30);
  };
  return (
    <button
      className="btn"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      style={{ width: "100%", padding: 14, position: "relative", overflow: "hidden", borderColor: "rgba(248,113,113,.6)", background: "rgba(127,29,29,.35)" }}
    >
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p}%`, background: "rgba(239,68,68,.6)" }} />
      <span style={{ position: "relative" }}>
        <Icon icon="mdi:alert-octagon" /> Notaus – gedrückt halten
      </span>
    </button>
  );
}

function Zentrale() {
  const conf = useConf();
  const now = useNow(1000);
  const w = useEnt(conf.weather);
  const all = useAll();
  const t = w?.attributes.temperature as number | undefined;
  return (
    <Card style={{ minHeight: 620 }}>
      <div className="between">
        <div className="row">
          <span className="icon-chip" style={{ background: "#155e75" }}>
            <Icon icon="mdi:tablet-dashboard" width={20} />
          </span>
          <h3 style={{ fontSize: 22 }}>Zentrale</h3>
        </div>
        <span className="chip">Ganzes Haus</span>
      </div>
      <div style={{ marginTop: 18, borderRadius: 26, padding: 14, background: "#16181d", boxShadow: "0 20px 40px rgba(0,0,0,.45)" }}>
        <div style={{ borderRadius: 16, padding: 18, background: "linear-gradient(135deg,#1e1b4b,#3b0764 60%,#4c1d95)" }}>
          <div className="between" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="mono" style={{ fontSize: 54, fontWeight: 300, lineHeight: 1 }}>{fmtTime(now)}</div>
              <div className="sub">{fmtDay(now)}</div>
            </div>
            {w && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 30 }}>{t !== undefined ? Math.round(t) : "–"}°</div>
                <div className="sub">{CONDITION[w.state] ?? w.state}</div>
              </div>
            )}
          </div>
          <div className="row" style={{ marginTop: 26, gap: 8, flexWrap: "wrap" }}>
            {(conf.house_switches ?? []).map((a) => (
              <StatusTile key={a.entity} a={a} />
            ))}
          </div>
        </div>
      </div>
      <div className="eyebrow" style={{ margin: "22px 0 10px" }}>Abläufe</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {(conf.routines ?? [])
          .filter((r) => all[r.entity])
          .map((r, i) => (
            <button key={r.entity} className="list-row" style={{ margin: 0, cursor: "pointer", textAlign: "left" }} onClick={() => runAction(r)}>
              <span className="icon-chip" style={{ background: colorAt(i, r.color), border: 0 }}>
                <Icon icon={r.icon ?? "mdi:play"} width={20} color="#fff" />
              </span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{r.label}</span>
            </button>
          ))}
      </div>
      {conf.emergency && all[conf.emergency] && (
        <div style={{ marginTop: 14 }}>
          <HoldButton onFire={() => call("script", "turn_on", {}, conf.emergency)} />
          {conf.emergency_reset && all[conf.emergency_reset] && (
            <button className="btn" style={{ width: "100%", marginTop: 8 }} onClick={() => call("script", "turn_on", {}, conf.emergency_reset)}>
              <Icon icon="mdi:restore-alert" /> Notaus aufheben
            </button>
          )}
        </div>
      )}
    </Card>
  );
}

function TvCard() {
  const conf = useConf();
  const id = conf.tv!;
  const e = useEnt(conf.tv);
  const plug = useEnt(conf.tv_plug);
  const on = !!e && !["off", "standby", "unavailable", "unknown"].includes(e.state);
  const sources = (e?.attributes.source_list as string[] | undefined) ?? [];
  const vol = Math.round(((e?.attributes.volume_level as number) ?? 0) * 100);
  return (
    <Card style={{ minHeight: 620 }}>
      <div className="between">
        <div className="row">
          <span className="icon-chip" style={{ background: "#16a34a", border: 0 }}>
            <Icon icon="mdi:television-classic" width={20} />
          </span>
          <h3 style={{ fontSize: 22 }}>Fernseher</h3>
        </div>
        {conf.tv_room && <span className="chip ok">{conf.tv_room}</span>}
      </div>
      <div className="row" style={{ marginTop: 18, alignItems: "flex-start" }}>
        <div style={{ borderRadius: 18, overflow: "hidden", background: "linear-gradient(135deg,#065f46,#16a34a)", padding: 10, cursor: "pointer" }} onClick={() => call("media_player", "toggle", {}, id)}>
          <TvSet on={on} color="#4ade80" width={170} />
        </div>
        <div style={{ paddingLeft: 8, minWidth: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{on ? (e?.attributes.source as string) || "An" : "Aus"}</div>
          <div className="sub">{(e?.attributes.media_title as string) || (isNa(e) ? "nicht erreichbar" : on ? "Läuft" : "Tippen zum Einschalten")}</div>
        </div>
      </div>
      <div className="row" style={{ justifyContent: "space-around", marginTop: 26 }}>
        <button className="btn round" onClick={() => call("media_player", "volume_down", {}, id)} disabled={!on}>
          <Icon icon="mdi:volume-minus" width={22} />
        </button>
        <button className="btn round" onClick={() => call("media_player", "media_previous_track", {}, id)} disabled={!on}>
          <Icon icon="mdi:skip-previous" width={22} />
        </button>
        <button className="btn big" style={{ background: "#22c55e", color: "#fff" }} onClick={() => call("media_player", on ? "media_play_pause" : "turn_on", {}, id)}>
          <Icon icon={on ? (e?.state === "playing" ? "mdi:pause" : "mdi:play") : "mdi:power"} width={34} />
        </button>
        <button className="btn round" onClick={() => call("media_player", "media_next_track", {}, id)} disabled={!on}>
          <Icon icon="mdi:skip-next" width={22} />
        </button>
        <button className="btn round" onClick={() => call("media_player", "volume_up", {}, id)} disabled={!on}>
          <Icon icon="mdi:volume-plus" width={22} />
        </button>
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="label-row">
          <span>Lautstärke</span>
          <span>{vol}%</span>
        </div>
        <Slider value={vol} onCommit={(v) => call("media_player", "volume_set", { volume_level: v / 100 }, id)} disabled={!on} gradient="linear-gradient(90deg,#16a34a,#4ade80)" />
      </div>
      <div className="eyebrow" style={{ margin: "22px 0 10px" }}>Quellen</div>
      <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
        {sources.length === 0 && <span className="sub">Keine Quellen gemeldet.</span>}
        {sources.slice(0, 10).map((s) => (
          <button key={s} className="chip" style={{ cursor: "pointer", fontSize: 14, padding: "8px 14px", borderColor: e?.attributes.source === s ? "#4ade80" : undefined }} onClick={() => call("media_player", "select_source", { source: s }, id)}>
            {s}
          </button>
        ))}
      </div>
      {conf.tv_plug && (
        <div className="row" style={{ marginTop: 18 }}>
          <span className="sub" style={{ flex: 1 }}>Steckdose Fernseher</span>
          <button className="btn" onClick={() => call(conf.tv_plug!.split(".")[0], "toggle", {}, conf.tv_plug)}>
            <Icon icon="mdi:power-socket-de" /> {isOn(plug) ? "Ausschalten" : "Einschalten"}
          </button>
        </div>
      )}
    </Card>
  );
}

export function ScenesPage() {
  const conf = useConf();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 20 }}>
      <RoundClock />
      <Zentrale />
      {conf.tv && <TvCard />}
    </div>
  );
}
