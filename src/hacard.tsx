import { useEffect, useRef, useState } from "react";
import { getHass, subscribe } from "./ha";

/* Bettet eine beliebige Home-Assistant-Karte ein (z. B. picture-elements oder eine Grundriss-Karte). */

interface CardEl extends HTMLElement {
  hass?: unknown;
  setConfig?: (c: unknown) => void;
}
type Helpers = { createCardElement: (c: unknown) => CardEl };

export function HaCard({ config }: { config: Record<string, unknown> }) {
  const host = useRef<HTMLDivElement>(null);
  const el = useRef<CardEl | null>(null);
  const [rev, setRev] = useState(0);
  const key = JSON.stringify(config);

  useEffect(() => {
    let alive = true;
    const w = window as unknown as { loadCardHelpers?: () => Promise<Helpers> };
    (async () => {
      if (!w.loadCardHelpers) return;
      const helpers = await w.loadCardHelpers();
      if (!alive || !host.current) return;
      const card = helpers.createCardElement(JSON.parse(key));
      card.hass = getHass();
      // Karte meldet, dass ihr Element erst jetzt geladen ist -> neu aufbauen
      card.addEventListener("ll-rebuild", (ev) => {
        ev.stopPropagation();
        setRev((r) => r + 1);
      });
      host.current.replaceChildren(card);
      el.current = card;
    })();
    return () => {
      alive = false;
    };
  }, [key, rev]);

  useEffect(
    () =>
      subscribe(() => {
        if (el.current) el.current.hass = getHass();
      }),
    [],
  );

  return <div ref={host} className="ha-card-host" />;
}
