import { Card, Icon, Toggle } from "./ui";
import { call, isNa, isOn, useAll } from "./ha";
import { useConf } from "./config";

/* Kraftstoffpreise (z. B. Tankerkönig): günstigster Preis, Wunschpreis, Tankstellen im Vergleich. */

const fmt = (v: number) => v.toLocaleString("de-DE", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

/** Preis wie an der Zapfsäule: 2,10⁹ */
function PumpPrice({ v, size = 54 }: { v: number; size?: number }) {
  const s = fmt(v);
  return (
    <span className="mono" style={{ fontSize: size, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em" }}>
      {s.slice(0, -1)}
      <sup style={{ fontSize: size * 0.45, marginLeft: 1 }}>{s.slice(-1)}</sup>
      <span style={{ fontSize: size * 0.4, fontWeight: 500, marginLeft: 6, color: "var(--ink-2)" }}>€</span>
    </span>
  );
}

const statusOf = (sensorId: string) => sensorId.replace(/^sensor\./, "binary_sensor.").replace(/_(diesel|e5|e10|super_e10|super_e5|super)$/, "_status");

export function FuelCard() {
  const cfg = useConf().fuel;
  const all = useAll();
  if (!cfg) return null;
  const stations = (cfg.stations ?? [])
    .map((id) => {
      const e = all[id];
      const price = Number(e?.state);
      const st = all[statusOf(id)];
      const open = st ? isOn(st) : Number.isFinite(price);
      const name = [e?.attributes.brand, e?.attributes.city].filter(Boolean).join(" ") || String(e?.attributes.friendly_name ?? id);
      return { id, price, open: open && Number.isFinite(price), name, street: String(e?.attributes.street ?? "") };
    })
    .filter((s) => all[s.id]);
  const openSt = stations.filter((s) => s.open).sort((a, b) => a.price - b.price);
  const closed = stations.length - openSt.length;
  const best = cfg.cheapest && Number.isFinite(Number(all[cfg.cheapest]?.state)) ? Number(all[cfg.cheapest].state) : openSt[0]?.price;
  const bestName = (cfg.cheapest_station && all[cfg.cheapest_station]?.state) || openSt[0]?.name;
  const target = cfg.target ? Number(all[cfg.target]?.state) : NaN;
  const step = cfg.target ? Number(all[cfg.target]?.attributes.step ?? 0.01) : 0.01;
  const alarm = cfg.alarm ? all[cfg.alarm] : undefined;
  const diffCt = Number.isFinite(target) && best !== undefined ? Math.round((best - target) * 1000) / 10 : null;
  const max = openSt.length ? Math.max(...openSt.map((s) => s.price)) : 0;
  const min = openSt.length ? Math.min(...openSt.map((s) => s.price)) : 0;

  return (
    <Card>
      <div className="between">
        <div className="row">
          <span className="icon-chip" style={{ background: "rgba(250,204,21,.18)" }}>
            <Icon icon="mdi:gas-station" width={20} color="#facc15" />
          </span>
          <h2>{cfg.label ?? "Diesel"}</h2>
        </div>
        {closed > 0 && <span className="chip">{closed} zu</span>}
      </div>
      <div style={{ marginTop: 14 }}>
        {best !== undefined && Number.isFinite(best) ? <PumpPrice v={best} /> : <span className="sub">Kein Preis</span>}
        {bestName && (
          <div className="sub" style={{ marginTop: 6 }}>
            <Icon icon="mdi:map-marker-outline" style={{ verticalAlign: "-2px" }} /> {bestName}
          </div>
        )}
      </div>
      {diffCt !== null && (
        <div className="row" style={{ marginTop: 10, flexWrap: "wrap", gap: 6 }}>
          <span className={`chip ${diffCt <= 0 ? "ok" : "warn"}`}>
            {diffCt <= 0 ? `${Math.abs(diffCt).toLocaleString("de-DE")} ct unter Wunschpreis` : `${diffCt.toLocaleString("de-DE")} ct über Wunschpreis`}
          </span>
        </div>
      )}
      {cfg.target && Number.isFinite(target) && (
        <div className="list-row" style={{ marginTop: 12, padding: "8px 10px" }}>
          <span style={{ flex: 1, fontSize: 14 }}>Wunschpreis</span>
          <button className="btn round" style={{ width: 34, height: 34 }} onClick={() => call("input_number", "set_value", { value: Math.round((target - step) * 1000) / 1000 }, cfg.target)} title="günstiger">
            <Icon icon="mdi:minus" />
          </button>
          <span className="mono" style={{ minWidth: 64, textAlign: "center", fontSize: 16 }}>{fmt(target)}</span>
          <button className="btn round" style={{ width: 34, height: 34 }} onClick={() => call("input_number", "set_value", { value: Math.round((target + step) * 1000) / 1000 }, cfg.target)} title="teurer">
            <Icon icon="mdi:plus" />
          </button>
        </div>
      )}
      {alarm && (
        <div className="list-row" style={{ padding: "8px 10px" }}>
          <Icon icon="mdi:bell-ring-outline" width={18} className="muted" />
          <span style={{ flex: 1, fontSize: 14 }}>Preisalarm</span>
          <Toggle on={isOn(alarm)} na={isNa(alarm)} onClick={() => call("automation", "toggle", {}, cfg.alarm)} />
        </div>
      )}
      {openSt.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {openSt.slice(0, cfg.show ?? 5).map((s, i) => {
            const w = max > min ? 30 + ((max - s.price) / (max - min)) * 70 : 100;
            return (
              <div key={s.id} style={{ marginBottom: 8 }}>
                <div className="between" style={{ fontSize: 13.5 }}>
                  <span style={{ minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: i === 0 ? "#bbf7d0" : "var(--ink-2)" }} title={s.street}>
                    {s.name}
                  </span>
                  <span className="mono" style={{ color: i === 0 ? "#4ade80" : "var(--ink)" }}>{fmt(s.price)}</span>
                </div>
                <div className="bar" style={{ height: 5, marginTop: 4 }}>
                  <i style={{ width: `${w}%`, background: i === 0 ? "#4ade80" : "rgba(250,204,21,.7)" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
