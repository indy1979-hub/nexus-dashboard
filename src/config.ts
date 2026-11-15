import { createContext, useContext } from "react";

/* Alle hausbezogenen Angaben kommen aus der Kartenkonfiguration in Home Assistant.
   Im Code stehen keine persönlichen Daten. */

export interface RoomConf {
  id: string;
  title: string;
  icon?: string;
  /** Darstellung der Lichtkarte */
  style?: "pendant" | "twin" | "stairs";
  lights?: string[];
  switches?: string[];
  camera?: string;
}
export interface CalendarConf { entity: string; label: string; color?: string }
export interface TodoConf { entity: string; label: string; color?: string }
export interface WasteConf { entity: string; date?: string; name: string; icon?: string; color?: string }
export interface ActionConf { entity: string; label: string; icon?: string; color?: string; domain?: string; service?: string; data?: Record<string, unknown> }

export interface NexusConfig {
  type?: string;
  title?: string;
  location?: string;
  address?: string;
  person?: string;
  weather?: string;
  tv?: string;
  tv_plug?: string;
  tv_room?: string;
  vacuum?: string;
  vacuum_name?: string;
  all_lights?: string;
  phone_battery_match?: string;
  night_room?: string;
  rooms?: RoomConf[];
  calendars?: CalendarConf[];
  todos?: TodoConf[];
  waste?: WasteConf[];
  routines?: ActionConf[];
  night_actions?: ActionConf[];
  house_switches?: ActionConf[];
  emergency?: string;
  emergency_reset?: string;
  warnings?: { region?: string; level?: string; prelevel?: string; alerts?: string[]; motion?: { entity: string; label: string } };
  gauge?: { entity: string; name: string; yellow?: string; red?: string };
  sky?: { dawn?: string; rising?: string; setting?: string; dusk?: string; moon_phase?: string; moon_elevation?: string };
  cameras?: { entity: string; title: string }[];
  /** Beliebige Home-Assistant-Karten für die Seite „Haus“ (z. B. Lageplan, Grundriss) */
  house_cards?: { title?: string; icon?: string; card: Record<string, unknown> }[];
  /** Kraftstoffpreise, z. B. aus Tankerkönig */
  fuel?: { label?: string; cheapest?: string; cheapest_station?: string; target?: string; alarm?: string; stations?: string[]; show?: number };
  /** Schaltzentrale: Entitäten oder Muster (mit *) ausblenden */
  switchboard_exclude?: string[];
}

export const ConfContext = createContext<NexusConfig>({});
export const useConf = () => useContext(ConfContext);

const PALETTE = ["#60a5fa", "#f87171", "#4ade80", "#fbbf24", "#a78bfa", "#f472b6", "#2dd4bf", "#fb923c"];
export const colorAt = (i: number, c?: string) => c ?? PALETTE[i % PALETTE.length];
