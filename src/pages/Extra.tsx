import { useEffect, useState } from "react";
import { Card, Icon } from "../ui";
import { getHass } from "../ha";
import { HaCard } from "../hacard";
import type { ExtraPageConf } from "../config";

/* Zusatzseite: zeigt Abschnitte einer vorhandenen Home-Assistant-Ansicht (oder eigene Abschnitte) im Nexus-Stil. */

type CardConf = Record<string, unknown> & { type?: string; heading?: string; title?: string };
interface Section {
  column_span?: number;
  cards?: CardConf[];
}

function useSourceSections(page: ExtraPageConf): Section[] {
  const [sections, setSections] = useState<Section[]>(page.sections ?? []);
  const src = page.source;
  useEffect(() => {
    if (!src) return;
    let alive = true;
    (async () => {
      try {
        const cfg = await getHass()!.callWS<{ views: { path?: string; title?: string; sections?: Section[]; cards?: CardConf[] }[] }>({
          type: "lovelace/config",
          url_path: src.dashboard,
        });
        const v = cfg.views.find((x) => x.path === src.view || x.title === src.view) ?? cfg.views[0];
        const secs = v?.sections ?? (v?.cards ? [{ column_span: 4, cards: v.cards }] : []);
        if (alive) setSections(secs);
      } catch {
        if (alive) setSections([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [src?.dashboard, src?.view]);
  return sections;
}

const SMALL = new Set(["tile", "entity", "button", "gauge", "sensor"]);

const MEDIA = new Set(["picture-elements", "picture", "picture-entity", "picture-glance"]);

function SectionBlock({ s }: { s: Section }) {
  const cards = s.cards ?? [];
  const head = cards[0]?.type === "heading" ? String(cards[0].heading ?? "") : "";
  const rest = head ? cards.slice(1) : cards;
  const small = rest.filter((c) => SMALL.has(String(c.type)));
  const media = rest.filter((c) => MEDIA.has(String(c.type)));
  const others = rest.filter((c) => !SMALL.has(String(c.type)) && !MEDIA.has(String(c.type)));
  const span = Math.min(4, Math.max(1, s.column_span ?? 2));
  const grid = (min: number) => ({ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 8 });
  return (
    <Card style={{ padding: "12px 14px" }}>
      {head && (
        <div className="eyebrow" style={{ color: "var(--ink-2)", marginBottom: 8, fontSize: 11 }}>
          {head}
        </div>
      )}
      {small.length > 0 && (
        <div className="ha-embed" style={{ ...grid(150), marginBottom: media.length || others.length ? 10 : 0 }}>
          {small.map((c, i) => (
            <HaCard key={i} config={c} />
          ))}
        </div>
      )}
      {media.length > 0 && others.length > 0 ? (
        <div className="ha-embed media-split">
          <div className="col" style={{ gap: 8 }}>
            {media.map((c, i) => (
              <HaCard key={i} config={c} />
            ))}
          </div>
          <div className="col" style={{ gap: 8, minWidth: 0 }}>
            {others.map((c, i) => (
              <HaCard key={i} config={c} />
            ))}
          </div>
        </div>
      ) : (
        (media.length > 0 || others.length > 0) && (
          <div className="ha-embed" style={span >= 3 ? grid(300) : { display: "grid", gap: 8 }}>
            {[...media, ...others].map((c, i) => (
              <div key={i} style={MEDIA.has(String(c.type)) ? { maxWidth: 260 } : undefined}>
                <HaCard config={c} />
              </div>
            ))}
          </div>
        )
      )}
    </Card>
  );
}

/** Schmale Abschnitte fließen in zwei ausgeglichene Spalten, breite laufen über die volle Breite. */
type Block = { kind: "full"; s: Section } | { kind: "cols"; cols: Section[][] };
function layout(sections: Section[]): Block[] {
  const out: Block[] = [];
  let run: Section[] = [];
  const flush = () => {
    if (!run.length) return;
    out.push({ kind: "cols", cols: [run] });
    run = [];
  };
  sections.forEach((s) => {
    if ((s.column_span ?? 2) >= 3) {
      flush();
      out.push({ kind: "full", s });
    } else run.push(s);
  });
  flush();
  return out;
}

export function ExtraPage({ page }: { page: ExtraPageConf }) {
  const sections = useSourceSections(page);
  return (
    <div className="col" style={{ gap: 12 }}>
      {page.title && (
        <div className="row" style={{ gap: 10, padding: "0 4px" }}>
          <span className="icon-chip">
            <Icon icon={page.icon ?? "mdi:view-dashboard-outline"} width={20} />
          </span>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: ".02em" }}>{page.title}</h1>
        </div>
      )}
      {layout(sections).map((block, bi) =>
        block.kind === "full" ? (
          <SectionBlock key={bi} s={block.s} />
        ) : (
          <div key={bi} className="extra-masonry">
            {block.cols.flat().map((s, i) => (
              <div key={i} className="extra-item">
                <SectionBlock s={s} />
              </div>
            ))}
          </div>
        ),
      )}
      {sections.length === 0 && (
        <Card>
          <div className="sub">Keine Inhalte gefunden.</div>
        </Card>
      )}
    </div>
  );
}
