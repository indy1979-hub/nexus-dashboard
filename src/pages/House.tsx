import { useMemo, useState } from "react";
import { Card, Icon, Toggle } from "../ui";
import { call, isNa, isOn, useAll, useRegistry, type HassEntity } from "../ha";
import { useConf } from "../config";
import { HaCard } from "../hacard";

type Filter = "alle" | "lampen" | "verbraucher" | "an";

const match = (id: string, pattern: string) =>
  pattern.includes("*") ? new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`).test(id) : id === pattern;

/** Alle Lampen und Verbraucher, nach Bereichen gruppiert. */
function Switchboard() {
  const conf = useConf();
  const all = useAll();
  const { entities, devices, areas } = useRegistry();
  const [filter, setFilter] = useState<Filter>("alle");

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
    <Card style={{ display: "flex", flexDirection: "column" }}>
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
                  return (
                    <div
                      key={e.entity_id}
                      className="list-row"
                      style={{ margin: 0, padding: "9px 12px", background: on ? (light ? "rgba(250,204,21,.14)" : "rgba(94,234,212,.12)") : undefined, borderColor: on ? (light ? "rgba(250,204,21,.4)" : "rgba(94,234,212,.35)") : undefined }}
                    >
                      <Icon icon={light ? (on ? "mdi:lightbulb-on" : "mdi:lightbulb-outline") : e.entity_id.includes("usb") ? "mdi:usb-port" : "mdi:power-socket-de"} width={20} color={on ? (light ? "#facc15" : "#5eead4") : undefined} />
                      <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: isNa(e) ? 0.5 : 1 }}>
                        {strip(String(e.attributes.friendly_name ?? e.entity_id), g.name)}
                      </span>
                      <Toggle on={on} na={isNa(e)} onClick={() => call(light ? "light" : "switch", "toggle", {}, e.entity_id)} />
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
