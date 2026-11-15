import { useRef, useState, type ReactNode } from "react";
import { Icon } from "./ui";
import { useCalendarEvents, useConnected } from "./ha";
import { useConf } from "./config";
import { Autumn, Campfire, RainGarden, River, Space } from "./scenes";
import { HomePage } from "./pages/Home";
import { WeekPage } from "./pages/Week";
import { ScenesPage } from "./pages/Scenes";
import { LagePage } from "./pages/Lage";
import { NetworkPage } from "./pages/Network";

type PageId = "zuhause" | "woche" | "abend" | "lage" | "netz";

const PAGES: { id: PageId; label: string; icon: string; scene: () => ReactNode }[] = [
  { id: "zuhause", label: "Zuhause", icon: "mdi:home-outline", scene: () => <RainGarden /> },
  { id: "woche", label: "Woche", icon: "mdi:calendar-week-outline", scene: () => <Autumn /> },
  { id: "abend", label: "Abend", icon: "mdi:campfire", scene: () => <Campfire /> },
  { id: "lage", label: "Lage", icon: "mdi:waves", scene: () => <River /> },
  { id: "netz", label: "Netz", icon: "mdi:graph-outline", scene: () => <Space /> },
];

const KEY = "nexus-dashboard-page";
const loadPage = (): PageId => {
  try {
    const p = localStorage.getItem(KEY) as PageId | null;
    if (p && PAGES.some((x) => x.id === p)) return p;
  } catch {
    /* Speicher nicht verfügbar */
  }
  return "zuhause";
};

export function App() {
  const conf = useConf();
  const [page, setPage] = useState<PageId>(loadPage);
  const connected = useConnected();
  const events = useCalendarEvents(conf.calendars ?? [], 14);
  const shell = useRef<HTMLDivElement>(null);

  const go = (id: PageId) => {
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
  const current = PAGES.find((p) => p.id === page)!;

  return (
    <div className="shell" ref={shell}>
      {current.scene()}
      <nav className="rail">
        <div className={`rail-dot ${connected ? "" : "off"}`} title={connected ? "Verbunden" : "Verbindung getrennt"} />
        <div style={{ height: 8 }} />
        {PAGES.map((p) => (
          <button key={p.id} className={`rail-btn ${p.id === page ? "active" : ""}`} onClick={() => go(p.id)} title={p.label} aria-label={p.label}>
            <Icon icon={p.icon} width={24} />
          </button>
        ))}
        <div className="spacer" />
        <button className="rail-btn" onClick={fullscreen} title="Vollbild ein/aus" aria-label="Vollbild">
          <Icon icon="mdi:fullscreen" width={24} />
        </button>
      </nav>
      <main className="stage" key={page}>
        {page === "zuhause" && <HomePage events={events} />}
        {page === "woche" && <WeekPage events={events} />}
        {page === "abend" && <ScenesPage />}
        {page === "lage" && <LagePage />}
        {page === "netz" && <NetworkPage events={events} />}
      </main>
    </div>
  );
}
