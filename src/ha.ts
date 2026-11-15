import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { CalendarConf, TodoConf } from "./config";

/* ---------- Anbindung an das hass-Objekt, das Home Assistant jeder Karte übergibt ---------- */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}
interface Connection {
  subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>): Promise<() => void>;
}
export interface Hass {
  states: Record<string, HassEntity>;
  connected?: boolean;
  connection: Connection;
  callService(domain: string, service: string, data?: Record<string, unknown>, target?: Record<string, unknown>): Promise<unknown>;
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callApi<T>(method: string, path: string): Promise<T>;
}

let current: Hass | null = null;
const listeners = new Set<() => void>();
export function setHass(h: Hass) {
  current = h;
  listeners.forEach((l) => l());
}
export const getHass = () => current;
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
function useSel<T>(sel: (h: Hass | null) => T): T {
  return useSyncExternalStore(subscribe, () => sel(current));
}

/** Ein Zustand aus Home Assistant (oder undefined, wenn es die Entität nicht gibt). */
export const useEnt = (id?: string): HassEntity | undefined => useSel((h) => (id ? h?.states[id] : undefined));
/** Alle Zustände – nur für Übersichten. */
const EMPTY: Record<string, HassEntity> = {};
export const useAll = (): Record<string, HassEntity> => useSel((h) => h?.states ?? EMPTY);
export const useConnected = () => useSel((h) => h?.connected !== false);

/** Dienst in Home Assistant aufrufen. */
export async function call(domain: string, service: string, data: Record<string, unknown> = {}, entityId?: string | string[]) {
  if (!current) return;
  try {
    await current.callService(domain, service, data, entityId ? { entity_id: entityId } : undefined);
  } catch (e) {
    console.warn("[Nexus] Dienstaufruf fehlgeschlagen", domain, service, e);
  }
}
export const useCall = () => call;

/* ---------- Wetter-Vorhersage ---------- */
export interface Forecast {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
  precipitation_probability?: number;
}
export function useForecast(entity?: string, type: "daily" | "hourly" = "daily") {
  const [fc, setFc] = useState<Forecast[]>([]);
  const ready = useSel((h) => !!h);
  useEffect(() => {
    if (!entity || !current) return;
    let unsub: (() => void) | undefined;
    let alive = true;
    current.connection
      .subscribeMessage<{ forecast: Forecast[] }>((m) => alive && setFc(m.forecast ?? []), { type: "weather/subscribe_forecast", forecast_type: type, entity_id: entity })
      .then((u) => {
        if (alive) unsub = u;
        else u();
      })
      .catch(() => setFc([]));
    return () => {
      alive = false;
      unsub?.();
    };
  }, [entity, type, ready]);
  return fc;
}

export const isOn = (e?: HassEntity) => !!e && (e.state === "on" || e.state === "playing" || e.state === "cleaning");
export const isNa = (e?: HassEntity) => !e || e.state === "unavailable" || e.state === "unknown";
export const name = (e: HassEntity | undefined, fallback: string) => (e?.attributes.friendly_name as string) || fallback;

/* ---------- Kalender ---------- */
export interface CalEvent {
  summary: string;
  start: Date;
  end: Date;
  allDay: boolean;
  calendar: string;
  color: string;
}
interface RawEvent {
  summary: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
}
const parseDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const PALETTE = ["#60a5fa", "#f87171", "#4ade80", "#fbbf24", "#a78bfa", "#f472b6"];

export function useCalendarEvents(calendars: CalendarConf[], days = 14): CalEvent[] {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const ready = useSel((h) => !!h);
  const key = calendars.map((c) => c.entity).join(",");
  useEffect(() => {
    if (!ready || !calendars.length) return;
    let alive = true;
    const load = async () => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start.getTime() + days * 86400000);
      const q = `start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;
      const all: CalEvent[] = [];
      await Promise.all(
        calendars.map(async (c, i) => {
          let list: RawEvent[] = [];
          try {
            list = (await current!.callApi<RawEvent[]>("GET", `calendars/${c.entity}?${q}`)) ?? [];
          } catch {
            list = [];
          }
          list.forEach((ev) => {
            const allDay = !!ev.start.date;
            all.push({
              summary: ev.summary,
              allDay,
              start: allDay ? parseDay(ev.start.date!) : new Date(ev.start.dateTime!),
              end: allDay ? parseDay(ev.end.date!) : new Date(ev.end.dateTime ?? ev.start.dateTime!),
              calendar: c.label,
              color: c.color ?? PALETTE[i % PALETTE.length],
            });
          });
        }),
      );
      all.sort((a, b) => a.start.getTime() - b.start.getTime());
      if (alive) setEvents(all);
    };
    load();
    const t = setInterval(load, 10 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, key, days]);
  return events;
}

/* ---------- Aufgabenlisten ---------- */
export interface TodoItem {
  uid: string;
  summary: string;
  status: "needs_action" | "completed";
  due?: string;
}
export function useTodo(list?: TodoConf) {
  const entityId = list?.entity;
  const ent = useEnt(entityId);
  const [items, setItems] = useState<TodoItem[]>([]);
  const reload = useCallback(async () => {
    if (!current || !entityId) return;
    try {
      const r = await current.callWS<{ items: TodoItem[] }>({ type: "todo/item/list", entity_id: entityId });
      setItems(r.items ?? []);
    } catch {
      setItems([]);
    }
  }, [entityId]);
  useEffect(() => {
    reload();
  }, [reload, ent?.state, ent?.last_updated]);
  return {
    items,
    add: async (text: string) => {
      await call("todo", "add_item", { item: text }, entityId);
      setTimeout(reload, 400);
    },
    toggle: async (it: TodoItem) => {
      await call("todo", "update_item", { item: it.uid, status: it.status === "completed" ? "needs_action" : "completed" }, entityId);
      setTimeout(reload, 400);
    },
    remove: async (it: TodoItem) => {
      await call("todo", "remove_item", { item: [it.uid] }, entityId);
      setTimeout(reload, 400);
    },
  };
}

/* ---------- Licht ---------- */
export function hsToRgb(h: number, s: number, v = 100): string {
  s /= 100;
  v /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => v - v * s * Math.max(Math.min(k(n), 4 - k(n), 1), 0);
  return `rgb(${Math.round(f(5) * 255)}, ${Math.round(f(3) * 255)}, ${Math.round(f(1) * 255)})`;
}
export function lightColor(e?: HassEntity): string {
  if (!isOn(e)) return "#3a4a46";
  const rgb = e!.attributes.rgb_color as number[] | undefined;
  if (rgb) return `rgb(${rgb.join(",")})`;
  const hs = e!.attributes.hs_color as number[] | undefined;
  if (hs) return hsToRgb(hs[0], hs[1]);
  return "#ffd9a0";
}

/* ---------- Zeit ---------- */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
export const fmtTime = (d: Date) => d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
export const fmtDay = (d: Date) => d.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
export const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const dayDiff = (d: Date, from = new Date()) => {
  const a = new Date(from);
  a.setHours(0, 0, 0, 0);
  const b = new Date(d);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
};
export const relDay = (n: number) => (n === 0 ? "heute" : n === 1 ? "morgen" : n === 2 ? "übermorgen" : n < 0 ? `vor ${-n} Tagen` : `in ${n} Tagen`);

/** Wert merken, solange der Nutzer zieht, damit der Regler nicht springt. */
export function useDragValue(value: number) {
  const [v, setV] = useState(value);
  const dragging = useRef(false);
  useEffect(() => {
    if (!dragging.current) setV(value);
  }, [value]);
  return useMemo(() => ({ v, setV, dragging }), [v]);
}

/** "01.12.2026" oder "2026-12-01" -> Date */
export const parseDate = (s?: string) => {
  if (!s) return null;
  let m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  return null;
};
