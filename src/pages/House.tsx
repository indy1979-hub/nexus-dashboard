import { useMemo, useState } from "react";
import { Card, Icon, Slider, Toggle } from "../ui";
import { call, isNa, isOn, lightColor, useAll, useRegistry, type HassEntity } from "../ha";
import { SWATCHES } from "../common";
import { useConf } from "../config";
import { HaCard } from "../hacard";

type Filter = "alle" | "lampen" | "verbraucher" | "an";

const match = (id: string, pattern: string) =>
  pattern.includes("*") ? new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`).test(id) : id === pattern;

const COLOR_MODES = ["hs", "xy", "rgb", "rgbw", "rgbww"];
const RAINBOW = "linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)";

/** Helligkeit, Farbe und Weißton einer einzelnen Lampe. */
function LightControls({ e }: { e: HassEntity }) {
  const id = e.entity_id;
  const modes = (e.attributes.supported_color_modes as string[] | undefined) ?? [];
  const canColor = modes.some((m) => COLOR_MODES.includes(m));
  const canTemp = modes.includes("color_temp");
  const canDim = modes.some((m) => m !== "onoff");
  const on = isOn(e);
  const bri = on ? Math.round(((e.attributes.brightness as number) ?? 255) / 2.55) : 0;
  const hs = e.attributes.hs_color as number[] | undefined;
  const hue = hs ? Math.round((hs[0] / 360) * 100) : 0;
  const kMin = (e.attributes.min_color_temp_kelvin as number) ?? 2000;
  const kMax = (e.attributes.max_color_temp_kelvin as number) ?? 6500;
  const k = (e.attributes.color_temp_kelvin as number) ?? kMin;
  const kPos = Math.round(((k - kMin) / Math.max(1, kMax - kMin)) * 100);
  const swatches = SWATCHES.filter((s) => ("hs_color" in s.data ? canColor : canTemp));
  if (!canDim && !canColor && !canTemp) return <div className="sub">Diese Lampe kann nur an und aus.</div>;
  return (
    <div className="col" style={{ gap: 12, padding: "4px 2px 2px" }}>
      {canDim && (
        <div>
          <div className="label-row">
            <span>Helligkeit</span>
            <span className="mono">{bri}%</span>
          </div>
          <Slider
            value={bri}
            gradient={`linear-gradient(90deg, rgba(255,255,255,.15), ${on ? lightColor(e) : "#9ca3af"})`}
            onCommit={(v) => (v === 0 ? call("light", "turn_off", {}, id) : call("light", "turn_on", { brightness_pct: v }, id))}
          />
        </div>
      )}
      {canColor && (
        <div>
          <div className="label-row">
            <span>Farbe</span>
            <span className="mono">{hs && e.attributes.color_mode !== "color_temp" ? `${Math.round(hs[0])}°` : "–"}</span>
          </div>
          <Slider value={hue} gradient={RAINBOW} onCommit={(v) => call("light", "turn_on", { hs_color: [Math.round((v / 100) * 360) % 360, 100] }, id)} />
        </div>
      )}
      {canTemp && (
        <div>
          <div className="label-row">
            <span>Weißton</span>
            <span className="mono">{e.attributes.color_mode === "color_temp" ? `${k} K` : "–"}</span>
          </div>
          <Slider
            value={kPos}
            gradient="linear-gradient(90deg,#ffb35c,#fff1dc,#dbe8ff)"
            onCommit={(v) => call("light", "turn_on", { color_temp_kelvin: Math.round(kMin + (v / 100) * (kMax - kMin)) }, id)}
          />
        </div>
      )}
      {swatches.length > 0 && (
        <div className="swatches" style={{ marginTop: 2 }}>
          {swatches.map((s) => (
            <div key={s.label} title={s.label} className="swatch" style={{ background: s.css, color: s.css }} onClick={() => call("light", "turn_on", s.data, id)} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Alle Lampen und Verbraucher, nach Bereichen gruppiert. */
function Switchboard() {
  const conf = useConf();
  const all = useAll();
  const { entities, devices, areas } = useRegistry();
  const [filter, setFilter] = useState<Filter>("alle");
  const [open, setOpen] = useState<string | null>(null);

  const groups = useMemo(() => {
    const exclude = conf.switchboard_exclude ?? [];
    const list = Object.values(all).filter((e) => {
      const dom = e.entity_id.split(".")[0];
      if (dom !== "light" && dom !== "switch") return false;
      const reg = entities[e.entity_id];
      if (reg?.hidden || reg?.entity_category) return false;
      if (reg?.platform === "adaptive_lighting" || reg?.platform === "group") return false;
      if (Array.isArray(e.attributes.entity_id)) return false; // Gruppen
      if (exclude.some((p) => match(e.entity_id, p))) return false;
      return true;
    });
    const byArea = new Map<string, { name: string; items: HassEntity[] }>();
    list.forEach((e) => {
      const reg = entities[e.entity_id];
      const areaId = reg?.area_id || (reg?.device_id ? devices[reg.device_id]?.area_id : null) || "_";
      const nm = areaId === "_" ? "Ohne Raum" : areas[areaId]?.name ?? areaId;
      if (!byArea.has(areaId)) byArea.set(areaId, { name: nm, items: [] });
      byArea.get(areaId)!.items.push(e);
    });
    return [...byArea.entries()]
      .map(([id, g]) => ({ id, ...g, items: g.items.sort((a, b) => String(a.attributes.friendly_name).localeCompare(String(b.attributes.friendly_name), "de")) }))
      .sort((a, b) => (a.id === "_" ? 1 : b.id === "_" ? -1 : a.name.localeCompare(b.name, "de")));
  }, [all, entities, devices, areas, conf.switchboard_exclude]);

  const visible = (e: HassEntity) =>
    filter === "alle" || (filter === "lampen" && e.entity_id.startsWith("light.")) || (filter === "verbraucher" && e.entity_id.startsWith("switch.")) || (filter === "an" && isOn(e));
  const allItems = groups.flatMap((g) => g.items);
  const lights = allItems.filter((e) => e.entity_id.startsWith("light.") && !isNa(e));
  const plugs = allItems.filter((e) => e.entity_id.startsWith("switch.") && !isNa(e));
  const strip = (name: string, area: string) => (name.toLowerCase().startsWith(area.toLowerCase() + " ") ? name.slice(area.length + 1) : name);

  return (
    <Card style={{ display: "flex", flexDirection: "column", background: "rgba(22, 18, 40, .78)" }}>
      <div className="between" style={{ flexWrap: "wrap" }}>
        <div className="section-title" style={{ margin: 0 }}>
          <span className="icon-chip" style={{ background: "rgba(250,204,21,.2)" }}>
            <Icon icon="mdi:light-switch" width={20} color="#facc15" />
          </span>
          Schaltzentrale
        </div>
        <div className="row" style={{ gap: 6 }}>
          <span className="chip ok">
            <Icon icon="mdi:lightbulb-on-outline" /> {lights.filter(isOn).length}/{lights.length}
          </span>
          <span className="chip">
            <Icon icon="mdi:power-socket-de" /> {plugs.filter(isOn).length}/{plugs.length}
          </span>
        </div>
      </div>
      <div className="row" style={{ marginTop: 14, gap: 8, flexWrap: "wrap" }}>
        <button className="btn" onClick={() => call("light", "turn_off", {}, lights.filter(isOn).map((e) => e.entity_id))} disabled={!lights.some(isOn)}>
          <Icon icon="mdi:lightbulb-off-outline" /> Alle Lampen aus
        </button>
        <button className="btn" onClick={() => call("switch", "turn_off", {}, plugs.filter(isOn).map((e) => e.entity_id))} disabled={!plugs.some(isOn)}>
          <Icon icon="mdi:power-plug-off-outline" /> Alle Verbraucher aus
        </button>
      </div>
      <div className="seg" style={{ marginTop: 12 }}>
        {(["alle", "lampen", "verbraucher", "an"] as Filter[]).map((f) => (
          <button key={f} className={f === filter ? "sel blue" : ""} onClick={() => setFilter(f)}>
            {{ alle: "Alle", lampen: "Lampen", verbraucher: "Verbraucher", an: "Nur an" }[f]}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 14, overflowY: "auto", maxHeight: "calc(100vh - 330px)", minHeight: 300, paddingRight: 4 }}>
        {groups.map((g) => {
          const items = g.items.filter(visible);
          if (!items.length) return null;
          const onIds = items.filter(isOn).map((e) => e.entity_id);
          return (
            <div key={g.id} style={{ marginBottom: 16 }}>
              <div className="between" style={{ margin: "0 4px 8px" }}>
                <span className="eyebrow" style={{ color: "var(--ink-2)" }}>
                  {g.name} · {onIds.length}/{items.length} an
                </span>
                {onIds.length > 0 && (
                  <button className="chip" style={{ cursor: "pointer" }} onClick={() => call("homeassistant", "turn_off", {}, onIds)}>
                    alle aus
                  </button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8 }}>
                {items.map((e) => {
                  const light = e.entity_id.startsWith("light.");
                  const on = isOn(e);
                  const expanded = open === e.entity_id;
                  const modes = (e.attributes.supported_color_modes as string[] | undefined) ?? [];
                  const adjustable = light && !isNa(e) && modes.some((m) => m !== "onoff");
                  const bri = light && on && e.attributes.brightness !== undefined ? Math.round((e.attributes.brightness as number) / 2.55) : null;
                  return (
                    <div
                      key={e.entity_id}
                      className="list-row"
                      style={{
                        margin: 0, padding: "9px 12px", display: "block",
                        gridColumn: expanded ? "1 / -1" : undefined,
                        background: on ? (light ? "rgba(250,204,21,.14)" : "rgba(94,234,212,.12)") : undefined,
                        borderColor: expanded ? "rgba(255,255,255,.45)" : on ? (light ? "rgba(250,204,21,.4)" : "rgba(94,234,212,.35)") : undefined,
                      }}
                    >
                      <div className="row">
                        <Icon
                          icon={light ? (on ? "mdi:lightbulb-on" : "mdi:lightbulb-outline") : e.entity_id.includes("usb") ? "mdi:usb-port" : "mdi:power-socket-de"}
                          width={20}
                          color={on ? (light ? lightColor(e) : "#5eead4") : undefined}
                        />
                        <span
                          onClick={() => adjustable && setOpen(expanded ? null : e.entity_id)}
                          style={{ flex: 1, minWidth: 0, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: isNa(e) ? 0.5 : 1, cursor: adjustable ? "pointer" : "default" }}
                          title={adjustable ? "Tippen: Helligkeit und Farbe" : undefined}
                        >
                          {strip(String(e.attributes.friendly_name ?? e.entity_id), g.name)}
                          {bri !== null && <span className="muted" style={{ marginLeft: 6, fontSize: 12 }}>{bri}%</span>}
                        </span>
                        {adjustable && (
                          <Icon
                            icon={expanded ? "mdi:chevron-up" : "mdi:tune-variant"}
                            width={18}
                            className="muted"
                            style={{ cursor: "pointer", flex: "0 0 auto" }}
                            onClick={() => setOpen(expanded ? null : e.entity_id)}
                          />
                        )}
                        <Toggle on={on} na={isNa(e)} onClick={() => call(light ? "light" : "switch", "toggle", {}, e.entity_id)} />
                      </div>
                      {expanded && (
                        <div style={{ marginTop: 10 }}>
                          <LightControls e={e} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function HousePage() {
  const conf = useConf();
  const cards = conf.house_cards ?? [];
  return (
    <div className="house-grid">
      <div className="col" style={{ gap: 18, minWidth: 0 }}>
        {cards.map((c, i) => (
          <Card key={i} style={{ padding: 0 }}>
            {c.title && (
              <div className="row" style={{ padding: "16px 20px 10px" }}>
                <span className="icon-chip">
                  <Icon icon={c.icon ?? "mdi:view-dashboard-outline"} width={20} />
                </span>
                <h3 style={{ fontSize: 20 }}>{c.title}</h3>
              </div>
            )}
            <HaCard config={c.card} />
          </Card>
        ))}
        {cards.length === 0 && (
          <Card>
            <div className="sub">Unter „house_cards“ lassen sich hier beliebige Home-Assistant-Karten einbinden, z. B. Lageplan oder Grundriss.</div>
          </Card>
        )}
      </div>
      <Switchboard />
    </div>
  );
}
