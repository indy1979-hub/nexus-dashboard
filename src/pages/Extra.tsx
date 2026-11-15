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

function SectionBlock({ s }: { s: Section }) {
  const cards = s.cards ?? [];
  const head = cards[0]?.type === "heading" ? String(cards[0].heading ?? "") : "";
  const rest = head ? cards.slice(1) : cards;
  const small = rest.filter((c) => SMALL.has(String(c.type)));
  const big = rest.filter((c) => !SMALL.has(String(c.type)));
  const span = Math.min(4, Math.max(1, s.column_span ?? 2));
  return (
    <Card>
      {head && (
        <div className="eyebrow" style={{ color: "var(--ink-2)", marginBottom: 12, fontSize: 12 }}>
          {head}
        </div>
      )}
      {small.length > 0 && (
        <div className="ha-embed" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10, marginBottom: big.length ? 14 : 0 }}>
          {small.map((c, i) => (
            <HaCard key={i} config={c} />
          ))}
        </div>
      )}
      {big.length > 0 && (
        <div className="ha-embed" style={{ display: "grid", gridTemplateColumns: span >= 3 ? "repeat(auto-fill, minmax(380px, 1fr))" : "1fr", gap: 12 }}>
          {big.map((c, i) => (
            <HaCard key={i} config={c} />
          ))}
        </div>
      )}
    </Card>
  );
}

/** Abschnitte auf zwei Spalten verteilen (jeweils in die kürzere), breite Abschnitte über die volle Breite. */
type Block = { kind: "full"; s: Section } | { kind: "cols"; cols: Section[][] };
const weight = (s: Section) => (s.cards ?? []).reduce((w, c) => w + (SMALL.has(String(c.type)) ? 0.35 : c.type === "heading" ? 0.2 : 3), 0);
function layout(sections: Section[]): Block[] {
  const out: Block[] = [];
  let run: Section[] = [];
  const flush = () => {
    if (!run.length) return;
    const cols: Section[][] = [[], []];
    const h = [0, 0];
    run.forEach((s) => {
      const i = h[0] <= h[1] ? 0 : 1;
      cols[i].push(s);
      h[i] += weight(s);
    });
    out.push({ kind: "cols", cols });
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
    <div className="col" style={{ gap: 18 }}>
      {page.title && (
        <div className="row" style={{ gap: 12, padding: "4px 4px 0" }}>
          <span className="icon-chip">
            <Icon icon={page.icon ?? "mdi:view-dashboard-outline"} width={20} />
          </span>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: ".02em" }}>{page.title}</h1>
        </div>
      )}
      {layout(sections).map((block, bi) =>
        block.kind === "full" ? (
          <SectionBlock key={bi} s={block.s} />
        ) : (
          <div key={bi} className="extra-cols">
            {block.cols.map((col, ci) => (
              <div key={ci} className="col" style={{ gap: 18, minWidth: 0 }}>
                {col.map((s, i) => (
                  <SectionBlock key={i} s={s} />
                ))}
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
