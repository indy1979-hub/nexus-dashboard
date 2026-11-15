import { Card, Icon, Seg } from "../ui";
import { VacuumDock } from "../illus";
import { call, isNa, useEnt, type CalEvent } from "../ha";
import { useConf } from "../config";
import { FuelCard } from "../fuel";
import { ClockWeather, EventsCard, LightRoom, MuellList, PickupTrack, PlugsCard, TasksCard, TvBar } from "../common";

const VAC_STATE: Record<string, string> = {
  docked: "Angedockt",
  cleaning: "Saugt",
  returning: "Fährt zur Station",
  paused: "Pausiert",
  idle: "Bereit",
  error: "Fehler",
  unavailable: "Offline",
};

export function RobiCard() {
  const conf = useConf();
  const vid = conf.vacuum!;
  const e = useEnt(conf.vacuum);
  const st = e?.state ?? "unavailable";
  const speeds = (e?.attributes.fan_speed_list as string[] | undefined) ?? [];
  const battery = e?.attributes.battery_level as number | undefined;
  const cleaning = st === "cleaning";
  return (
    <Card>
      <div className="between">
        <h2>{conf.vacuum_name ?? "Saugroboter"}</h2>
        <Icon icon="mdi:robot-vacuum" width={22} className="muted" />
      </div>
      <div className="eyebrow" style={{ marginTop: 4 }}>
        {(e?.attributes.friendly_name as string) ?? "Saugroboter"}
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <span className={`chip ${st === "error" ? "bad" : cleaning ? "warn" : "ok"}`}>
          ● {VAC_STATE[st] ?? st}
          {battery !== undefined ? ` · ${battery}%` : ""}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <VacuumDock active={cleaning} />
      </div>
      {speeds.length > 0 && (
        <>
          <div className="label-row" style={{ marginTop: 6 }}>
            <span>Saugstufe</span>
          </div>
          <Seg options={speeds} value={e?.attributes.fan_speed as string} onChange={(v) => call("vacuum", "set_fan_speed", { fan_speed: v }, vid)} />
        </>
      )}
      <div className="row" style={{ marginTop: 12, flexWrap: "wrap" }}>
        <button className="btn" style={{ flex: 1 }} disabled={isNa(e)} onClick={() => call("vacuum", cleaning ? "pause" : "start", {}, vid)}>
          <Icon icon={cleaning ? "mdi:pause" : "mdi:play"} /> {cleaning ? "Pause" : "Saugen"}
        </button>
        <button className="btn" style={{ flex: 1 }} disabled={isNa(e)} onClick={() => call("vacuum", "return_to_base", {}, vid)}>
          <Icon icon="mdi:home-import-outline" /> Zur Station
        </button>
        <button className="btn" disabled={isNa(e)} onClick={() => call("vacuum", "locate", {}, vid)} title="Robi piepen lassen">
          <Icon icon="mdi:map-marker-radius-outline" />
        </button>
      </div>
    </Card>
  );
}

export function HomePage({ events }: { events: CalEvent[] }) {
  const conf = useConf();
  const rooms = conf.rooms ?? [];
  const lightRooms = rooms.filter((r) => (r.lights ?? []).length > 0);
  const plugRooms = rooms.filter((r) => (r.switches ?? []).length > 0);
  const colA = lightRooms.filter((_, i) => i % 2 === 0);
  const colB = lightRooms.filter((_, i) => i % 2 === 1);
  return (
    <div className="frame">
      <div className="board home-board">
        <div className="stack" style={{ gridColumn: 1, gridRow: "1 / span 2" }}>
          <ClockWeather />
          <MuellList />
        </div>
        <div className="stack" style={{ gridColumn: 2, gridRow: 1 }}>
          {colA.map((r) => (
            <LightRoom key={r.id} room={r} />
          ))}
        </div>
        <div className="stack" style={{ gridColumn: 3, gridRow: 1 }}>
          {colB.map((r) => (
            <LightRoom key={r.id} room={r} />
          ))}
          {conf.vacuum && <RobiCard />}
        </div>
        <div className="stack" style={{ gridColumn: 4, gridRow: 1 }}>
          {conf.fuel && <FuelCard />}
          {plugRooms.map((r) => (
            <PlugsCard key={r.id} room={r} compact />
          ))}
        </div>
        <div className="stack" style={{ gridColumn: 5, gridRow: "1 / span 2" }}>
          <EventsCard events={events} />
          <PickupTrack />
          <TasksCard />
        </div>
        <div className="wide" style={{ gridRow: 2 }}>
          <TvBar />
        </div>
      </div>
    </div>
  );
}
