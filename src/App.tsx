import { useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "./ui";
import { isOn, useAll, useCalendarEvents, useConnected } from "./ha";
import { useConf, type ExtraPageConf } from "./config";
import { Aurora, Autumn, Campfire, Dusk, RainGarden, River, Space } from "./scenes";
import { HomePage } from "./pages/Home";
import { HousePage } from "./pages/House";
import { WeekPage } from "./pages/Week";
import { ScenesPage } from "./pages/Scenes";
import { LagePage } from "./pages/Lage";
import { NetworkPage } from "./pages/Network";
import { ExtraPage } from "./pages/Extra";

interface PageDef {
  id: string;
  label: string;
  icon: string;
  scene: () => ReactNode;
  extra?: ExtraPageConf;
}

/** Fenster im Haus leuchten je nach Anteil eingeschalteter Lampen. */
function DuskLive() {
  const all = useAll();
  const lights = Object.values(all).filter((e) => e.entity_id.startsWith("light.") && !Array.isArray(e.attributes.entity_id));
  const ratio = lights.length ? lights.filter(isOn).length / lights.length : 0;
  return <Dusk litRatio={ratio} />;
}

const SCENES: Record<string, () => ReactNode> = {
  aurora: () => <Aurora />,
  rain: () => <RainGarden />,
  autumn: () => <Autumn />,
  campfire: () => <Campfire />,
  river: () => <River />,
  space: () => <Space />,
  dusk: () => <DuskLive />,
};

const BASE: PageDef[] = [
  { id: "zuhause", label: "Zuhause", icon: "mdi:home-outline", scene: SCENES.rain },
  { id: "haus", label: "Haus", icon: "mdi:floor-plan", scene: SCENES.dusk },
  { id: "woche", label: "Woche", icon: "mdi:calendar-week-outline", scene: SCENES.autumn },
  { id: "abend", label: "Abend", icon: "mdi:campfire", scene: SCENES.campfire },
  { id: "lage", label: "Lage", icon: "mdi:waves", scene: SCENES.river },
  { id: "netz", label: "Netz", icon: "mdi:graph-outline", scene: SCENES.space },
];

const KEY = "nexus-dashboard-page";

export function App() {
  const conf = useConf();
  const pages = useMemo<PageDef[]>(() => {
    const extra = (conf.extra_pages ?? []).map<PageDef>((p) => ({
      id: `x-${p.id}`,
      label: p.label,
      icon: p.icon ?? "mdi:view-dashboard-outline",
      scene: SCENES[p.scene ?? "aurora"] ?? SCENES.aurora,
      extra: p,
    }));
    const i = BASE.findIndex((p) => p.id === "haus") + 1;
    return [...BASE.slice(0, i), ...extra, ...BASE.slice(i)];
  }, [conf.extra_pages]);

  const [page, setPage] = useState<string>(() => {
    try {
      return localStorage.getItem(KEY) ?? "zuhause";
    } catch {
      return "zuhause";
    }
  });
  const connected = useConnected();
  const events = useCalendarEvents(conf.calendars ?? [], 14);
  const shell = useRef<HTMLDivElement>(null);

  const go = (id: string) => {
    setPage(id);
    try {
      localStorage.setItem(KEY, id);
    } catch {
      /* egal */
    }
  };
  const fullscreen = () => {
    const el = shell.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.().catch(() => undefined);
  };
  const current = pages.find((p) => p.id === page) ?? pages[0];

  return (
    <div className="shell" ref={shell}>
      {current.scene()}
      <nav className="rail">
        <div className={`rail-dot ${connected ? "" : "off"}`} title={connected ? "Verbunden" : "Verbindung getrennt"} />
        <div style={{ height: 8 }} />
        {pages.map((p) => (
          <button key={p.id} className={`rail-btn ${p.id === current.id ? "active" : ""}`} onClick={() => go(p.id)} title={p.label} aria-label={p.label}>
            <Icon icon={p.icon} width={24} />
          </button>
        ))}
        <div className="spacer" />
        <button className="rail-btn" onClick={fullscreen} title="Vollbild ein/aus" aria-label="Vollbild">
          <Icon icon="mdi:fullscreen" width={24} />
        </button>
      </nav>
      <main className="stage" key={current.id}>
        {current.id === "zuhause" && <HomePage events={events} />}
        {current.id === "haus" && <HousePage />}
        {current.extra && <ExtraPage page={current.extra} />}
        {current.id === "woche" && <WeekPage events={events} />}
        {current.id === "abend" && <ScenesPage />}
        {current.id === "lage" && <LagePage />}
        {current.id === "netz" && <NetworkPage events={events} />}
      </main>
    </div>
  );
}
